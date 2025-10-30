"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"

export default function ConfirmationPage() {
  const router = useRouter()
  const [dateTime, setDateTime] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const now = new Date()
    const formatted = now.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    setDateTime(formatted)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const redirectTimeout = setTimeout(() => {
      router.push("/")
    }, 4000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(redirectTimeout)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="CONFIRMAÇÃO DA VOTAÇÃO" variant="student" />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-card p-10 border border-neutral-200">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="w-full bg-[#00c13e] text-white py-12 px-8 rounded-xl border-4 border-[#00a835] shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Voto Registrado</h2>
                <h2 className="text-3xl md:text-4xl font-bold">com Sucesso!</h2>
              </div>

              <div className="text-base text-neutral-700">
                <span className="font-semibold">Data e Hora:</span> {dateTime}
              </div>

              <div className="w-full max-w-md space-y-3">
                <div className="w-full bg-neutral-300 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-neutral-500 h-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2 text-neutral-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Processando...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
