import LoginForm from "@/components/views/login-form"
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-white">
      <LoginForm />
      <Toaster /> 
    </main>
  )
}