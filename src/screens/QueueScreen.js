"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { apiService } from "../services/apiService"

export default function QueueScreen() {
  const [queueData, setQueueData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadQueueData()
    const interval = setInterval(loadQueueData, 15000) // Actualiser toutes les 15 secondes
    return () => clearInterval(interval)
  }, [])

  const loadQueueData = async () => {
    try {
      const data = await apiService.getQueue()
      setQueueData(data)
    } catch (error) {
      console.error("Erreur lors du chargement de la file:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadQueueData()
  }

  const getServiceIcon = (serviceCode) => {
    const iconMap = {
      TECH: "construct-outline",
      ADMIN: "clipboard-outline",
      COM: "briefcase-outline",
      REC: "call-outline",
      INFO: "information-circle-outline",
    }
    return iconMap[serviceCode] || "help-circle-outline"
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "#EF4444"
      case "high":
        return "#F59E0B"
      default:
        return "#6B7280"
    }
  }

  const formatWaitTime = (createdAt) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInMinutes = Math.floor((now - created) / (1000 * 60))
    return `${diffInMinutes} min`
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement de la file d'attente...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* En-tête avec statistiques */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>File d'attente en temps réel</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{queueData?.total_waiting || 0}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{queueData?.queue?.filter((t) => t.status === "called").length || 0}</Text>
            <Text style={styles.statLabel}>Appelés</Text>
          </View>
        </View>
      </View>

      {/* Liste de la file d'attente */}
      <View style={styles.queueContainer}>
        {queueData?.queue?.length > 0 ? (
          queueData.queue.map((ticket, index) => (
            <Animatable.View key={ticket.id} animation="fadeInUp" duration={600} delay={index * 50}>
              <View style={[styles.ticketCard, index === 0 && styles.nextTicketCard]}>
                {index === 0 && (
                  <View style={styles.nextBadge}>
                    <Text style={styles.nextBadgeText}>Suivant</Text>
                  </View>
                )}

                <View style={styles.ticketHeader}>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketNumber}>N° {ticket.number}</Text>
                    <View style={styles.serviceInfo}>
                      <Ionicons name={getServiceIcon(ticket.service.code)} size={16} color="#059669" />
                      <Text style={styles.serviceName}>{ticket.service.name}</Text>
                    </View>
                  </View>

                  <View style={styles.ticketMeta}>
                    <Text style={styles.position}>#{index + 1}</Text>
                    {ticket.priority !== "normal" && (
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
                        <Text style={styles.priorityText}>{ticket.priority === "urgent" ? "Urgent" : "Priorité"}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.ticketFooter}>
                  <View style={styles.waitTime}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.waitTimeText}>Attente: {formatWaitTime(ticket.created_at)}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: ticket.status === "called" ? "#3B82F6" : "#F59E0B" },
                    ]}
                  >
                    <Text style={styles.statusText}>{ticket.status === "called" ? "Appelé" : "En attente"}</Text>
                  </View>
                </View>
              </View>
            </Animatable.View>
          ))
        ) : (
          <View style={styles.emptyQueue}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#10B981" />
            <Text style={styles.emptyQueueTitle}>Aucune attente</Text>
            <Text style={styles.emptyQueueText}>Tous les clients ont été servis !</Text>
          </View>
        )}
      </View>

      {/* Informations supplémentaires */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
          <Text style={styles.infoTitle}>Informations</Text>
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoText}>• La file d'attente est mise à jour automatiquement</Text>
          <Text style={styles.infoText}>• Les tickets urgents sont traités en priorité</Text>
          <Text style={styles.infoText}>• Restez attentif aux annonces sonores</Text>
          <Text style={styles.infoText}>• Tirez vers le bas pour actualiser</Text>
        </View>
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
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#059669",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  queueContainer: {
    padding: 20,
  },
  ticketCard: {
    backgroundColor: "white",
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  nextTicketCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  nextBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nextBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 14,
    color: "#059669",
    marginLeft: 6,
    fontWeight: "500",
  },
  ticketMeta: {
    alignItems: "flex-end",
  },
  position: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B7280",
    marginBottom: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  waitTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  waitTimeText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyQueue: {
    alignItems: "center",
    padding: 40,
  },
  emptyQueueTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyQueueText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 10,
  },
  infoContent: {
    paddingLeft: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },
})
