import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Screens
import HomeScreen from "./src/screens/HomeScreen"
import ServicesScreen from "./src/screens/ServicesScreen"
import TicketScreen from "./src/screens/TicketScreen"
import QueueScreen from "./src/screens/QueueScreen"

const Stack = createStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#059669" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#059669",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "DKT Solutions",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Services"
            component={ServicesScreen}
            options={{
              title: "Choisir un service",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Ticket"
            component={TicketScreen}
            options={{
              title: "Votre ticket",
              headerTitleAlign: "center",
              headerLeft: null,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Queue"
            component={QueueScreen}
            options={{
              title: "File d'attente",
              headerTitleAlign: "center",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
