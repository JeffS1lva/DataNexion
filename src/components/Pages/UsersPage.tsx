"use client"

import { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RefreshCw, UserPlus } from "lucide-react"
import { DashboardStats } from "@/components/Dashboard"
import { UsersTable } from "@/components/UsersTable"

const API_URL = "https://portal-nexion.fly.dev/api/users"

interface UserData {
  id: number
  name: string
  email: string
  created_at: string
}

export function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setUsers(data)
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        setError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.")
      } else {
        setError(err.message || "Erro inesperado ao carregar os usuários.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir usuário")
      }

      setUsers(users.filter((user) => user.id !== id))
    } catch (err: any) {
      alert("Erro ao excluir usuário: " + err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2 flex-1">
          <div className="h-8 w-px bg-border" />
          <h1 className="text-lg font-semibold">Gerenciamento de Usuários</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Usuário</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mb-8">
          <DashboardStats
            totalUsers={users.length}
            filteredUsers={users.length}
            currentPage={1}
            totalPages={Math.ceil(users.length / 10)}
          />
        </div>

        <UsersTable users={users} loading={loading} error={error} onDelete={handleDelete} onRefresh={fetchUsers} />
      </main>
    </>
  )
}
