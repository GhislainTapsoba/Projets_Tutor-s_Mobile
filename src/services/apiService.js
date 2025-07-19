import axios from "axios"

// Configuration de l'API
const API_BASE_URL = "http://your-laravel-api.com/api/v1" // Remplacez par votre URL d'API

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const apiService = {
  // Services
  async getServices() {
    const response = await apiClient.get("/services")
    return response.data
  },

  async getService(id) {
    const response = await apiClient.get(`/services/${id}`)
    return response.data
  },

  // Tickets
  async createTicket(data) {
    const response = await apiClient.post("/tickets", data)
    return response.data
  },

  async getTicket(id) {
    const response = await apiClient.get(`/tickets/${id}`)
    return response.data
  },

  async cancelTicket(id) {
    const response = await apiClient.patch(`/tickets/${id}/cancel`)
    return response.data
  },

  async rateTicket(id, rating, feedback = null) {
    const response = await apiClient.post(`/tickets/${id}/rate`, {
      rating,
      feedback,
    })
    return response.data
  },

  // File d'attente
  async getQueue(serviceId = null) {
    const params = serviceId ? { service_id: serviceId } : {}
    const response = await apiClient.get("/queue", { params })
    return response.data
  },

  // Dashboard
  async getRealtimeStatus() {
    const response = await apiClient.get("/dashboard/realtime")
    return response.data
  },

  // Utilitaires
  async checkConnection() {
    try {
      await apiClient.get("/dashboard/realtime")
      return true
    } catch (error) {
      return false
    }
  },
}

export default apiService
