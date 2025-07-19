"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { apiService } from "../services/apiService"

export default function TicketScreen({ route, navigation }) {
  const { ticket: initialTicket, queuePosition: initialPosition, estimatedWait: initialWait } = route.params

  const [ticket, setTicket] = useState(initialTicket)
  const [queuePosition, setQueuePosition] = useState(initialPosition)
  const [estimatedWait, setEstimatedWait] = useState(initialWait)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Empêcher le retour en arrière
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Quitter", "Êtes-vous sûr de vouloir annuler votre ticket ?", [
        { text: "Non", style: "cancel" },
        { text: "Oui", onPress: handleCancelTicket },
      ])
      return true
    })

    // Actualiser les données toutes les 30 secondes
    const interval = setInterval(() => {
      updateTicketStatus()
      setCurrentTime(new Date())
    }, 30000)

    // Actualiser l'heure toutes les secondes
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      backHandler.remove()
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [])

  const updateTicketStatus = async () => {
    try {
      const data = await apiService.getTicket(ticket.id)
      setTicket(data.ticket)
      if (data.queue_position) {
        setQueuePosition(data.queue_position)
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleCancelTicket = async () => {
    try {
      await apiService.cancelTicket(ticket.id)
      Alert.alert("Ticket annulé", "Votre ticket a été annulé avec succès.", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ])
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'annuler le ticket")
    }
  }

  const getStatusInfo = () => {
    switch (ticket.status) {
      case "waiting":
        return {
          icon: "time-outline",
          color: "#F59E0B",
          title: "En attente",
          message: "Votre tour approche, restez à proximité",
        }
      case "called":
        return {
          icon: "megaphone-outline",
          color: "#3B82F6",
          title: "Appelé",
          message: "Présentez-vous au guichet maintenant",
        }
      case "in_progress":
        return {
          icon: "person-outline",
          color: "#10B981",
          title: "En cours",
          message: "Vous êtes actuellement servi",
        }
      case "completed":
        return {
          icon: "checkmark-circle-outline",
          color: "#10B981",
          title: "Terminé",
          message: "Service terminé avec succès",
        }
      default:
        return {
          icon: "help-circle-outline",
          color: "#6B7280",
          title: "Statut inconnu",
          message: "",
        }
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getWaitingTime = () => {
    const createdAt = new Date(ticket.created_at)
    const diffInMinutes = Math.floor((currentTime - createdAt) / (1000 * 60))
    return diffInMinutes
  }

  const statusInfo = getStatusInfo()

  return (
    <View style={styles.container}>
      {/* En-tête avec numéro de ticket */}
      <LinearGradient colors={["#059669", "#10B981"]} style={styles.header}>
        <Animatable.View animation="bounceIn" duration={1000}>
          <Text style={styles.ticketLabel}>Ticket N°</Text>
          <Text style={styles.ticketNumber}>{ticket.number}</Text>
          <Text style={styles.serviceName}>{ticket.service.name}</Text>
        </Animatable.View>
      </LinearGradient>

      {/* Statut actuel */}
      <Animatable.View animation="fadeInUp" duration={800} delay={200}>
        <View style={styles.statusCard}>
          <View style={[styles.statusIcon, { backgroundColor: statusInfo.color }]}>
            <Ionicons name={statusInfo.icon} size={32} color="white" />
          </View>
          <Text style={styles.statusTitle}>{statusInfo.title}</Text>
          <Text style={styles.statusMessage}>{statusInfo.message}</Text>
        </View>
      </Animatable.View>

      {/* Informations de position */}
      {ticket.status === "waiting" && (
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <View style={styles.positionCard}>
            <View style={styles.positionGrid}>
              <View style={styles.positionItem}>
                <Text style={styles.positionNumber}>{queuePosition}</Text>
                <Text style={styles.positionLabel}>Position dans la file</Text>
              </View>
              <View style={styles.positionItem}>
                <Text style={styles.positionNumber}>{estimatedWait}</Text>
                <Text style={styles.positionLabel}>Minutes d'attente</Text>
              </View>
            </View>
          </View>
        </Animatable.View>
      )}

      {/* Informations détaillées */}
      <Animatable.View animation="fadeInUp" duration={800} delay={600}>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text style={styles.detailLabel}>Heure actuelle</Text>
            <Text style={styles.detailValue}>{formatTime(currentTime)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text style={styles.detailLabel}>Ticket pris à</Text>
            <Text style={styles.detailValue}>
              {new Date(ticket.created_at).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="hourglass-outline" size={20} color="#6B7280" />
            <Text style={styles.detailLabel}>Temps d'attente</Text>
            <Text style={styles.detailValue}>{getWaitingTime()} minutes</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={20} color="#6B7280" />
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{ticket.service.code}</Text>
          </View>
        </View>
      </Animatable.View>

      {/* Instructions */}
      <Animatable.View animation="fadeInUp" duration={800} delay={800}>
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
            <Text style={styles.instructionsTitle}>Instructions</Text>
          </View>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>• Gardez votre téléphone à portée de main</Text>
            <Text style={styles.instructionItem}>• Restez dans la zone d'attente</Text>
            <Text style={styles.instructionItem}>• Écoutez les annonces sonores</Text>
            <Text style={styles.instructionItem}>• Présentez-vous rapidement quand appelé</Text>
          </View>
        </View>
      </Animatable.View>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.refreshButton} onPress={updateTicketStatus}>
          <Ionicons name="refresh-outline" size={20} color="#059669" />
          <Text style={styles.refreshButtonText}>Actualiser</Text>
        </TouchableOpacity>

        {ticket.status === "waiting" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              Alert.alert("Annuler le ticket", "Êtes-vous sûr de vouloir annuler votre ticket ?", [
                { text: "Non", style: "cancel" },
                { text: "Oui", onPress: handleCancelTicket },
              ])
            }}
          >
            <Ionicons name="close-outline" size={20} color="#EF4444" />
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    padding: 40,
    alignItems: "center",
  },
  ticketLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  ticketNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  serviceName: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "white",
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  positionCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  positionGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  positionItem: {
    alignItems: "center",
  },
  positionNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 5,
  },
  positionLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  instructionsCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 10,
  },
  instructionsList: {
    paddingLeft: 10,
  },
  instructionItem: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#059669",
  },
  refreshButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  cancelButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
})
