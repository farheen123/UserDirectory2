import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { ListPage } from './pages/ListPage';
import { AddPage } from './pages/AddPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ink text-slate-light font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#b7b7d8',
            color: '#e0e0e8',
            border: '1px solid #c8c8e0',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#1a1a24' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1a1a24' },
          },
        }}
      />
    </BrowserRouter>
  );
}
