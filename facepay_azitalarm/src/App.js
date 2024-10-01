import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './page/LandingPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
    </Routes>
  );
}

export default App;
