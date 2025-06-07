
import './App.css'
import MainApp from './components/mainApp.jsx';
import { UserProvider } from './components/userProvider.jsx';

function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  )
}

export default App;
