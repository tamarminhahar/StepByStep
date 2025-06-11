
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// import Home from './home'
// import Login from './login/login'
// import SupporterDetails from './userDetails/supporterDetails'
// import BereavedDetails from './userDetails/BereavedDetails'
// import Calendar from './Calendar/Calendar'; 

// import PostsList from './postsList/PostsList'

// // import Comments from './comments/comments'
// import { useCurrentUser } from './userProvider'
// import Register from './register/register'
// import NoPage from "./noPage"

// function MainApp() {
//   const { currentUser } = useCurrentUser();
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path='/home' element={currentUser.id !== -1 ? <Home /> : <Navigate to="/login" />} />
//         <Route path='/supporterDetails' element={<SupporterDetails />} />
//         <Route path='/bereavedDetails' element={<BereavedDetails />} />
        
// <Route path='/users/:userId/posts' element={<PostsList />} />
//     <Route path='/Calendar' element={<Calendar />} />


     
//         <Route path="*" element={<NoPage />} />
//       </Routes>
//     </BrowserRouter >
//   )
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from './home';
import Login from './login/login';
import SupporterDetails from './userDetails/supporterDetails';
import BereavedDetails from './userDetails/bereavedDetails';
import Calendar from './Calendar/Calendar';
import PostsList from './postsList/PostsList';
import Register from './register/register';
import NoPage from "./noPage";

function MainApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes — don't block in the router! The server will block if no valid token */}
                <Route path="/home" element={<Home />} />
                <Route path="/supporterDetails" element={<SupporterDetails />} />
                <Route path="/bereavedDetails" element={<BereavedDetails />} />
                <Route path="/users/:userId/posts" element={<PostsList />} />
                <Route path="/Calendar" element={<Calendar />} />

                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default MainApp;
