import { UserDataForm } from "@/components/user-data-form"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">User Profile PDF Generator</h1>
          <p className="text-muted-foreground mt-2">
            Fetch user data, customize it, and generate a professional PDF document
          </p>
        </div>
        <UserDataForm />
      </div>
    </main>
  )
}

