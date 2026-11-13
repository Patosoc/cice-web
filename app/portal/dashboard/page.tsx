
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()

  // Exigir una sesión autenticada y MFA verificado.
  if (!session?.user?.id || session.mfaVerified !== true) {
    redirect("/portal/login")
  }

  // El rol proviene de la sesión creada en el servidor.
  const role = session.user.role

  if (!role) {
    redirect("/portal/login")
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <section className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-[#0f1f5c]">
          Dashboard CICE
        </h1>

        <p className="text-gray-600 mt-4">
          Bienvenido, {session.user.name ?? "Usuario"}
        </p>

        <p className="text-[#c9a227] text-sm mt-2 uppercase tracking-widest font-semibold">
          {role}
        </p>

        <p className="text-green-700 text-sm mt-6">
          Autenticación multifactor verificada
        </p>
      </section>
    </main>
  )
}
