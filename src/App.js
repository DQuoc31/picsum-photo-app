import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import PhotoList from './components/PhotoList.js';
import PhotoDetail from './components/PhotoDetail.js';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">📷 Picsum Photos Gallery</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<PhotoList />} />
            <Route path="/photos/:id" element={<PhotoDetail />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white mt-8">
          <div className="container mx-auto px-4 py-4 text-center">
            <p className="text-gray-300 text-sm">Powered by Lorem Picsum API</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;