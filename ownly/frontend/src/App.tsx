import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import CreateDataset from './pages/CreateDataset';
import Generated from './pages/Generated';
import MyStreams from './pages/MyStreams';
import Docs from './pages/Docs';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-8 px-4 mx-auto">
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/create" element={<CreateDataset />} />
          <Route path="/generated/:id" element={<Generated />} />
          <Route path="/my-streams" element={<MyStreams />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
