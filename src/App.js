import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './Page/Login/Login';
import Register from './Page/Register/Register';
import User from "./Page/User/User";

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/userPage" element={<User/>}/>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
