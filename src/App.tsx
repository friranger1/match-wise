import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import { AtsPage } from './pages/ats/AtsPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/ats" element={<AtsPage />} />
        <Route path="/" element={<Navigate to="/ats" replace />} />
      </Routes>
    </>
  );
};

export default App;
