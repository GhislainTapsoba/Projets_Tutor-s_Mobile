"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Settings, Clock, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête de l'agence */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            DKT Solutions
          </h1>
          <p className="text-xl text-gray-600">Services Administratifs & Techniques</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mb-8">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-600 mr-2" />
              <span>Avenue de l'Indépendance, Ouagadougou</span>
            </div>
            <div className="flex items-center justify-center">
              <Phone className="w-4 h-4 text-emerald-600 mr-2" />
              <span>+226 25 30 45 67</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-600 mr-2" />
              <span>Lun-Ven: 7h30-17h00</span>
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Système moderne de gestion de files d'attente pour un service client optimisé
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Link href="/client">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-emerald-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-emerald-700">Espace Client</CardTitle>
              <CardDescription className="text-base">
                Réservez votre ticket et suivez votre position dans la file d'attente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                Prendre un ticket
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/agent">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Espace Agent</CardTitle>
              <CardDescription className="text-base">
                Interface de gestion des appels et service clientèle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Connexion Agent
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-10 h-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-700">Administration</CardTitle>
              <CardDescription className="text-base">Tableau de bord et gestion du système</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                Accès Admin
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Statistiques en temps réel */}
      <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">État du service en temps réel</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Clients en attente</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
            <div className="text-sm text-gray-600">Agents disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">8 min</div>
            <div className="text-sm text-gray-600">Temps d'attente moyen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">147</div>
            <div className="text-sm text-gray-600">Tickets servis aujourd'hui</div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full shadow-md border border-emerald-200">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mr-3"></div>
          <span className="text-emerald-700 font-medium">Service ouvert - Prenez votre ticket maintenant</span>
        </div>
      </div>
    </div>
  )
}
