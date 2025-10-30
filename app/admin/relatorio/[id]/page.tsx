"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { storage, type Election } from "@/lib/storage"
import { Download, FileText, ArrowLeft } from "lucide-react"

export default function ReportPage() {
  const router = useRouter()
  const params = useParams()
  const [election, setElection] = useState<Election | null>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin")
      return
    }

    const elections = storage.getElections()
    const found = elections.find((e) => e.id === params.id)
    if (found) {
      setElection(found)
    }
  }, [router, params.id])

  const exportResults = () => {
    if (!election) return

    const totalVotes = election.voters.length
    let csv = "Chapa,Votos,Porcentagem\n"

    election.chapas.forEach((chapa) => {
      const votes = election.votes[chapa.id] || 0
      const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : "0.00"
      csv += `${chapa.name},${votes},${percentage}%\n`
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${election.title.replace(/\s+/g, "-")}.csv`
    a.click()
  }

  const exportVoterList = () => {
    if (!election) return

    let csv = "Nome,CPF,Data e Hora\n"

    election.voters.forEach((voter) => {
      const date = new Date(voter.votedAt).toLocaleString("pt-BR")
      csv += `${voter.name},${voter.cpf},${date}\n`
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ata-votantes-${election.title.replace(/\s+/g, "-")}.csv`
    a.click()
  }

  if (!election) {
    return null
  }

  const totalVotes = election.voters.length

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="ADMINISTRADOR" variant="admin" />

      <main className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={() => router.push("/admin/painel")} variant="outline" className="mb-6 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Painel
          </Button>

          <div className="bg-card rounded-2xl shadow-lg p-8 border border-neutral-200">
            <h2 className="text-2xl font-bold text-primary mb-2">Relatório Eleição</h2>
            <h3 className="text-xl text-muted-foreground mb-6">{election.title}</h3>

            <div className="mb-6 p-4 bg-neutral-100 rounded-xl">
              <p className="text-sm text-muted-foreground">
                Total de Votos: <span className="font-bold text-foreground">{totalVotes}</span>
              </p>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="text-left py-3 px-4 font-semibold text-primary">Chapa Concorrente</th>
                    <th className="text-center py-3 px-4 font-semibold text-primary">Votos</th>
                    <th className="text-center py-3 px-4 font-semibold text-primary">Porcentagem</th>
                  </tr>
                </thead>
                <tbody>
                  {election.chapas.map((chapa) => {
                    const votes = election.votes[chapa.id] || 0
                    const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : "0.00"

                    return (
                      <tr key={chapa.id} className="border-b border-neutral-200">
                        <td className="py-4 px-4 font-medium">{chapa.name}</td>
                        <td className="py-4 px-4 text-center font-semibold">{votes}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full font-semibold">
                            {percentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={exportResults}
                className="flex-1 bg-success hover:bg-success/90 text-white rounded-xl h-12"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Resultado
              </Button>
              <Button onClick={exportVoterList} variant="outline" className="flex-1 rounded-xl h-12 bg-transparent">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Ata de Pessoas que Votaram
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
