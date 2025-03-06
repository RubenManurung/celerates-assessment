"use client"

import type { User } from "@/types/user"
import type { UseFormReturn } from "react-hook-form"
import type { UserFormValues } from "@/lib/validations/user-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface JsonPlaceholderUserFormProps {
  form: UseFormReturn<UserFormValues>
  userData: User
}

export function JsonPlaceholderUserForm({ form, userData }: JsonPlaceholderUserFormProps) {
  const handleInputChange = (path: string, value: string) => {
    const pathParts = path.split(".")
    const newUserData = { ...userData }

    let current: any = newUserData
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]]
    }

    current[pathParts[pathParts.length - 1]] = value
    form.setValue("userData", newUserData)
  }

  return (
    <Tabs defaultValue="personal">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="address">Address</TabsTrigger>
        <TabsTrigger value="company">Company</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={userData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={userData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={userData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={userData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={userData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="address" className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              value={userData.address.street}
              onChange={(e) => handleInputChange("address.street", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suite">Suite</Label>
            <Input
              id="suite"
              value={userData.address.suite}
              onChange={(e) => handleInputChange("address.suite", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={userData.address.city}
              onChange={(e) => handleInputChange("address.city", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipcode">Zipcode</Label>
            <Input
              id="zipcode"
              value={userData.address.zipcode}
              onChange={(e) => handleInputChange("address.zipcode", e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="company" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={userData.company.name}
            onChange={(e) => handleInputChange("company.name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="catchPhrase">Catch Phrase</Label>
          <Input
            id="catchPhrase"
            value={userData.company.catchPhrase}
            onChange={(e) => handleInputChange("company.catchPhrase", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bs">Business Strategy</Label>
          <Input
            id="bs"
            value={userData.company.bs}
            onChange={(e) => handleInputChange("company.bs", e.target.value)}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

