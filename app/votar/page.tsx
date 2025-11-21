"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { storage, type Election } from "@/lib/storage"

export default function VotingBallotPage() {
  const router = useRouter()
  const [election, setElection] = useState<Election | null>(null)
  const [selectedChapa, setSelectedChapa] = useState<string | null>(null)
  const [voter, setVoter] = useState<{ name: string; cpf: string } | null>(null)

  useEffect(() => {
    const voterData = localStorage.getItem("voter")
    if (!voterData) {
      router.push("/")
      return
    }

    setVoter(JSON.parse(voterData))
    const activeElection = storage.getActiveElection()

    if (!activeElection) {
      router.push("/")
      return
    }

    setElection(activeElection)
  }, [router])

  const handleConfirm = () => {
    if (!selectedChapa || !election || !voter) return

    storage.addVote(election.id, selectedChapa, {
      name: voter.name,
      cpf: voter.cpf,
      votedAt: new Date().toISOString(),
    })

    localStorage.removeItem("voter")
    router.push("/confirmacao")
  }

  if (!election) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="ESTUDANTE" variant="student" />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-card p-10 border border-neutral-200">
            <div className="bg-[#1e237e] text-white py-4 px-6 rounded-xl mb-8 -mx-2">
              <h2 className="text-xl font-bold text-center uppercase">Cédula Votação - {election.title}</h2>
            </div>

            <div className="space-y-4 mb-8">
              {election.chapas.map((chapa) => (
                <button
                  key={chapa.id}
                  onClick={() => setSelectedChapa(chapa.id)}
                  className={`w-full p-5 rounded-lg border-2 transition-all font-bold text-base uppercase ${
                    selectedChapa === chapa.id
                      ? "border-[#007bce] bg-[#007bce] text-white shadow-lg scale-[1.02]"
                      : "border-[#007bce] bg-white text-[#007bce] hover:bg-[#007bce] hover:text-white hover:shadow-md"
                  }`}
                >
                  {chapa.name}
                </button>
              ))}
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!selectedChapa}
              className="w-full h-14 bg-[#00c13e] hover:bg-[#00a835] text-white font-bold rounded-lg text-base uppercase transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              CONFIRMAR MEU VOTO
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
