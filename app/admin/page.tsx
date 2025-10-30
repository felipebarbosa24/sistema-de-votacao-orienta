"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem("adminAuth", "true")
      router.push("/admin/dashboard")
    } else {
      setError("Usuário ou senha incorretos")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="ADMINISTRADOR" variant="admin" />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-card p-10 border border-neutral-200">
            <div className="bg-[#1e237e] text-white py-4 px-6 rounded-xl mb-8 -mx-2">
              <h2 className="text-xl font-bold text-center uppercase">Acessar - Sistema Votação</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-neutral-700">
                  Email Institucional:
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu email"
                  className="h-12 rounded-lg border-neutral-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-semibold text-neutral-700">
                  CPF:
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="Digite seu CPF"
                  className="h-12 rounded-lg border-neutral-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-neutral-700">
                  Senha:
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="h-12 rounded-lg border-neutral-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-[#00c13e] hover:bg-[#00a835] text-white font-bold rounded-lg text-base uppercase transition-all hover:shadow-lg"
              >
                ACESSAR
              </Button>
            </form>

            <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
              <p className="text-xs text-neutral-600 text-center">
                <strong>Credenciais de teste:</strong>
                <br />
                Usuário: admin | Senha: admin123
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
