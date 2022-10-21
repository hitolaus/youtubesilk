import {Route, Routes, useLocation} from 'react-router-dom';
import {AnimatePresence} from "framer-motion";

import ScrollToTop from './components/ScrollToTop';
import UsageTimer from './components/UsageTimer';

import Header from './Header';

import Categories from "./pages/Categories";
import Videos from "./pages/Videos";
import VideoPlayer from './pages/VideoPlayer';

function App() {
    const location = useLocation();
    return (
        <AnimatePresence>
            <UsageTimer>
                <Header/>
                <ScrollToTop>
                    <Routes key={location.pathname} location={location}>
                        <Route path="/" element={<Categories/>}/>
                        <Route path="/index.html" element={<Categories/>}/>
                        <Route path="/search" element={<Videos/>}/>
                        <Route path=":videoId" element={<VideoPlayer/>}/>
                    </Routes>
                </ScrollToTop>
            </UsageTimer>
        </AnimatePresence>
    );
}

export default App;
