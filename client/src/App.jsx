import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import UploadForm from './components/MultipartUpload';
import ParallelUpload from './components/Parallel';
import UploadChunkVideo from './components/UploadChunkVideo';
import UploadVideo from './components/UploadForm';
import { Route, BrowserRouter, Routes } from "react-router-dom";
import VideoPlayer from './components/VideoPlayer';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Header />
               
                <Routes>                  
                    <Route path="/home" element={<Home />}> </Route>
                    {/* <Route path="/upload" element={<UploadVideo />} /> */}
                    {/* <Route path="/chunk-upload" element={<UploadChunkVideo />} /> */}
                    {/* <Route path="/multipart-upload" element={<UploadForm />} /> */}
                    <Route path="/upload" element={<ParallelUpload />} />
                    <Route path="/videoplayer" element={ <VideoPlayer />} />

                </Routes>
            </BrowserRouter>  
        </>
    );
}

export default App;
