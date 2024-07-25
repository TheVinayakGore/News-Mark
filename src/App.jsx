import "./App.css";
import Navbar from "./Components/Navbar";
import News from "./Components/News";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="p-20 sticky z-0">
          <Routes>
            <Route exact path="/" element={<News />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
