import "./App.css";
import MainApp from "./components/mainApp.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="appContainer">
      <MainApp />
      <ToastContainer position="bottom-right" />
    </div>
  )};
  export default App;
