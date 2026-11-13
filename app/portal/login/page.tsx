
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react"

type LoginStep = 1 | 2 | 3 | 4 | 5 | 6

export default function LoginPage() {
  const router = useRouter()

  const [step, setStep] = useState<LoginStep>(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [manualSecret, setManualSecret] = useState("")
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleCredentials() {
    setError("")

    if (!email.trim() || !password) {
      setError("Ingresa tu correo y contraseña.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/portal/login/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok && data.code === "MFA_ENROLLMENT_REQUIRED") {
        const enrollment = await fetch("/api/portal/mfa/enroll/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email, password }),
        })

        const enrollmentData = await enrollment.json()

        if (!enrollment.ok) {
          setError(
            enrollmentData.error ||
            "No fue posible iniciar el registro MFA."
          )
          return
        }

        setQrCode(enrollmentData.qrCode)
        setManualSecret(enrollmentData.manualSecret)
        setPassword("")
        setCode("")
        setStep(4)
        return
      }

      if (!res.ok) {
        setError(data.error || "No fue posible validar las credenciales.")
        return
      }

      setPassword("")
      setCode("")
      setRecoveryCode("")
      setStep(2)
    } catch {
      setError("No fue posible conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  async function handleEnrollment() {
    setError("")

    if (!/^\d{6}$/.test(code)) {
      setError("Ingresa el código de seis dígitos.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/portal/mfa/enroll/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "No fue posible verificar el código.")
        return
      }

      setRecoveryCodes(data.recoveryCodes || [])
      setCode("")
      setQrCode("")
      setManualSecret("")
      setStep(5)
    } catch {
      setError("No fue posible completar el registro.")
    } finally {
      setLoading(false)
    }
  }

  async function completeLogin() {
    const result = await signIn("mfa-handoff", {
      redirect: false,
      callbackUrl: "/portal/dashboard",
    })

    if (!result || result.error || !result.ok) {
      setError("No fue posible establecer la sesión segura.")
      return false
    }

    setCode("")
    setRecoveryCode("")
    setStep(3)

    router.replace("/portal/dashboard")
    router.refresh()

    return true
  }

  async function handleMFA() {
    setError("")

    if (!/^\d{6}$/.test(code)) {
      setError("Ingresa el código de seis dígitos.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/portal/login/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "El código no es válido.")
        return
      }

      if (data.nextStep !== "complete") {
        setError("No fue posible completar la verificación.")
        return
      }

      await completeLogin()
    } catch {
      setError("Error al completar la autenticación.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRecovery() {
    setError("")

    const normalizedCode = recoveryCode.trim().toUpperCase()

    if (!/^[A-F0-9]{16}$/.test(normalizedCode)) {
      setError("Ingresa un código de recuperación válido.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/portal/login/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ code: normalizedCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "No fue posible validar el código.")
        return
      }

      if (data.nextStep !== "complete") {
        setError("No fue posible completar la verificación.")
        return
      }

      await completeLogin()
    } catch {
      setError("Error al completar la autenticación.")
    } finally {
      setLoading(false)
    }
  }

  const maskedEmail = email
    ? email.slice(0, 2) + "***@" + (email.split("@")[1] || "")
    : ""

  return (
    <div className="min-h-screen flex bg-white">

      {/* Panel institucional */}
      <div
        className="hidden lg:flex w-[42%] flex-col justify-center items-center px-10 py-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, #0f1f5c 0%, #090f2e 60%, #06102a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,162,39,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <Image
              src="/escudo_dorado.jpeg"
              alt="Logo CICE"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>

          <h1
            className="text-white text-2xl font-bold tracking-widest"
            style={{ fontFamily: "Georgia, serif" }}
          >
            CICE
          </h1>

          <p className="text-[#c9a227] text-xs tracking-[0.2em] uppercase mt-1">
            Portal Institucional
          </p>
        </div>

        <p className="relative z-10 text-white/60 text-sm text-center max-w-xs leading-relaxed mb-10">
          Innovación, investigación y ciberseguridad educativa.
          <span className="block text-[#e8c547] mt-2">
            Protección del bienestar digital de niños y adolescentes.
          </span>
        </p>

        <div className="relative z-10 max-w-xs w-full space-y-4">
          {[
            "Autenticación segura",
            "Protección de la información",
            "Acceso según roles institucionales",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#c9a227]" />
              <span className="text-white/70 text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10">
        <div className="w-full max-w-sm">

          <div className="flex items-center gap-2 mb-10">
            <Image
              src="/escudo_dorado.jpeg"
              alt="CICE"
              width={38}
              height={38}
              className="rounded-full object-cover"
            />
            <div>
              <p
                className="text-[#0f1f5c] font-bold text-sm"
                style={{ fontFamily: "Georgia, serif" }}
              >
                my-cice.com
              </p>
              <p className="text-gray-400 text-[10px] tracking-widest uppercase">
                Plataforma institucional
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 mb-8">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className="h-[3px] flex-1 rounded-full"
                style={{
                  background:
                    s < step
                      ? "#c9a227"
                      : s === step
                        ? "#0f1f5c"
                        : "#e2e6f0",
                }}
              />
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-3 mb-5"
            >
              {error}
            </div>
          )}

          {/* Paso 1: credenciales */}
          {step === 1 && (
            <div>
              <h2
                className="text-[#0f1f5c] text-2xl font-bold mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Iniciar sesión
              </h2>

              <p className="text-gray-400 text-sm mb-7">
                Ingresa tus credenciales institucionales.
              </p>

              <div className="mb-5">
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#0f1f5c] mb-2">
                  Correo institucional
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCredentials()
                    }
                    placeholder="usuario@institucion.edu.co"
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg text-sm text-[#0f1f5c] bg-gray-50 focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#0f1f5c] mb-2">
                  Contraseña
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCredentials()
                    }
                    placeholder="Tu contraseña"
                    className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-lg text-sm text-[#0f1f5c] bg-gray-50 focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPass
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCredentials}
                disabled={loading}
                className="w-full py-3 bg-[#0f1f5c] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3180] transition-colors disabled:opacity-60"
              >
                {loading ? "Verificando..." : "Continuar →"}
              </button>
            </div>
          )}

          {/* Paso 2: TOTP */}
          {step === 2 && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setCode("")
                  setRecoveryCode("")
                  setError("")
                }}
                className="text-gray-400 text-xs mb-5 hover:text-[#0f1f5c] flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Volver
              </button>

              <h2
                className="text-[#0f1f5c] text-2xl font-bold mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Verificación de identidad
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Abre tu aplicación de autenticación e introduce el código temporal.
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-3 text-xs text-[#0f1f5c] mb-6">
                Cuenta: <strong>{maskedEmail}</strong>
                <p className="mt-1 text-gray-500">
                  El código cambia periódicamente y es válido por un tiempo limitado.
                </p>
              </div>

              <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#0f1f5c] mb-2">
                Código de autenticación
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && handleMFA()
                }
                placeholder="000000"
                className="w-full py-4 mb-5 border-2 border-gray-200 rounded-lg text-center text-2xl tracking-[0.5em] font-bold text-[#0f1f5c] bg-gray-50 focus:outline-none focus:border-[#c9a227]"
              />

              <button
                type="button"
                onClick={handleMFA}
                disabled={loading || code.length !== 6}
                className="w-full py-3 bg-[#c9a227] text-[#0a0f1e] rounded-lg text-sm font-bold hover:bg-[#e8c547] transition-colors disabled:opacity-50"
              >
                {loading ? "Validando..." : "Verificar y acceder"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCode("")
                  setRecoveryCode("")
                  setError("")
                  setStep(6)
                }}
                className="w-full mt-4 text-sm text-[#0f1f5c] underline hover:text-[#c9a227]"
              >
                Usar un código de recuperación
              </button>
            </div>
          )}

          {/* Paso 4: configuración del autenticador */}
          {step === 4 && (
            <div>
              <h2
                className="text-[#0f1f5c] text-2xl font-bold mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Configurar autenticador
              </h2>

              <p className="text-gray-500 text-sm mb-5">
                Escanea el código QR con Google Authenticator,
                Microsoft Authenticator o 2FAS.
              </p>

              {qrCode && (
                <div className="flex justify-center mb-5">
                  <img
                    src={qrCode}
                    alt="Código QR para configurar autenticador"
                    width={220}
                    height={220}
                    className="border border-gray-200 rounded-lg p-2"
                  />
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5">
                <p className="text-xs text-gray-500 mb-2">
                  Clave manual de configuración:
                </p>
                <p className="text-sm font-mono font-bold text-[#0f1f5c] break-all select-all">
                  {manualSecret}
                </p>
              </div>

              <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#0f1f5c] mb-2">
                Primer código de verificación
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && handleEnrollment()
                }
                placeholder="000000"
                className="w-full py-4 mb-5 border-2 border-gray-200 rounded-lg text-center text-2xl tracking-[0.5em] font-bold text-[#0f1f5c] bg-gray-50"
              />

              <button
                type="button"
                onClick={handleEnrollment}
                disabled={loading || code.length !== 6}
                className="w-full py-3 bg-[#c9a227] text-[#0a0f1e] rounded-lg text-sm font-bold disabled:opacity-50"
              >
                {loading ? "Activando..." : "Confirmar y activar MFA"}
              </button>
            </div>
          )}

          {/* Paso 5: códigos de recuperación */}
          {step === 5 && (
            <div>
              <div className="text-center mb-5">
                <ShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h2 className="text-[#0f1f5c] text-2xl font-bold mb-2">
                  MFA activado
                </h2>
                <p className="text-gray-500 text-sm">
                  Guarda estos códigos. Cada uno puede utilizarse una sola vez.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
                {recoveryCodes.map((recoveryCode) => (
                  <div
                    key={recoveryCode}
                    className="font-mono text-sm text-center text-[#0f1f5c] py-1"
                  >
                    {recoveryCode}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const blob = new Blob(
                    [recoveryCodes.join("\n")],
                    { type: "text/plain" }
                  )
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement("a")
                  link.href = url
                  link.download = "CICE-codigos-recuperacion.txt"
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                className="w-full py-3 mb-3 border border-[#0f1f5c] text-[#0f1f5c] rounded-lg text-sm font-semibold"
              >
                Descargar códigos de recuperación
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecoveryCodes([])
                  setCode("")
                  setError("")
                  setStep(1)
                }}
                className="w-full py-3 bg-[#0f1f5c] text-white rounded-lg text-sm font-semibold"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}

          {/* Paso 6: recuperación */}
          {step === 6 && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setStep(2)
                  setRecoveryCode("")
                  setError("")
                }}
                className="text-gray-400 text-xs mb-5 hover:text-[#0f1f5c] flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Volver a la autenticación
              </button>

              <h2
                className="text-[#0f1f5c] text-2xl font-bold mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Código de recuperación
              </h2>

              <p className="text-gray-500 text-sm mb-6">
                Introduce uno de los códigos que guardaste al configurar
                tu autenticador. Cada código se utiliza una sola vez.
              </p>

              <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#0f1f5c] mb-2">
                Código de recuperación
              </label>

              <input
                type="text"
                autoComplete="off"
                maxLength={16}
                value={recoveryCode}
                onChange={(e) =>
                  setRecoveryCode(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-F0-9]/g, "")
                      .slice(0, 16)
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && handleRecovery()
                }
                placeholder="XXXXXXXXXXXXXXXX"
                className="w-full py-4 mb-5 border-2 border-gray-200 rounded-lg text-center text-lg tracking-widest font-mono font-bold text-[#0f1f5c] bg-gray-50 focus:outline-none focus:border-[#c9a227]"
              />

              <button
                type="button"
                onClick={handleRecovery}
                disabled={loading || recoveryCode.length !== 16}
                className="w-full py-3 bg-[#c9a227] text-[#0a0f1e] rounded-lg text-sm font-bold hover:bg-[#e8c547] transition-colors disabled:opacity-50"
              >
                {loading ? "Validando..." : "Verificar y acceder"}
              </button>
            </div>
          )}

          {/* Paso 3: confirmación */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>

              <h2
                className="text-[#0f1f5c] text-2xl font-bold mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Acceso verificado
              </h2>

              <p className="text-gray-400 text-sm">
                Ingresando al portal institucional...
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-gray-100">
            <ShieldCheck className="w-3 h-3 text-gray-300" />
            <span className="text-[10px] text-gray-400 tracking-wide">
              Privacy by Design · Ley 1581 de 2012
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
