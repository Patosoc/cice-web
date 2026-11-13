// app/portal/login/page.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, Mail, ChevronDown, Eye, EyeOff, ShieldCheck } from "lucide-react"

const ROLES = [
  { value: "rector",      label: "Rector / Directivo IE" },
  { value: "coordinador", label: "Coordinador académico" },
  { value: "secretaria",  label: "Secretaría de Educación" },
  { value: "analista",    label: "Analista CICE" },
  { value: "comite",      label: "Comité Ético-Tecnológico" },
  { value: "superadmin",  label: "Superadministrador" },
]

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [role, setRole]       = useState("")
  const [email, setEmail]     = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [mfaCode, setMfaCode]   = useState(["", "", "", "", "", ""])
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  // Paso 1 → 2: validar credenciales
  async function handleCredentials() {
    setError("")
    if (!role)  return setError("Selecciona tu rol institucional.")
    if (!email) return setError("Ingresa tu correo institucional.")
    if (password.length < 6) return setError("Contraseña demasiado corta.")

    setLoading(true)
    const res = await signIn("credentials", {
      email, password, role,
      redirect: false,
    })
    setLoading(false)

    if (res?.error) {
      setError("Credenciales incorrectas. Verifica tus datos.")
    } else {
      setStep(2) // Ir a MFA
    }
  }

  // MFA: manejo de dígitos
  function handleMfaInput(index: number, value: string) {
    if (!/^[0-9]?$/.test(value)) return
    const next = [...mfaCode]
    next[index] = value
    setMfaCode(next)
    if (value && index < 5) {
      document.getElementById(`mfa-${index + 1}`)?.focus()
    }
  }

  function handleMfaKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !mfaCode[index] && index > 0) {
      document.getElementById(`mfa-${index - 1}`)?.focus()
    }
  }

  // Paso 2 → 3: verificar MFA (por ahora cualquier 6 dígitos)
  function handleMFA() {
    setError("")
    if (mfaCode.some((d) => d === "")) return setError("Ingresa los 6 dígitos del código.")
    // Aquí irá la verificación real con TOTP más adelante
    setStep(3)
    setTimeout(() => router.push("/portal/dashboard"), 1500)
  }

  const maskedEmail = email ? email.slice(0, 2) + "***@" + email.split("@")[1] : ""

  return (
    <div className="min-h-screen flex">

      {/* Panel izquierdo — institucional */}
      <div className="hidden lg:flex w-[42%] flex-col justify-center items-center px-10 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(155deg, #0f1f5c 0%, #090f2e 60%, #06102a 100%)" }}>

        {/* Grid decorativo */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(201,162,39,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <Image src="/escudo_dorado.jpeg" alt="Logo CICE" width={80} height={80} className="rounded-full object-cover" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-widest" style={{ fontFamily: "Georgia, serif" }}>CICE</h1>
          <p className="text-[#c9a227] text-xs tracking-[0.2em] uppercase mt-1">Portal Institucional</p>
        </div>

        <p className="relative z-10 text-white/50 text-sm text-center max-w-xs leading-relaxed mb-8">
          Infraestructura sociotécnica para la{" "}
          <span className="text-[#e8c547]">gestión ética del riesgo digital educativo</span>.
          Protección real del bienestar infantil.
        </p>

        <div className="relative z-10 w-full max-w-xs">
          <p className="text-[#c9a227] text-[10px] tracking-[0.18em] uppercase font-semibold mb-3">
            Roles del sistema
          </p>
          {ROLES.map((r) => (
            <div key={r.value} className="flex items-center gap-2 px-3 py-2 mb-1 rounded-md"
              style={{ border: "0.5px solid rgba(201,162,39,0.2)", background: "rgba(255,255,255,0.02)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227] flex-shrink-0" />
              <span className="text-white/65 text-xs">{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Logo móvil */}
          <div className="flex items-center gap-2 mb-8">
            <Image src="/escudo_dorado.jpeg" alt="CICE" width={36} height={36} className="rounded-full object-cover" />
            <div>
              <p className="text-[#0f1f5c] font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>my-cice.com</p>
              <p className="text-gray-400 text-[10px] tracking-widest uppercase">Plataforma institucional</p>
            </div>
          </div>

          {/* Indicador de pasos */}
          <div className="flex gap-1.5 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-[3px] w-7 rounded-full transition-all duration-300"
                style={{ background: s < step ? "#c9a227" : s === step ? "#0f1f5c" : "#e2e6f0" }} />
            ))}
          </div>

          {/* STEP 1: Credenciales */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="text-[#0f1f5c] text-2xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>
                Iniciar sesión
              </h2>
              <p className="text-gray-400 text-sm mb-6">Selecciona tu rol e ingresa tus credenciales institucionales.</p>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2 mb-4">{error}</div>}

              {/* Rol */}
              <div className="mb-4">
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#0f1f5c] mb-1.5">Rol institucional</label>
                <div className="relative">
                  <select value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-[#0f1f5c] bg-gray-50 appearance-none focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20">
                    <option value="">— Selecciona tu rol —</option>
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#0f1f5c] mb-1.5">Correo institucional</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@institucion.edu.co"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#0f1f5c] bg-gray-50 focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20"
                    onKeyDown={(e) => e.key === "Enter" && handleCredentials()} />
                </div>
              </div>

              {/* Contraseña */}
              <div className="mb-5">
                <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#0f1f5c] mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm text-[#0f1f5c] bg-gray-50 focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20"
                    onKeyDown={(e) => e.key === "Enter" && handleCredentials()} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f1f5c]">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button onClick={handleCredentials} disabled={loading}
                className="w-full py-2.5 bg-[#0f1f5c] text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-[#1a3180] transition-colors disabled:opacity-60">
                {loading ? "Verificando..." : "Continuar →"}
              </button>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 text-xs text-[#0f1f5c] border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  Recuperar acceso
                </button>
                <button className="flex-1 py-2 text-xs text-[#0f1f5c] border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  Registrar IE
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MFA */}
          {step === 2 && (
            <div className="animate-fade-up">
              <button onClick={() => setStep(1)} className="text-gray-400 text-xs mb-4 hover:text-[#0f1f5c] flex items-center gap-1">← Volver</button>
              <h2 className="text-[#0f1f5c] text-2xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>Verificación MFA</h2>
              <p className="text-gray-400 text-sm mb-5">Ingresa el código de 6 dígitos enviado a tu correo.</p>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2 mb-4">{error}</div>}

              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 text-xs text-[#0f1f5c] mb-5 leading-relaxed">
                Código enviado a <span className="text-[#c9a227] font-semibold">{maskedEmail}</span><br />
                Válido por <span className="text-[#c9a227] font-semibold">5 minutos</span>. No compartas este código.
              </div>

              <div className="grid grid-cols-6 gap-2 mb-5">
                {mfaCode.map((digit, i) => (
                  <input key={i} id={`mfa-${i}`} type="text" inputMode="numeric"
                    maxLength={1} value={digit}
                    onChange={(e) => handleMfaInput(i, e.target.value)}
                    onKeyDown={(e) => handleMfaKeyDown(i, e)}
                    className="aspect-square border-2 border-gray-200 rounded-lg text-center text-lg font-bold text-[#0f1f5c] bg-gray-50 focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20" />
                ))}
              </div>

              <button onClick={handleMFA}
                className="w-full py-2.5 bg-[#c9a227] text-[#0a0f1e] rounded-lg text-sm font-bold tracking-wide hover:bg-[#e8c547] transition-colors">
                Verificar y acceder
              </button>
              <div className="text-center mt-3">
                <button className="text-[#c9a227] text-xs underline">¿No recibiste el código? Reenviar</button>
              </div>
            </div>
          )}

          {/* STEP 3: Éxito */}
          {step === 3 && (
            <div className="animate-fade-up text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-[#0f1f5c] text-2xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>Acceso verificado</h2>
              <p className="text-gray-400 text-sm mb-4">Cargando tu espacio de trabajo institucional...</p>
              <div className="inline-block px-4 py-1.5 bg-[#0f1f5c] text-[#c9a227] rounded-full text-xs font-semibold tracking-widest uppercase">
                {ROLES.find((r) => r.value === role)?.label}
              </div>
            </div>
          )}

          {/* Pie de seguridad */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100">
            <ShieldCheck className="w-3 h-3 text-gray-300" />
            <span className="text-[10px] text-gray-300 tracking-wide">TLS 1.3 · Privacy by Design · Ley 1581/2012</span>
          </div>

        </div>
      </div>
    </div>
  )
}