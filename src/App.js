import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import Header from './Header';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import UsageTimer from './UsageTimer';

function App() {
  return (
    <>
      <UsageTimer>
        <Header />   
        <ScrollToTop>
          <Routes>
              <Route path="/" element={<VideoList />} />
              <Route path=":videoId" element={<VideoPlayer />} />
          </Routes>
        </ScrollToTop>
      </UsageTimer>
    </>
  );
}

export default App;
