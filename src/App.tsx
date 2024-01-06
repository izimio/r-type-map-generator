import React from "react";
import MapEditor from "./MapEditor";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <div className="App">
      <Toaster position="bottom-left" reverseOrder={true} />
      <MapEditor />
    </div>
  );
};

export default App;
