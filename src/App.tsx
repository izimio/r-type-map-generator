import React from "react";
import AppRouter from "./Router";
import { Toaster } from "react-hot-toast";

import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Toaster position="bottom-left" reverseOrder={true} />
        <AppRouter />
      </Router>
    </div>
  );
};

export default App;
