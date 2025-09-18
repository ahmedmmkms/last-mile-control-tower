import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DriverApp from './driver-pwa/DriverApp';
import './App.css';

function App() {
  // Check if we're on a driver route
  const isDriverRoute = window.location.pathname.startsWith('/driver');
  
  if (isDriverRoute) {
    return <DriverApp />;
  }
  
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
