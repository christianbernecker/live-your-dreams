import { redirect } from "next/navigation"

// DEVELOPMENT MODE - Direkte Weiterleitung zum Dashboard
export default async function HomePage() {
  // Für Development: Direkt zum Dashboard weiterleiten
  redirect('/dashboard')
}