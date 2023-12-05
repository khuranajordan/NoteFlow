import "./App.css";
import React from "react";
import Editor from "./components/Editor";
import { v4 as uuid } from "uuid";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Error from "./components/Error";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to={`/docs/${uuid()}`} />} />
        <Route path="/docs/:id" element={<Editor />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
