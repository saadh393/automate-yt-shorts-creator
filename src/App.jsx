import Layout from "@/components/layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppProvider from "@/context/app-provider";
import AudioPage from "@/pages/Excel";
import Home from "@/pages/HomePage";
import QueuePage from "@/pages/QueuePage";
import RenderedPage from "@/pages/RenderedPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import "./App.css";
import MarkdownTablePage from "./pages/MarkdownTablePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppProvider>
          <TooltipProvider>
            <Layout>
              <Routes>
                <Route path="/" index element={<Home />} />
                <Route path="/excel" element={<AudioPage />} />
                <Route path="/queue" element={<QueuePage />} />
                <Route path="/markdown" element={<MarkdownTablePage />} />
                <Route path="/rendered" element={<RenderedPage />} />
              </Routes>
              <Toaster position="bottom-right" />
            </Layout>
          </TooltipProvider>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
