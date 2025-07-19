"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Home,
  Settings,
  Award,
  AlertTriangle,
  Building2,
  Eye,
  Edit,
  Activity,
  Calendar,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            DKT Solutions
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Administration - Tableau de bord</p>
        </div>
        <Link href="/">
          <Button variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Accueil
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          onClick={() => setActiveTab("dashboard")}
          className="flex-1"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Tableau de bord
        </Button>
        <Button
          variant={activeTab === "agents" ? "default" : "ghost"}
          onClick={() => setActiveTab("agents")}
          className="flex-1"
        >
          <Users className="w-4 h-4 mr-2" />
          Agents
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          onClick={() => setActiveTab("reports")}
          className="flex-1"
        >
          <FileText className="w-4 h-4 mr-2" />
          Rapports
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          onClick={() => setActiveTab("settings")}
          className="flex-1"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configuration
        </Button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Statistiques principales */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tickets aujourd'hui</p>
                    <p className="text-3xl font-bold text-emerald-600">187</p>
                    <p className="text-xs text-green-600">+15% vs hier</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taux de service</p>
                    <p className="text-3xl font-bold text-blue-600">96.8%</p>
                    <p className="text-xs text-green-600">+2.3% vs semaine</p>
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
                    <p className="text-sm font-medium text-gray-600">Temps d'attente</p>
                    <p className="text-3xl font-bold text-orange-600">7.2 min</p>
                    <p className="text-xs text-green-600">-1.8 min vs hier</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                    <p className="text-3xl font-bold text-purple-600">96.2%</p>
                    <p className="text-xs text-green-600">+0.8% vs semaine</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* État actuel du système */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  État du système en temps réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Système opérationnel</p>
                      <p className="text-sm text-green-600">Tous les services fonctionnent normalement</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">En ligne</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">Agents connectés</p>
                      <p className="text-sm text-blue-600">4 agents actifs sur 5 postes</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">4/5</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-orange-800">File d'attente</p>
                      <p className="text-sm text-orange-600">12 clients en attente actuellement</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">12 clients</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Activité de la semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { day: "Lundi", tickets: 67, served: 64 },
                    { day: "Mardi", tickets: 73, served: 71 },
                    { day: "Mercredi", tickets: 58, served: 56 },
                    { day: "Jeudi", tickets: 82, served: 79 },
                    { day: "Vendredi", tickets: 91, served: 88 },
                    { day: "Samedi", tickets: 45, served: 43 },
                    { day: "Dimanche", tickets: 23, served: 22 },
                  ].map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-20 text-sm font-medium">{day.day}</div>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${(day.served / day.tickets) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right">
                        {day.served}/{day.tickets}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services les plus demandés */}
          <Card>
            <CardHeader>
              <CardTitle>Services les plus demandés</CardTitle>
              <CardDescription>Répartition des demandes par type de service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { name: "Consultation technique", count: 65, percentage: 35, color: "emerald" },
                  { name: "Support administratif", count: 52, percentage: 28, color: "blue" },
                  { name: "Service commercial", count: 41, percentage: 22, color: "orange" },
                  { name: "Réclamations", count: 19, percentage: 10, color: "red" },
                  { name: "Informations générales", count: 10, percentage: 5, color: "purple" },
                ].map((service, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className={`text-2xl font-bold text-${service.color}-600 mb-2`}>{service.count}</div>
                    <div className="text-sm font-medium mb-1">{service.name}</div>
                    <div className="text-xs text-gray-500">{service.percentage}% du total</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "agents" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestion des Agents DKT</h2>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">3 agents actifs</Badge>
              <Badge className="bg-yellow-100 text-yellow-800">1 en pause</Badge>
            </div>
          </div>

          <div className="grid gap-6">
            {[
              { name: "Agent DKT-001", tickets: 28, avgTime: "4:32", satisfaction: 97, status: "active" },
              { name: "Agent DKT-002", tickets: 25, avgTime: "5:15", satisfaction: 94, status: "active" },
              { name: "Agent DKT-003", tickets: 31, avgTime: "3:48", satisfaction: 98, status: "pause" },
              { name: "Agent DKT-004", tickets: 22, avgTime: "6:02", satisfaction: 92, status: "active" },
            ].map((agent, index) => (
              <Card key={index} className="border-l-4 border-l-emerald-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription>Agent de service clientèle DKT Solutions</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          agent.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {agent.status === "active" ? "En service" : "En pause"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{agent.tickets}</div>
                      <div className="text-sm text-gray-600">Tickets traités</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{agent.avgTime}</div>
                      <div className="text-sm text-gray-600">Temps moyen</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{agent.satisfaction}%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Rapports et Analyses</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Rapport quotidien</h3>
                <p className="text-sm text-gray-600 mb-4">Statistiques détaillées du jour</p>
                <Button className="w-full">Générer</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Rapport hebdomadaire</h3>
                <p className="text-sm text-gray-600 mb-4">Analyse de la semaine écoulée</p>
                <Button className="w-full">Générer</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Performance agents</h3>
                <p className="text-sm text-gray-600 mb-4">Évaluation individuelle</p>
                <Button className="w-full">Générer</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historique des rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Rapport quotidien - 18 Juin 2025", date: "Aujourd'hui 14:30", size: "2.3 MB" },
                  { name: "Rapport hebdomadaire - Semaine 25", date: "17 Juin 2025", size: "5.7 MB" },
                  { name: "Performance agents - Mai 2025", date: "31 Mai 2025", size: "1.8 MB" },
                  { name: "Rapport quotidien - 17 Juin 2025", date: "17 Juin 2025", size: "2.1 MB" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-gray-600">
                        {report.date} • {report.size}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Configuration DKT Solutions</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Informations de l'agence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="agency-name">Nom de l'agence</Label>
                  <Input id="agency-name" defaultValue="DKT Solutions" />
                </div>
                <div>
                  <Label htmlFor="address">Adresse complète</Label>
                  <Textarea id="address" defaultValue="Avenue de l'Indépendance, Ouagadougou, Burkina Faso" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" defaultValue="+226 25 30 45 67" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="contact@dkt-solutions.bf" />
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Sauvegarder les informations</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Paramètres opérationnels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="max-queue">Taille maximale de la file</Label>
                  <Input id="max-queue" type="number" defaultValue="50" />
                </div>
                <div>
                  <Label htmlFor="service-time">Temps de service moyen (min)</Label>
                  <Input id="service-time" type="number" defaultValue="5" />
                </div>
                <div>
                  <Label>Heures d'ouverture</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input defaultValue="07:30" type="time" />
                    <Input defaultValue="17:00" type="time" />
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Appliquer les paramètres</Button>
              </CardContent>
            </Card>
          </div>

          {/* Alertes système */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Alertes et notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">File d'attente élevée</p>
                    <p className="text-sm text-yellow-700">Alerte quand plus de 15 clients en attente</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Actif</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Performance excellente</p>
                    <p className="text-sm text-green-700">Notification quand satisfaction &gt; 95%</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Temps d'attente élevé</p>
                    <p className="text-sm text-blue-700">Alerte quand temps > 20 minutes</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Actif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
