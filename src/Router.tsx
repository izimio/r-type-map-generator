import { Routes, Route } from 'react-router-dom';

import MapEditor from './MapEditor';
import SpriteEditor from './SpriteEditor';
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MapEditor />} />
      <Route path="/sprite" element={<SpriteEditor />} />
    </Routes>
  );
}

export default AppRouter;
