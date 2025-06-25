
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { socket } from './services/socket' 
import { useEffect } from 'react';
import Home from '../components/home/home';
import Login from './login/login';
import SupporterDetails from './userDetails/supporterDetails';
import BereavedDetails from './userDetails/bereavedDetails';
import Calendar from './Calendar/CalendarPage';
import PostsList from './posts/PostsList';
import Register from './register/register';
import NoPage from "./noPage";
import ChatSelector from './chat/ChatSelector';
import ChatList from './chat/ChatList';
import ChatWindow from './chat/ChatWindow';
import NotificationPanel from "./notification/NotificationPanel";
import { useCurrentUser } from "./hooks/useCurrentUser";
function MainApp() {
    const { currentUser, loading } = useCurrentUser();
    useEffect(() => {
        if (!loading && currentUser?.id) {
            socket.emit('user_connected', { userId: currentUser.id });
        }
    }, [loading, currentUser]);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* דפים ראשיים */}
                <Route path="/home" element={<Home />} />
                <Route path="/posts" element={<PostsList />} />
                <Route path="/posts/new" element={<PostsList />} />
                <Route path="/posts/edit" element={<PostsList />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/notification" element={<NotificationPanel mode="panel" />} />
                {/* אזורי פרופיל */}
                <Route path="/supporterDetails" element={<SupporterDetails />} />
                <Route path="/bereavedDetails" element={<BereavedDetails />} />

                {/* צ'אט */}
                <Route path="/chat" element={<ChatSelector />} />
                <Route path="/chat/select" element={<ChatList />} />
                <Route path="/chat/session" element={<ChatWindow />} />
<Route path="/chat/session/:userName" element={<ChatWindow />} />

                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default MainApp;
