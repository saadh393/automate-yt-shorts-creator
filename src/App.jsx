import "./App.css";
import ImageGenerate from "./components/image-generate";
import Layout from "./components/layout";
import Home from "./components/pages/home";
import AppProvider from "./context/app-provider";

function App() {
  return (
    <>
      <AppProvider>
        <Layout>
          <Home />
          {/* <ImageGenerate /> */}
        </Layout>
      </AppProvider>
    </>
  );
}

export default App;
