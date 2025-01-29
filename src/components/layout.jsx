import { AppSidebar } from "./app-sidebar";
import PromptField from "./ui/prompt-field";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar>
        <PromptField />
      </AppSidebar>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
