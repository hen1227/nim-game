import './App.css'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./pages/HomePage.tsx";
import LocalPage from "./pages/LocalPage.tsx";
import OnlinePage from "./pages/OnlinePage.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ComingSoonPage from "./pages/ComingSoonPage.tsx";

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/play-local" element={<LocalPage/>}/>
                    <Route path="/play-online" element={<OnlinePage/>}/>
                    <Route path="/play-computer" element={<ComingSoonPage/>}/>

                </Routes>
                <ToastContainer
                    position="top-center"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    theme={'dark'}
                />
            </Router>
        </>
    )
}

export default App;
