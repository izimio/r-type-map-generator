import { Routes, Route } from 'react-router-dom';

import MapEditor from './MapEditor';
import SpriteEditor from './SpriteEditor';
import WebSocketChart from './Trafic';
import Hub from './Hub';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/map" element={<MapEditor />} />
      <Route path="/sprite" element={<SpriteEditor />} />
      <Route path="/trafic" element={<WebSocketChart />} />
    </Routes>
  );
}

export default AppRouter;
