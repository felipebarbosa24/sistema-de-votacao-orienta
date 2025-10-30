"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type Election } from "@/lib/storage"
import { ArrowLeft, Lock, Download, Users, BarChart3 } from "lucide-react"

export default function ElectionDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [election, setElection] = useState<Election | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
    loadElection()
  }, [router, params.id])

  const loadElection = () => {
    const elections = storage.getElections()
    const found = elections.find((e) => e.id === params.id)
    setElection(found || null)
  }

  const handleCloseElection = () => {
    if (!election) return
    const elections = storage.getElections()
    const updated = elections.map((e) => (e.id === election.id ? { ...e, status: "closed" as const } : e))
    storage.saveElections(updated)
    loadElection()
  }

  const exportResults = () => {
    if (!election) return

    const totalVotes = Object.values(election.votes).reduce((a, b) => a + b, 0)
    const results = election.chapas
      .map((chapa) => {
        const votes = election.votes[chapa.id] || 0
        const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : "0.00"
        return `Chapa ${chapa.number} - ${chapa.name}: ${votes} votos (${percentage}%)`
      })
      .join("\n")

    const content = `RELATÓRIO DE ELEIÇÃO\n\n${election.title}\n${election.description}\n\nStatus: ${
      election.status === "open" ? "Aberta" : "Fechada"
    }\nTotal de Votos: ${totalVotes}\nTotal de Eleitores: ${election.voters.length}\n\nRESULTADOS:\n\n${results}\n\nELEITORES:\n\n${election.voters.map((v) => `${v.name} (CPF: ${v.cpf}) - Votou em: ${new Date(v.votedAt).toLocaleString("pt-BR")}`).join("\n")}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${election.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated || !election) {
    return null
  }

  const totalVotes = Object.values(election.votes).reduce((a, b) => a + b, 0)
  const sortedChapas = [...election.chapas].sort((a, b) => (election.votes[b.id] || 0) - (election.votes[a.id] || 0))

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="DETALHES DA ELEIÇÃO" variant="admin" />

      <main className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => router.push("/admin/eleicoes")} variant="outline" className="gap-2 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex gap-2">
              {election.status === "open" && (
                <Button
                  onClick={handleCloseElection}
                  variant="outline"
                  className="gap-2 rounded-xl text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-transparent"
                >
                  <Lock className="h-4 w-4" />
                  Encerrar Eleição
                </Button>
              )}
              <Button onClick={exportResults} className="gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white">
                <Download className="h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>

          <Card className="rounded-2xl border-neutral-200 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{election.title}</CardTitle>
                  <CardDescription className="mt-2">{election.description}</CardDescription>
                </div>
                <span
                  className={`text-sm px-4 py-2 rounded-full font-medium ${
                    election.status === "open" ? "bg-success/10 text-success" : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {election.status === "open" ? "Aberta" : "Fechada"}
                </span>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="rounded-2xl border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Votos</CardTitle>
                <BarChart3 className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{totalVotes}</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Eleitores</CardTitle>
                <Users className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{election.voters.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border-neutral-200 mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Resultados por Chapa</CardTitle>
              <CardDescription>Votos recebidos por cada chapa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedChapas.map((chapa, index) => {
                const votes = election.votes[chapa.id] || 0
                const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
                return (
                  <div key={chapa.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
                          {chapa.number}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{chapa.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {votes} {votes === 1 ? "voto" : "votos"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{percentage.toFixed(1)}%</div>
                        {index === 0 && totalVotes > 0 && (
                          <span className="text-xs text-success font-medium">Vencedor</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-neutral-200">
            <CardHeader>
              <CardTitle className="text-xl">Lista de Eleitores</CardTitle>
              <CardDescription>Todos os eleitores que participaram desta eleição</CardDescription>
            </CardHeader>
            <CardContent>
              {election.voters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhum voto registrado ainda</div>
              ) : (
                <div className="space-y-2">
                  {election.voters.map((voter, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{voter.name}</p>
                        <p className="text-sm text-muted-foreground">CPF: {voter.cpf}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(voter.votedAt).toLocaleString("pt-BR")}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
