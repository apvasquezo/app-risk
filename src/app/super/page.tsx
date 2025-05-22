import AuthMiddleware from "@/hooks/authMiddleware"; 
import SuperForm from "@/components/views/super-form"; 

export default function Home() {
  return (
    <AuthMiddleware rolesAllowed={["super"]}> {/* Protege la ruta solo para usuarios con rol "super" */}
      <main className="flex min-h-screen bg-white">
        <SuperForm />
      </main>
    </AuthMiddleware>
  );
}
