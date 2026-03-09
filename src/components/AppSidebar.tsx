import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays, FileText, LogOut, Heart, UserCog, UserCircle,
} from 'lucide-react';

const medecinItems = [
  { title: 'Tableau de bord', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Patients', url: '/patients', icon: Users },
  { title: 'Consultations', url: '/consultations', icon: Stethoscope },
  { title: 'Rendez-vous', url: '/rendez-vous', icon: CalendarDays },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'Mon profil', url: '/profil', icon: UserCircle },
];

const adminItems = [
  { title: 'Tableau de bord', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Patients', url: '/patients', icon: Users },
  { title: 'Rendez-vous', url: '/rendez-vous', icon: CalendarDays },
  { title: 'Médecins', url: '/medecins', icon: UserCog },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const items = user?.role === 'medecin' ? medecinItems : adminItems;

  return (
    <Sidebar collapsible="icon" className="sidebar-gradient border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!collapsed && (
              <div className="flex items-center gap-2 py-2">
                <div className="w-8 h-8 rounded-lg medical-gradient flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-sidebar-foreground">MédiClinic</span>
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/dashboard'}
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="mb-2 px-2">
            <p className="text-sm font-medium text-sidebar-foreground">{user.prenom} {user.nom}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{user.role === 'medecin' ? 'Médecin' : 'Personnel administratif'}</p>
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && 'Déconnexion'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
