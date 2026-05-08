import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/portal/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0f1f5c]">
          Dashboard CICE
        </h1>

        <p className="text-gray-500 mt-2">
          Bienvenido, {session.user?.name}
        </p>

        <p className="text-[#c9a227] text-sm mt-1 uppercase tracking-widest">
          {session.user?.role}
        </p>
      </div>
    </div>
  )
}