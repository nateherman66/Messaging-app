import {Browserrouter, Routes, Route} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  <Browserrouter>
  <Routes>
    <Route path="/" element = {<Login />} />
    <Route path="/signup" element = {<Signup />} />
  </Routes>
  </Browserrouter>
}

export default App;