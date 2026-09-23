import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { BorrowerDashboard } from './pages/BorrowerDashboard';
import { ConsentCenter } from './pages/ConsentCenter';
import { SimulatorPage } from './pages/SimulatorPage';
import { ScoreHistoryPage } from './pages/ScoreHistoryPage';
import { LenderDashboard } from './pages/LenderDashboard';
import { AccessHistoryPage } from './pages/AccessHistoryPage';
import { CursorGlow } from './components/CursorGlow';

const AppLayout: React.FC<{
  role: UserRole;
  borrowerId: number;
  borrowerName: string;
  onSwitchRole: (role: UserRole) => void;
  children: React.ReactNode;
}> = ({ role, borrowerId, borrowerName, onSwitchRole, children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isLogin = location.pathname === '/login';

  if (isLanding || isLogin) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col relative">
        <CursorGlow />
        <Navbar currentRole={role} onSwitchRole={onSwitchRole} />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col relative">
      <CursorGlow />
      <Navbar currentRole={role} onSwitchRole={onSwitchRole} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar role={role} borrowerName={borrowerName} onSwitchRole={onSwitchRole} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('borrower');
  const [borrowerId, setBorrowerId] = useState<number>(1);
  const [borrowerName, setBorrowerName] = useState<string>('Rahul Sharma');

  const handleLoginSuccess = (newRole: UserRole, bId?: number) => {
    setRole(newRole);
    if (bId) {
      setBorrowerId(bId);
      setBorrowerName(bId === 1 ? 'Rahul Sharma' : `Borrower #${bId}`);
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  return (
    <BrowserRouter>
      <AppLayout
        role={role}
        borrowerId={borrowerId}
        borrowerName={borrowerName}
        onSwitchRole={handleSwitchRole}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Borrower Routes */}
          <Route
            path="/borrower/dashboard"
            element={<BorrowerDashboard borrowerId={borrowerId} />}
          />
          <Route
            path="/borrower/privacy"
            element={<ConsentCenter borrowerId={borrowerId} />}
          />
          <Route
            path="/borrower/simulator"
            element={<SimulatorPage borrowerId={borrowerId} />}
          />
          <Route
            path="/borrower/history"
            element={<ScoreHistoryPage borrowerId={borrowerId} />}
          />

          {/* Lender Routes */}
          <Route path="/lender/dashboard" element={<LenderDashboard />} />
          <Route path="/lender/access-logs" element={<AccessHistoryPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
