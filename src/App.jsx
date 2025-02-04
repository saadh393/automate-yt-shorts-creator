import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Layout from "@/components/layout";
import AppProvider from "@/context/app-provider";
import AudioPage from "@/pages/AudioPage";
import Home from "@/pages/HomePage";
import QueuePage from "@/pages/QueuePage";
import RenderedPage from "@/pages/RenderedPage";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppProvider>
          <TooltipProvider>
            <Layout>
              <Routes>
                <Route path="/" index element={<Home />} />
                <Route path="/audio" element={<AudioPage />} />
                <Route path="/queue" element={<QueuePage />} />
                <Route path="/rendered" element={<RenderedPage />} />
              </Routes>
            </Layout>
          </TooltipProvider>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
