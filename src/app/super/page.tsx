import AuthMiddleware from "@/components/middleware/authMiddleware"; 
import SuperForm from "@/components/views/super-form"; 

export default function SuperHome() {
  return (
    <AuthMiddleware rolesAllowed={["super"]}> 
      <main className="flex min-h-screen bg-white">
        <SuperForm />
      </main>
    </AuthMiddleware>
  );
}
