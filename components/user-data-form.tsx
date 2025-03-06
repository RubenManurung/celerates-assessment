"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Download, RefreshCw, Eye } from "lucide-react";
import {
  userFormSchema,
  type UserFormValues,
} from "@/lib/validations/user-form";
import { fetchJsonPlaceholderUsers, fetchRandomUser } from "@/lib/api";
import {
  generateJsonPlaceholderUserPdf,
  generateRandomUserPdf,
} from "@/lib/pdf-generator";
import type { ApiSource, PdfTemplate, User, RandomUser } from "@/types/user";
import { JsonPlaceholderUserForm } from "@/components/json-placeholder-user-form";
import { RandomUserForm } from "@/components/random-user-form";
import { PdfPreview } from "@/components/pdf-preview";

const templates: PdfTemplate[] = [
  {
    id: "modern",
    name: "Modern Resume",
    description:
      "A modern resume layout with gradient header and profile photo",
  },
  {
    id: "template1",
    name: "Table Layout",
    description: "A simple table-based layout for the PDF",
  },
  {
    id: "template2",
    name: "Section Layout",
    description: "A section-based layout with clear divisions",
  },
  {
    id: "template3",
    name: "Simple Layout",
    description: "A basic layout with minimal styling",
  },
];

export function UserDataForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState<boolean>(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      apiSource: "randomuser", // Changed to randomuser since we need the profile photo
      userData: null,
      template: "modern", // Set modern as default
      branding: {
        companyName: "Celerates",
        logo: "",
        primaryColor: "#3b82f6",
        includeWatermark: false, // Disabled by default for modern template
      },
    },
  });

  const apiSource = form.watch("apiSource") as ApiSource;
  const userData = form.watch("userData");

  async function fetchData() {
    setIsLoading(true);

    try {
      if (apiSource === "jsonplaceholder") {
        const users = await fetchJsonPlaceholderUsers();
        form.setValue("userData", users[0]);
      } else {
        const response = await fetchRandomUser();
        form.setValue("userData", response.results[0]);
      }

      toast({
        title: "Data fetched successfully",
        description: "User data has been loaded from the API",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data",
        description: "Failed to load user data from the API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function generatePdf() {
    if (!userData) {
      toast({
        title: "No user data",
        description: "Please fetch user data first",
        variant: "destructive",
      });
      return null;
    }

    setIsPdfLoading(true);

    try {
      const { template, branding } = form.getValues();
      let doc;

      if (apiSource === "jsonplaceholder") {
        doc = generateJsonPlaceholderUserPdf(userData as User, {
          template,
          branding,
        });
      } else {
        doc = generateRandomUserPdf(userData as RandomUser, {
          template,
          branding,
        });
      }

      // Generate data URL for preview
      const dataUrl = doc.output("dataurlstring");
      setPdfDataUrl(dataUrl);

      toast({
        title: "PDF generated",
        description: "Your PDF has been generated successfully",
      });

      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating PDF",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsPdfLoading(false);
    }
  }

  function downloadPdf() {
    if (!userData) {
      toast({
        title: "No user data",
        description: "Please fetch user data first",
        variant: "destructive",
      });
      return;
    }

    setIsPdfLoading(true);

    try {
      const doc = generatePdf();
      if (doc) {
        doc.save(
          `${userData.name.title} ${userData.name.first} ${
            userData.name.last
          }-${new Date().getTime()}.pdf`
        );

        toast({
          title: "PDF downloaded",
          description: "Your PDF has been downloaded successfully",
        });
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error downloading PDF",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    } finally {
      setIsPdfLoading(false);
    }
  }

  function previewPdf() {
    try {
      const doc = generatePdf();
      if (doc) {
        setIsPdfPreviewOpen(true);
      }
    } catch (error) {
      console.error("Error previewing PDF:", error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Data Source</CardTitle>
              <CardDescription>
                Select the API source to fetch user data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="apiSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Source</FormLabel>
                      <Select
                        onValueChange={(value: ApiSource) => {
                          field.onChange(value);
                          form.setValue("userData", null);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select API source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="jsonplaceholder">
                            JSONPlaceholder Users API
                          </SelectItem>
                          <SelectItem value="randomuser">
                            Random User API
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose which API to fetch user data from
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    onClick={fetchData}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Fetch Data
                      </>
                    )}
                  </Button>

                  {userData && (
                    <p className="text-sm text-muted-foreground">
                      User data loaded successfully
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {userData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>User Data</CardTitle>
                  <CardDescription>
                    Edit the user data before generating the PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {apiSource === "jsonplaceholder" ? (
                    <JsonPlaceholderUserForm
                      form={form}
                      userData={userData as User}
                    />
                  ) : (
                    <RandomUserForm
                      form={form}
                      userData={userData as RandomUser}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>PDF Options</CardTitle>
                  <CardDescription>Customize the PDF output</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="template">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="template">Template</TabsTrigger>
                      <TabsTrigger value="branding">Branding</TabsTrigger>
                    </TabsList>
                    <TabsContent value="template" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="template"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PDF Template</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {templates.map((template) => (
                                  <SelectItem
                                    key={template.id}
                                    value={template.id}
                                  >
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {
                                templates.find((t) => t.id === field.value)
                                  ?.description
                              }
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="branding" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="branding.companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              This will appear in the PDF header
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="branding.primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input type="color" {...field} />
                              </FormControl>
                              <div
                                className="h-8 w-8 rounded-full border"
                                style={{ backgroundColor: field.value }}
                              />
                            </div>
                            <FormDescription>
                              Used for headings and accents in the PDF
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="branding.includeWatermark"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Watermark
                              </FormLabel>
                              <FormDescription>
                                Add a watermark with the company name
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col md:flex-row gap-y-4 justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previewPdf}
                    disabled={isPdfLoading}
                  >
                    {isPdfLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}
                    Preview PDF
                  </Button>
                  <Button
                    type="button"
                    onClick={downloadPdf}
                    disabled={isPdfLoading}
                  >
                    {isPdfLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </form>
      </Form>

      {isPdfPreviewOpen && pdfDataUrl && (
        <PdfPreview
          dataUrl={pdfDataUrl}
          onClose={() => setIsPdfPreviewOpen(false)}
        />
      )}
    </>
  );
}
