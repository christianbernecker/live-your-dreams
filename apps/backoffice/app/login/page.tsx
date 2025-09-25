import { redirect } from "next/navigation"

// Login Route - Weiterleitung zum Dashboard für Development
export default async function LoginPage() {
  // Für Development: Direkt zum Dashboard weiterleiten
  // In Production würde hier die richtige Login-Logik stehen
  redirect('/dashboard')
}
