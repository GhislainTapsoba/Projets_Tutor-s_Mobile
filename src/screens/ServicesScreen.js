"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { apiService } from "../services/apiService"

export default function ServicesScreen({ navigation }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await apiService.getServices()
      setServices(data.services)
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les services")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadServices()
  }

  const handleServiceSelect = async (service) => {
    setSelectedService(service)

    Alert.alert(
      "Confirmer votre choix",
      `Vous avez sélectionné: ${service.name}\n\nTemps d'attente estimé: ${service.estimated_wait_time} minutes\nPersonnes en attente: ${service.waiting_count}`,
      [
        {
          text: "Annuler",
          style: "cancel",
          onPress: () => setSelectedService(null),
        },
        {
          text: "Confirmer",
          onPress: () => createTicket(service),
        },
      ],
    )
  }

  const createTicket = async (service) => {
    try {
      const ticketData = await apiService.createTicket({
        service_id: service.id,
      })

      navigation.navigate("Ticket", {
        ticket: ticketData.ticket,
        queuePosition: ticketData.queue_position,
        estimatedWait: ticketData.estimated_wait,
      })
    } catch (error) {
      Alert.alert("Erreur", error.response?.data?.error || "Impossible de créer le ticket")
    } finally {
      setSelectedService(null)
    }
  }

  const getServiceIcon = (icon) => {
    const iconMap = {
      "🔧": "construct-outline",
      "📋": "clipboard-outline",
      "💼": "briefcase-outline",
      "📞": "call-outline",
      ℹ️: "information-circle-outline",
    }
    return iconMap[icon] || "help-circle-outline"
  }

  const getWaitTimeColor = (waitTime) => {
    if (waitTime <= 10) return "#10B981"
    if (waitTime <= 20) return "#F59E0B"
    return "#EF4444"
  }

  const getWaitTimeText = (waitTime) => {
    if (waitTime <= 5) return "Très rapide"
    if (waitTime <= 15) return "Rapide"
    if (waitTime <= 30) return "Modéré"
    return "Long"
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des services...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sélectionnez votre service</Text>
        <Text style={styles.headerSubtitle}>Choisissez le service qui correspond à votre besoin</Text>
      </View>

      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <Animatable.View key={service.id} animation="fadeInUp" duration={600} delay={index * 100}>
            <TouchableOpacity
              style={[styles.serviceCard, selectedService?.id === service.id && styles.selectedServiceCard]}
              onPress={() => handleServiceSelect(service)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedService?.id === service.id ? ["#10B981", "#059669"] : ["white", "white"]}
                style={styles.serviceCardGradient}
              >
                <View style={styles.serviceHeader}>
                  <View
                    style={[
                      styles.serviceIconContainer,
                      { backgroundColor: selectedService?.id === service.id ? "rgba(255,255,255,0.2)" : "#F3F4F6" },
                    ]}
                  >
                    <Ionicons
                      name={getServiceIcon(service.icon)}
                      size={28}
                      color={selectedService?.id === service.id ? "white" : service.color || "#059669"}
                    />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text
                      style={[styles.serviceName, { color: selectedService?.id === service.id ? "white" : "#1F2937" }]}
                    >
                      {service.name}
                    </Text>
                    <Text
                      style={[
                        styles.serviceCode,
                        { color: selectedService?.id === service.id ? "rgba(255,255,255,0.8)" : "#6B7280" },
                      ]}
                    >
                      Code: {service.code}
                    </Text>
                  </View>
                </View>

                {service.description && (
                  <Text
                    style={[
                      styles.serviceDescription,
                      { color: selectedService?.id === service.id ? "rgba(255,255,255,0.9)" : "#6B7280" },
                    ]}
                  >
                    {service.description}
                  </Text>
                )}

                <View style={styles.serviceStats}>
                  <View style={styles.statRow}>
                    <View style={styles.statItem}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={
                          selectedService?.id === service.id ? "white" : getWaitTimeColor(service.estimated_wait_time)
                        }
                      />
                      <Text
                        style={[styles.statText, { color: selectedService?.id === service.id ? "white" : "#374151" }]}
                      >
                        {service.average_time} min
                      </Text>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: selectedService?.id === service.id ? "rgba(255,255,255,0.7)" : "#6B7280" },
                        ]}
                      >
                        {getWaitTimeText(service.estimated_wait_time)}
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Ionicons
                        name="people-outline"
                        size={16}
                        color={selectedService?.id === service.id ? "white" : "#6B7280"}
                      />
                      <Text
                        style={[styles.statText, { color: selectedService?.id === service.id ? "white" : "#374151" }]}
                      >
                        {service.waiting_count}
                      </Text>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: selectedService?.id === service.id ? "rgba(255,255,255,0.7)" : "#6B7280" },
                        ]}
                      >
                        en attente
                      </Text>
                    </View>
                  </View>

                  {service.estimated_wait_time > 0 && (
                    <View
                      style={[
                        styles.estimatedTime,
                        { backgroundColor: selectedService?.id === service.id ? "rgba(255,255,255,0.2)" : "#F3F4F6" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.estimatedTimeText,
                          { color: selectedService?.id === service.id ? "white" : "#374151" },
                        ]}
                      >
                        Attente estimée: {service.estimated_wait_time} minutes
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sélectionnez un service pour obtenir votre ticket</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 5,
  },
  servicesContainer: {
    padding: 20,
  },
  serviceCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedServiceCard: {
    shadowColor: "#10B981",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  serviceCardGradient: {
    padding: 20,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  serviceCode: {
    fontSize: 12,
    fontWeight: "500",
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  serviceStats: {
    marginTop: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  estimatedTime: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  estimatedTimeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
})
