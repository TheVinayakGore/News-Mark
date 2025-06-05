import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import News from "./Components/News";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="p-10 sticky z-0">
          <Routes>
            <Route exact path="/" element={<News />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
