import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Chat from "./Chat";

function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element = {<Login />} />
    <Route path="/signup" element = {<Signup />} />
    <Route path="/chat" element = {<Chat />} />
  </Routes>
  </BrowserRouter>
  );
}

export default App; 

