import { AppSidebar } from "./app-sidebar";
import PromptField from "./home-page/prompt-field";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 py-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
