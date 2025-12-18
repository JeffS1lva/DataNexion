"use client"

import { useNavigate, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Users, Settings, LogOut, BarChart3, FileText, Bell, ChartNoAxesCombined } from "lucide-react"

interface AppSidebarProps {
  onLogout: () => void
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sidebar className="border-r border-sidebar-border/50">
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 px-4 py-6">
          <div className="relative p-2.5 bg-linear-to-br from-blue-500 via-indigo-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500">
            <ChartNoAxesCombined  className="w-5 h-5 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Portal Nexion
            </h2>
            <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider px-2 mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/"}
                  onClick={() => navigate("/")}
                  className="rounded-lg transition-all duration-200 hover:bg-sidebar-accent/80 data-[active=true]:bg-linear-to-r data-[active=true]:from-blue-500/20 data-[active=true]:to-indigo-500/20 data-[active=true]:border data-[active=true]:border-blue-500/30 data-[active=true]:shadow-sm"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/usuarios"}
                  onClick={() => navigate("/usuarios")}
                  className="rounded-lg transition-all duration-200 hover:bg-sidebar-accent/80 data-[active=true]:bg-linear-to-r data-[active=true]:from-blue-500/20 data-[active=true]:to-indigo-500/20 data-[active=true]:border data-[active=true]:border-blue-500/30 data-[active=true]:shadow-sm"
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Usuários</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={false}
                  className="rounded-lg transition-all duration-200 hover:bg-sidebar-accent/80"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">Relatórios</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={false}
                  className="rounded-lg transition-all duration-200 hover:bg-sidebar-accent/80"
                >
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Documentos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider px-2 mb-2">
            Configurações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={false}
                  className="rounded-lg transition-all duration-200 hover:bg-sidebar-accent/80"
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Preferências</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={false}
                  className="rounded-lg transition-all duration-200 hover:bg-sidebar-accent/80"
                >
                  <Bell className="w-4 h-4" />
                  <span className="font-medium">Notificações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="mb-3 px-2 py-3 bg-sidebar-accent/50 rounded-lg border border-sidebar-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30">
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Jeffin Bala</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">jeffinbala.29@gmail.com</p>
            </div>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className="rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
