
import './App.css'
import MainApp from './components/mainApp.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <MainApp />
            <ToastContainer position="top-center" />
</>
  )
}

export default App;
