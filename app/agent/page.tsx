"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Phone, Users, Clock, CheckCircle, XCircle, Home, Pause, Play, User, Award } from "lucide-react"
import Link from "next/link"

export default function AgentPage() {
  const [currentTicket, setCurrentTicket] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [ticketsServed, setTicketsServed] = useState(23)
  const [averageTime, setAverageTime] = useState("4:32")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [agentName, setAgentName] = useState("Agent DKT-001")
  const [currentTime, setCurrentTime] = useState(new Date())

  const waitingQueue = [
    { number: 156, service: "TECH", waitTime: "8 min", priority: "normal" },
    { number: 157, service: "ADMIN", waitTime: "12 min", priority: "normal" },
    { number: 158, service: "COM", waitTime: "15 min", priority: "urgent" },
    { number: 159, service: "REC", waitTime: "18 min", priority: "normal" },
    { number: 160, service: "INFO", waitTime: "21 min", priority: "normal" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCallNext = () => {
    if (waitingQueue.length > 0) {
      setCurrentTicket(waitingQueue[0].number)
      setStartTime(new Date())
    }
  }

  const handleCompleteService = () => {
    if (currentTicket) {
      setTicketsServed((prev) => prev + 1)
      setCurrentTicket(null)
      setStartTime(null)
    }
  }

  const handleSkipTicket = () => {
    setCurrentTicket(null)
    setStartTime(null)
  }

  const toggleStatus = () => {
    setIsActive(!isActive)
    if (isActive) {
      setCurrentTicket(null)
      setStartTime(null)
    }
  }

  const getServiceTime = () => {
    if (startTime) {
      const now = new Date()
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000)
      const minutes = Math.floor(diff / 60)
      const seconds = diff % 60
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
    return "0:00"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            DKT Solutions
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Interface Agent - Gestion des appels</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Heure</div>
            <div className="font-mono text-lg font-bold text-emerald-600">
              {currentTime.toLocaleTimeString("fr-FR")}
            </div>
          </div>
          <Button onClick={toggleStatus} variant={isActive ? "destructive" : "default"} className="flex items-center">
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Activer
              </>
            )}
          </Button>
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profil Agent */}
        <Card className="border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center text-emerald-700">
              <User className="w-5 h-5 mr-2" />
              Profil Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-emerald-600" />
              </div>
              <Input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="text-center font-medium"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Statut:</span>
                <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {isActive ? "En service" : "Hors service"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tickets servis:</span>
                <span className="font-bold text-emerald-600">{ticketsServed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Temps moyen:</span>
                <span className="text-gray-600 font-mono">{averageTime}</span>
              </div>
              {currentTicket && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Service actuel:</span>
                  <span className="font-mono text-lg font-bold text-blue-600">{getServiceTime()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ticket actuel */}
        <Card className="lg:col-span-2 border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center text-blue-700">
              <Phone className="w-6 h-6 mr-3" />
              Ticket en cours de traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {currentTicket ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-3">N° {currentTicket}</div>
                  <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-base">Service en cours</Badge>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Temps écoulé</div>
                    <div className="text-2xl font-mono font-bold text-gray-800">{getServiceTime()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleCompleteService} className="bg-green-600 hover:bg-green-700 h-12">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Service terminé
                  </Button>
                  <Button
                    onClick={handleSkipTicket}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 h-12"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reporter
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-4">Aucun client en service</p>
                <Button
                  onClick={handleCallNext}
                  disabled={!isActive || waitingQueue.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8"
                >
                  Appeler le prochain client
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File d'attente */}
        <Card className="border-2 border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="flex items-center text-purple-700">
              <Users className="w-5 h-5 mr-2" />
              File d'attente ({waitingQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {waitingQueue.slice(0, 8).map((ticket, index) => (
                <div
                  key={ticket.number}
                  className={`p-3 rounded-lg border transition-all ${
                    index === 0
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="font-bold text-lg">{ticket.number}</div>
                      <Badge variant="secondary" className="text-xs">
                        {ticket.service}
                      </Badge>
                      {ticket.priority === "urgent" && (
                        <Badge className={getPriorityColor(ticket.priority)}>Urgent</Badge>
                      )}
                    </div>
                    {index === 0 && <Badge className="bg-green-100 text-green-800">Suivant</Badge>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {ticket.waitTime}
                    </div>
                    <div className="text-xs text-gray-400">Position {index + 1}</div>
                  </div>
                </div>
              ))}
              {waitingQueue.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  Aucun client en attente
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques de performance */}
      <div className="grid md:grid-cols-4 gap-6 mt-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-600">{ticketsServed}</p>
                <p className="text-xs text-green-600">+5 vs hier</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-green-600">97%</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-orange-600">{averageTime}</p>
                <p className="text-xs text-orange-600">Optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-purple-600">{waitingQueue.length}</p>
                <p className="text-xs text-purple-600">File normale</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
