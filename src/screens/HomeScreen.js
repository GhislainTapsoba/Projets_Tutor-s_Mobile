"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { apiService } from "../services/apiService"

export default function HomeScreen({ navigation }) {
  const [realtimeData, setRealtimeData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRealtimeData()
    const interval = setInterval(loadRealtimeData, 30000) // Actualiser toutes les 30 secondes
    return () => clearInterval(interval)
  }, [])

  const loadRealtimeData = async () => {
    try {
      const data = await apiService.getRealtimeStatus()
      setRealtimeData(data)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadRealtimeData()
  }

  const handleTakeTicket = () => {
    if (realtimeData?.current_queue >= 50) {
      Alert.alert("File d'attente pleine", "La file d'attente est actuellement pleine. Veuillez réessayer plus tard.", [
        { text: "OK" },
      ])
      return
    }
    navigation.navigate("Services")
  }

  const getStatusColor = () => {
    if (!realtimeData) return "#6B7280"
    if (realtimeData.system_status === "operational") return "#10B981"
    return "#EF4444"
  }

  const getQueueStatus = () => {
    if (!realtimeData) return "Chargement..."
    const queue = realtimeData.current_queue
    if (queue === 0) return "Aucune attente"
    if (queue <= 5) return "Attente courte"
    if (queue <= 15) return "Attente modérée"
    return "Attente élevée"
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* En-tête avec gradient */}
      <LinearGradient colors={["#059669", "#10B981"]} style={styles.header}>
        <Animatable.View animation="fadeInDown" duration={1000}>
          <Text style={styles.welcomeText}>Bienvenue chez</Text>
          <Text style={styles.companyName}>DKT Solutions</Text>
          <Text style={styles.subtitle}>Services Administratifs & Techniques</Text>
        </Animatable.View>
      </LinearGradient>

      {/* Informations de contact */}
      <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={20} color="#059669" />
            <Text style={styles.contactText}>Avenue de l'Indépendance, Ouagadougou</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={20} color="#059669" />
            <Text style={styles.contactText}>+226 25 30 45 67</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="time-outline" size={20} color="#059669" />
            <Text style={styles.contactText}>Lun-Ven: 7h30-17h00 | Sam: 8h00-12h00</Text>
          </View>
        </View>
      </Animatable.View>

      {/* État du service en temps réel */}
      <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusTitle}>État du service</Text>
          </View>

          {realtimeData && (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{realtimeData.current_queue}</Text>
                <Text style={styles.statLabel}>En attente</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{realtimeData.active_agents}</Text>
                <Text style={styles.statLabel}>Agents actifs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{realtimeData.in_progress}</Text>
                <Text style={styles.statLabel}>En cours</Text>
              </View>
            </View>
          )}

          <View style={styles.queueStatus}>
            <Text style={styles.queueStatusText}>{getQueueStatus()}</Text>
          </View>
        </View>
      </Animatable.View>

      {/* Bouton principal */}
      <Animatable.View animation="bounceIn" duration={1000} delay={600}>
        <TouchableOpacity style={styles.mainButton} onPress={handleTakeTicket} activeOpacity={0.8}>
          <LinearGradient colors={["#10B981", "#059669"]} style={styles.buttonGradient}>
            <Ionicons name="ticket-outline" size={32} color="white" />
            <Text style={styles.buttonText}>Prendre un ticket</Text>
            <Text style={styles.buttonSubtext}>Sélectionnez votre service</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {/* Actions secondaires */}
      <Animatable.View animation="fadeInUp" duration={1000} delay={800}>
        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Queue")}>
            <Ionicons name="people-outline" size={24} color="#059669" />
            <Text style={styles.secondaryButtonText}>Voir la file d'attente</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* Informations importantes */}
      <Animatable.View animation="fadeInUp" duration={1000} delay={1000}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#F59E0B" />
            <Text style={styles.infoTitle}>Informations importantes</Text>
          </View>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Gardez votre téléphone à portée de main</Text>
            <Text style={styles.infoItem}>• Préparez vos documents nécessaires</Text>
            <Text style={styles.infoItem}>• Respectez votre tour d'appel</Text>
            <Text style={styles.infoItem}>• Un signal sonore annoncera votre tour</Text>
          </View>
        </View>
      </Animatable.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    padding: 30,
    paddingTop: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  companyName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  contactCard: {
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
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  statusCard: {
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
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#059669",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  queueStatus: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  queueStatusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  mainButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonGradient: {
    padding: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  buttonSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  secondaryActions: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
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
  infoList: {
    paddingLeft: 10,
  },
  infoItem: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },
})
