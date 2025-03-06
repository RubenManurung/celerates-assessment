"use client"

import type { RandomUser } from "@/types/user"
import type { UseFormReturn } from "react-hook-form"
import type { UserFormValues } from "@/lib/validations/user-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface RandomUserFormProps {
  form: UseFormReturn<UserFormValues>
  userData: RandomUser
}

export function RandomUserForm({ form, userData }: RandomUserFormProps) {
  const handleInputChange = (path: string, value: string | number) => {
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
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="address">Address</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4 pt-4">
        {userData.picture && (
          <div className="flex justify-center mb-4">
            <div className="relative h-32 w-32 rounded-full overflow-hidden">
              <Image
                src={userData.picture.large || "/placeholder.svg"}
                alt="User profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={userData.name.title}
              onChange={(e) => handleInputChange("name.title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={userData.name.first}
              onChange={(e) => handleInputChange("name.first", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={userData.name.last}
              onChange={(e) => handleInputChange("name.last", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input id="gender" value={userData.gender} onChange={(e) => handleInputChange("gender", e.target.value)} />
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={userData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cell">Cell</Label>
            <Input id="cell" value={userData.cell} onChange={(e) => handleInputChange("cell", e.target.value)} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="address" className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="streetNumber">Street Number</Label>
            <Input
              id="streetNumber"
              type="number"
              value={userData.location.street.number}
              onChange={(e) => handleInputChange("location.street.number", Number.parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetName">Street Name</Label>
            <Input
              id="streetName"
              value={userData.location.street.name}
              onChange={(e) => handleInputChange("location.street.name", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={userData.location.city}
              onChange={(e) => handleInputChange("location.city", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={userData.location.state}
              onChange={(e) => handleInputChange("location.state", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={userData.location.country}
              onChange={(e) => handleInputChange("location.country", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              value={userData.location.postcode}
              onChange={(e) => handleInputChange("location.postcode", e.target.value)}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

