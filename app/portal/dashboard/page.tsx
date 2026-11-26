import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardCICE from "@/components/observatorio/DashboardCICE"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()

  // Exigir sesión autenticada y MFA verificado.
  if (!session?.user?.id || session.mfaVerified !== true) {
    redirect("/portal/login")
  }

  // Exigir un rol institucional válido en la sesión.
  if (!session.user.role) {
    redirect("/portal/login")
  }

  return <DashboardCICE />
}
