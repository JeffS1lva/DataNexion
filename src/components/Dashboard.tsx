"use client"

import { User, Search, RefreshCw } from "lucide-react"

interface DashboardStatsProps {
  totalUsers: number
  filteredUsers: number
  currentPage: number
  totalPages: number
}

export function DashboardStats({ totalUsers, filteredUsers, currentPage, totalPages }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total de Usuários</p>
            <p className="text-3xl font-bold mt-2">{totalUsers}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-xl">
            <User className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Filtrados</p>
            <p className="text-3xl font-bold mt-2">{filteredUsers}</p>
          </div>
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Search className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Página Atual</p>
            <p className="text-3xl font-bold mt-2">
              {totalPages > 0 ? currentPage : 0} {" de "} {totalPages}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-xl">
            <RefreshCw className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
