import "./App.css";
import Layout from "./components/layout";
import Home from "./components/pages/home";
import ImageGenerate from "./components/pages/image-generate";

function App() {
  return (
    <>
      <Layout>
        {/* <Home /> */}
        <ImageGenerate />
      </Layout>
    </>
  );
}

export default App;
