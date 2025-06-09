import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Home from './home'
import Login from './login/login'
import SupporterDetails from './userDetails/supporterDetails'
import BereavedDetails from "./userDetails/BereavedDetails" 
import { useCurrentUser } from './userProvider'
import Register from './register/register'
import NoPage from "./noPage"

function MainApp() {
  const { currentUser } = useCurrentUser();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/home' element={ <Home /> } />
         {/* <Route path='/home' element={(currentUser.id != -1) ? <Home /> : <NoPage />} /> */}
        <Route path='/supporterDetails' element={<SupporterDetails />} />
        <Route path='/bereavedDetails' element={<BereavedDetails />} />
        
       
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter >
  )
}

export default MainApp;
