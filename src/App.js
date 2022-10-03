import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import Header from './Header';
import VideoPlayer from './VideoPlayer';
import UsageTimer from './UsageTimer';
import CategoryList from "./CategoryList";
import VideoList from "./VideoList";

function App() {
  return (
    <>
      <UsageTimer>
        <Header />   
        <ScrollToTop>
          <Routes>
              <Route path="/" element={<CategoryList />} />
              <Route path="/index.html" element={<CategoryList />} />
              <Route path="/search" element={<VideoList />} />
              <Route path=":videoId" element={<VideoPlayer />} />
          </Routes>
        </ScrollToTop>
      </UsageTimer>
    </>
  );
}

export default App;
