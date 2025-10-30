"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { storage, type Election } from "@/lib/storage"
import { PlusCircle, BarChart3, Trash2, LogOut } from "lucide-react"

export default function AdminPanelPage() {
  const router = useRouter()
  const [elections, setElections] = useState<Election[]>([])

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin")
      return
    }

    setElections(storage.getElections())
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin")
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta eleição?")) {
      const updated = elections.filter((e) => e.id !== id)
      storage.saveElections(updated)
      setElections(updated)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="ADMINISTRADOR" variant="admin" />

      <main className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <aside className="md:w-64 space-y-2">
              <Button
                onClick={() => router.push("/admin/criar")}
                className="w-full justify-start gap-2 bg-secondary hover:bg-secondary/90 text-white rounded-xl h-12"
              >
                <PlusCircle className="w-5 h-5" />
                Criar Votação
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start gap-2 rounded-xl h-12 bg-transparent"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </Button>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <Button
                  onClick={() => router.push("/admin/criar")}
                  className="bg-success hover:bg-success/90 text-white rounded-xl h-12 px-6"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  CRIAR NOVA VOTAÇÃO
                </Button>
              </div>

              <div className="space-y-4">
                {elections.length === 0 ? (
                  <div className="bg-card rounded-2xl shadow-lg p-12 border border-neutral-200 text-center">
                    <p className="text-muted-foreground">Nenhuma eleição criada ainda</p>
                  </div>
                ) : (
                  elections.map((election) => (
                    <div key={election.id} className="bg-card rounded-2xl shadow-lg p-6 border border-neutral-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-primary mb-1">{election.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{election.description}</p>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full font-medium ${
                                election.status === "open"
                                  ? "bg-success/10 text-success"
                                  : "bg-neutral-200 text-neutral-700"
                              }`}
                            >
                              {election.status === "open" ? "Aberta" : "Encerrada"}
                            </span>
                            <span className="text-muted-foreground">
                              Término: {new Date(election.endDate).toLocaleDateString("pt-BR")}
                            </span>
                            <span className="text-muted-foreground">Total de votos: {election.voters.length}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => router.push(`/admin/relatorio/${election.id}`)}
                            className="bg-secondary hover:bg-secondary/90 text-white rounded-xl"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Ver Relatório
                          </Button>
                          <Button
                            onClick={() => handleDelete(election.id)}
                            variant="destructive"
                            className="rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
