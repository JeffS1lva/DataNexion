"use client"

import { useState } from "react"
import {
  Loader2,
  Trash2,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Eye,
  Edit,
  Users,
} from "lucide-react"

interface UserData {
  id: number
  name: string
  email: string
  created_at: string
}

type SortField = "id" | "name" | "email" | "created_at"
type SortOrder = "asc" | "desc"

interface UsersTableProps {
  users: UserData[]
  loading: boolean
  error: string
  onDelete: (id: number) => Promise<void>
  onRefresh: () => void
}

export function UsersTable({ users, loading, error, onDelete }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const itemsPerPage = 10

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const sortedUsers = [...users].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === "created_at") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return
    setDeleteLoading(id)
    await onDelete(id)
    setDeleteLoading(null)
  }

  if (error) {
    return (
      <div className="bg-linear-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Erro ao carregar dados</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-linear-to-br from-blue-50 via-sky-50 to-blue-50 rounded-2xl border border-blue-100 shadow-lg">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
          <div className="absolute inset-0 blur-xl bg-blue-400/30 animate-pulse"></div>
        </div>
        <p className="text-muted-foreground text-lg mt-6 font-medium">Carregando usuários...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-blue-100/50 shadow-xl shadow-blue-100/20 overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-blue-100/50 bg-linear-to-r from-blue-50/30 via-sky-50/30 to-blue-50/30">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {filteredUsers.length} {filteredUsers.length === 1 ? "usuário" : "usuários"}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-50/50 via-sky-50/50 to-blue-50/50 border-b border-blue-100/50">
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-blue-900 hover:text-blue-600 transition-colors"
                  >
                    ID
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-blue-900 hover:text-blue-600 transition-colors"
                  >
                    Usuário
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-blue-900 hover:text-blue-600 transition-colors"
                  >
                    Email
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-blue-900 hover:text-blue-600 transition-colors"
                  >
                    Cadastro
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="px-6 py-4 text-right font-semibold text-sm uppercase tracking-wide text-blue-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-blue-50 hover:bg-linear-to-r hover:from-blue-50/30 hover:via-sky-50/30 hover:to-blue-50/30 transition-all duration-200 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center justify-center min-w-10 h-10 bg-linear-to-br from-blue-100 to-sky-100 rounded-xl text-blue-700 text-sm font-bold shadow-sm">
                        #{user.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-linear-to-br from-blue-500 via-sky-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-200">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">Usuário ativo</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="font-mono text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-muted-foreground font-medium">
                          {new Date(user.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Visualizar"
                          className="inline-flex items-center justify-center w-9 h-9 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-110"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Editar"
                          className="inline-flex items-center justify-center w-9 h-9 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-110"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          title="Excluir"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteLoading === user.id}
                          className="inline-flex items-center justify-center w-9 h-9 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {deleteLoading === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Nenhum usuário encontrado</p>
                        <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-5 border-t border-blue-100/50 bg-linear-to-r from-blue-50/30 via-sky-50/30 to-blue-50/30 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              Mostrando <span className="font-bold text-blue-600">{startIndex + 1}</span> a{" "}
              <span className="font-bold text-blue-600">{Math.min(endIndex, filteredUsers.length)}</span> de{" "}
              <span className="font-bold text-blue-600">{filteredUsers.length}</span> usuários
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Anterior</span>
              </button>
              <div className="px-4 py-2 bg-linear-to-r from-blue-500 to-sky-500 text-white rounded-lg font-bold shadow-md">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <span className="hidden sm:inline font-medium">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
