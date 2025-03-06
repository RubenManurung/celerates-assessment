import { z } from "zod"

export const userFormSchema = z.object({
  apiSource: z.enum(["jsonplaceholder", "randomuser"]),
  userData: z.any().nullable(),
  template: z.string(),
  branding: z.object({
    companyName: z.string(),
    logo: z.string().optional(),
    primaryColor: z.string(),
    includeWatermark: z.boolean(),
  }),
})

export type UserFormValues = z.infer<typeof userFormSchema>

