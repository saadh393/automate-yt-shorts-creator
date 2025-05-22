import { Brush, Sparkle, Sparkles, Table2 } from "lucide-react";
import * as React from "react";

import { NavUser } from "@/components/nav-user";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { AudioWaveformIcon, CheckCheckIcon, Home, Hourglass } from "lucide-react";
import { Link } from "react-router";
import Logo from "./logo";

// This is sample data.
const data = {
  user: {
    name: "Saad Hasan",
    email: "saadh393@learnwithsumit.com",
    avatar: "https://avatars.githubusercontent.com/u/22261152?v=4",
  },
};

// Menu items.
const items = [
  {
    title: "Generate Image",
    url: "/",
    icon: Home,
  },
  {
    title: "Excel",
    url: "/excel",
    icon: AudioWaveformIcon,
  },
  {
    title: "Queue List",
    url: "/queue",
    icon: Hourglass,
  },
  {
    title: "Rendered",
    url: "/rendered",
    icon: CheckCheckIcon,
  },
  {
    title: "Markdown Table",
    url: "/markdown",
    icon: Table2,
  },
  {
    title: "Prompt Filler",
    url: "/prompt-filler",
    icon: Sparkles,
  },
];

export function AppSidebar({ ...props }) {
  const [activeTeam, setActiveTeam] = React.useState({
    name: "Reel Genix",
    logo: Logo,
    plan: "Reel Genix Pro",
  });
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-primary data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
              <activeTeam.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{activeTeam.name}</span>
              <span className="truncate text-xs">{activeTeam.plan}</span>
            </div>
          </SidebarMenuButton>
        </div>

        <SidebarGroup className="p-0 my-6">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>{props.children}</SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
