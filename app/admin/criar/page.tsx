"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { storage, type Election } from "@/lib/storage"
import { PlusCircle, X } from "lucide-react"

export default function CreateElectionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [chapas, setChapas] = useState<Array<{ name: string; number: number }>>([{ name: "", number: 1 }])

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin")
    }
  }, [router])

  const addChapa = () => {
    setChapas([...chapas, { name: "", number: chapas.length + 1 }])
  }

  const removeChapa = (index: number) => {
    if (chapas.length > 1) {
      setChapas(chapas.filter((_, i) => i !== index))
    }
  }

  const updateChapa = (index: number, name: string) => {
    const updated = [...chapas]
    updated[index].name = name
    setChapas(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !startDate || !endDate) {
      alert("Por favor, preencha todos os campos")
      return
    }

    if (chapas.some((c) => !c.name.trim())) {
      alert("Por favor, preencha o nome de todas as chapas")
      return
    }

    const newElection: Election = {
      id: Date.now().toString(),
      title,
      description,
      startDate,
      endDate,
      chapas: chapas.map((c) => ({
        id: `chapa-${c.number}`,
        name: c.name,
        number: c.number,
      })),
      votes: {},
      voters: [],
      status: "open",
    }

    const elections = storage.getElections()
    storage.saveElections([...elections, newElection])

    router.push("/admin/painel")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="ADMINISTRADOR" variant="admin" />

      <main className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-card rounded-2xl shadow-lg p-8 border border-neutral-200">
            <h2 className="text-2xl font-bold text-primary mb-6">Criar Votação</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Votação</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Eleição Grêmio Estudantil 2025"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a eleição..."
                  className="rounded-xl min-h-24"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Chapas Concorrentes</Label>
                  <Button type="button" onClick={addChapa} variant="outline" className="rounded-xl bg-transparent">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Adicionar Chapa
                  </Button>
                </div>

                {chapas.map((chapa, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={chapa.name}
                      onChange={(e) => updateChapa(index, e.target.value)}
                      placeholder={`Nome da Chapa ${chapa.number}`}
                      className="h-12 rounded-xl"
                    />
                    {chapas.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeChapa(index)}
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => router.push("/admin/painel")}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-12 bg-success hover:bg-success/90 text-white rounded-xl">
                  Salvar Votação
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
