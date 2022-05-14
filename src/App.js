import { BrowserRouter, Routes, Route } from 'react-router-dom'
import jwtDecode from "jwt-decode"
import axios from "axios"
import { useDispatch } from "react-redux"
import Async from 'react-async'
import ProtectedRoute from './Component/HOC/ProtectedRoute'
import UnprotectedRoute from './Component/HOC/UnprotectedRoute'
import Login from './Component/Page/Login/Login'
import Register from './Component/Page/Register/Register'
import Home from './Component/Page/HomePage/Home'
import UserPage from './Component/Page/UserPage/UserPage'
import AdminPage from './Component/Page/AdminPage/AdminPage'
import Logout from './Component/Page/Logout'
import userSlice from './store/user'

const getUser = async () => {
  try {
    const token = localStorage.getItem('carAccessToken')
    const userData = jwtDecode(token)
    const res = await axios.get(`http://localhost:4000/users/${userData.sub}`)
    return {
      user: res.data
    } 
  } catch {
    return {
      user: null
    }
  }
}

function App() {

  const dispatch = useDispatch()


  return (
    <Async promiseFn={getUser}>
      {( {data, error, isPending} ) => {
        if (isPending) {
          return (
            <h2>Loading...</h2>
          )
        }
        if (error) {
          return (
            <h2>Error</h2>
          )
        }
        if (data) {
          if ( data.user !== null ) {
            dispatch(userSlice.actions.addUser( {userData : data.user} ))
          }
          return (
            <>
              <BrowserRouter>
                <Routes>
                  <Route path="/">
                    {/* ALL */}
                    <Route index element={<Home />} />
                    <Route path="logout" element={<Logout />} />
  
                    {/* PUBLIC ONLY */}
                    <Route path="/" element={<UnprotectedRoute />} >
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                    </Route>
                    
                    {/* PROTECTED */}
                    <Route path="/" element={<ProtectedRoute />} >
                      <Route path="admin-page" element={<AdminPage />} />
                      <Route path="user-page" element={<UserPage />} />
                    </Route>
                  </Route>
                </Routes>
                {/* <Login setLogin={setLogin} /> */}
              </BrowserRouter>
            </>
          );
          
        }
      }}
    </Async>
  )
        
}

export default App;
