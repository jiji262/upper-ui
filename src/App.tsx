import React, { useState, useEffect } from 'react';
import { ComponentShowcase } from './features/ComponentShowcase';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 transition-all">
      <ComponentShowcase />
    </div>
  );
}

export default App;