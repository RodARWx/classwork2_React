/**
 * @fileoverview Root application router configuring navigation between
 * the Main Menu (`/`) and the Rick and Morty API Explorer (`/api`).
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ApiExplorerPage } from './pages/ApiExplorerPage';
import { MenuPage } from './pages/MenuPage';

/**
 * Top-level application component defining client-side routes.
 * Unknown paths redirect safely back to the root menu (`/`).
 *
 * @returns {JSX.Element} Router-wrapped application tree.
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/api" element={<ApiExplorerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
