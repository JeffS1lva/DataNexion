"use client"

import { useState, useEffect } from "react"  // ← Adicione useEffect
import { Routes, Route, Navigate } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSideBar"
import { LoginForm } from "@/components/LoginForm"
import { DashboardPage } from "@/components/Pages/DashboardPage"
import { UsersPage } from "@/components/Pages/UsersPage"

const VALID_EMAIL = "jeffinbala.29@gmail.com"
const VALID_PASSWORD = "874190ma"

export interface UserData {
  id: number
  name: string
  email: string
  created_at: string
}

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ← Novo: Verifica se já estava logado ao carregar a página
  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated") === "true"
    if (loggedIn) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const success = email === VALID_EMAIL && password === VALID_PASSWORD

    if (success) {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")  // ← Salva no localStorage
    }

    return success
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")  // ← Remove ao deslogar
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} onLoginSuccess={() => {}} />  
    // ← onLoginSuccess não precisa mais setar o estado (já fazemos no handleLogin)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar onLogout={handleLogout} />
      <SidebarInset>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  )
}