

import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import ParallelUpload from './components/Parallel';
import VideoPlayer from './components/VideoPlayer';
import Login from './components/Login';
import Signup from './components/Signup';
import Logout from './components/Logout';
import Protected from './components/Protected'; // Import the Protected component
import { Route, BrowserRouter, Routes } from "react-router-dom";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Logout />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/videoplayer" element={<VideoPlayer />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/upload"
                        element={<Protected Component={ParallelUpload} />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
