"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, Ticket, AlertCircle, CheckCircle, Home, Building2, Star } from "lucide-react"
import Link from "next/link"

export default function ClientPage() {
  const [selectedService, setSelectedService] = useState("")
  const [currentTicket, setCurrentTicket] = useState<number | null>(null)
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  const [estimatedWait, setEstimatedWait] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const services = [
    { id: "1", name: "Consultation technique", code: "TECH", avgTime: "15 min", icon: "🔧" },
    { id: "2", name: "Support administratif", code: "ADMIN", avgTime: "10 min", icon: "📋" },
    { id: "3", name: "Service commercial", code: "COM", avgTime: "12 min", icon: "💼" },
    { id: "4", name: "Réclamations", code: "REC", avgTime: "20 min", icon: "📞" },
    { id: "5", name: "Informations générales", code: "INFO", avgTime: "5 min", icon: "ℹ️" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleReserveTicket = () => {
    if (selectedService) {
      const ticketNumber = Math.floor(Math.random() * 200) + 100
      const position = Math.floor(Math.random() * 15) + 1
      const selectedServiceData = services.find((s) => s.id === selectedService)
      const baseTime = Number.parseInt(selectedServiceData?.avgTime || "10")
      const wait = (position * baseTime) / 3

      setCurrentTicket(ticketNumber)
      setQueuePosition(position)
      setEstimatedWait(Math.round(wait))
    }
  }

  const handleCancelReservation = () => {
    setCurrentTicket(null)
    setQueuePosition(null)
    setEstimatedWait(null)
    setSelectedService("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            DKT Solutions
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Espace Client - Gestion de votre file d'attente</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Heure actuelle</div>
            <div className="font-mono text-lg font-bold text-emerald-600">
              {currentTime.toLocaleTimeString("fr-FR")}
            </div>
          </div>
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Réservation de ticket */}
        <Card className="border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center text-emerald-700">
              <Ticket className="w-6 h-6 mr-3" />
              Réserver votre ticket
            </CardTitle>
            <CardDescription className="text-base">
              Sélectionnez le service souhaité pour obtenir votre numéro de ticket
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <label className="text-sm font-semibold mb-3 block text-gray-700">Choisissez votre service</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{service.icon}</span>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-gray-500">Code: {service.code}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-4">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.avgTime}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">DKT Solutions</span>
              </div>
              <div className="text-sm text-blue-700">
                Avenue de l'Indépendance, Ouagadougou
                <br />
                Ouvert: Lundi-Vendredi 7h30-17h00
              </div>
            </div>

            <Button
              onClick={handleReserveTicket}
              disabled={!selectedService || currentTicket !== null}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
              size="lg"
            >
              {currentTicket ? "Ticket déjà réservé" : "Obtenir mon ticket"}
            </Button>
          </CardContent>
        </Card>

        {/* Statut de la réservation */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center text-blue-700">
              <Users className="w-6 h-6 mr-3" />
              Votre ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {currentTicket ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-emerald-600 mb-2">N° {currentTicket}</h3>
                  <Badge className="bg-emerald-100 text-emerald-800 px-4 py-1">Ticket confirmé</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600">{queuePosition}</div>
                    <div className="text-sm text-blue-700 font-medium">Position</div>
                    <div className="text-xs text-blue-600">dans la file</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600">{estimatedWait} min</div>
                    <div className="text-sm text-orange-700 font-medium">Attente</div>
                    <div className="text-xs text-orange-600">estimée</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-2">Instructions importantes :</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Restez à proximité, vous serez appelé bientôt</li>
                        <li>Préparez vos documents nécessaires</li>
                        <li>Un signal sonore annoncera votre tour</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button onClick={handleCancelReservation} variant="destructive" className="w-full h-12">
                  Annuler ma réservation
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ticket className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">Aucun ticket actif</p>
                <p className="text-sm text-gray-400">Sélectionnez un service pour obtenir votre ticket</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations sur les services */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Nos services DKT Solutions
          </CardTitle>
          <CardDescription>Découvrez tous nos services et leurs temps de traitement moyens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{service.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{service.name}</h4>
                    <p className="text-xs text-gray-500">Code: {service.code}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.avgTime}
                  </Badge>
                  <div className="text-xs text-gray-500">{Math.floor(Math.random() * 5) + 1} en attente</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
