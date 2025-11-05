import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JeeviAssistant } from './components/JeeviAssistant';
import { HomePage } from './pages/HomePage';
import { DoctorsPage } from './pages/DoctorsPage';
import { MedicinesPage } from './pages/MedicinesPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { BookingPage } from './pages/BookingPage';
import { CartPage } from './pages/CartPage';
import { PaymentPage } from './pages/PaymentPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPanel } from './pages/AdminPanel';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';
import { MedicineDetailsPage } from './pages/MedicineDetailsPage';
import { HospitalDetailsPage } from './pages/HospitalDetailsPage';
import { Toaster } from './components/ui/sonner';

type Page =
  | 'home'
  | 'doctors'
  | 'medicines'
  | 'hospitals'
  | 'login'
  | 'signup'
  | 'booking'
  | 'cart'
  | 'payment'
  | 'dashboard'
  | 'admin'
  | 'admin-login'
  | 'doctor-profile'
  | 'medicine-details'
  | 'hospital-details';

interface NavigationState {
  page: Page;
  data?: any;
}

export default function App() {
  const [navigation, setNavigation] = useState<NavigationState>({
    page: 'home',
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleNavigate = (page: string, data?: any) => {
    setNavigation({ page: page as Page, data });
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (navigation.page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'doctors':
        return <DoctorsPage onNavigate={handleNavigate} />;
      case 'medicines':
        return <MedicinesPage onNavigate={handleNavigate} />;
      case 'hospitals':
        return <HospitalsPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} />;
      case 'booking':
        return (
          <BookingPage
            doctorId={navigation.data?.doctorId}
            onNavigate={handleNavigate}
          />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'payment':
        return (
          <PaymentPage
            paymentData={navigation.data}
            onNavigate={handleNavigate}
          />
        );
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'admin-login':
        return (
          <AdminLoginPage
            onNavigate={handleNavigate}
            onAdminLogin={() => {
              setIsAdminAuthenticated(true);
              handleNavigate('admin');
            }}
          />
        );
      case 'admin':
        if (!isAdminAuthenticated) {
          handleNavigate('admin-login');
          return <AdminLoginPage onNavigate={handleNavigate} onAdminLogin={() => {
            setIsAdminAuthenticated(true);
            handleNavigate('admin');
          }} />;
        }
        return <AdminPanel onNavigate={handleNavigate} />;
      case 'doctor-profile':
        return (
          <DoctorProfilePage
            doctorId={navigation.data?.doctorId}
            onNavigate={handleNavigate}
          />
        );
      case 'medicine-details':
        return (
          <MedicineDetailsPage
            medicineId={navigation.data?.medicineId}
            onNavigate={handleNavigate}
          />
        );
      case 'hospital-details':
        return (
          <HospitalDetailsPage
            hospitalId={navigation.data?.hospitalId}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              {navigation.page !== 'admin-login' && navigation.page !== 'admin' && (
                <Navbar
                  onNavigate={handleNavigate}
                  currentPage={navigation.page}
                />
              )}
              <main className="flex-1">{renderPage()}</main>
              {navigation.page !== 'admin' && navigation.page !== 'admin-login' && navigation.page !== 'dashboard' && (
                <Footer onNavigate={handleNavigate} />
              )}
              {navigation.page !== 'admin-login' && navigation.page !== 'admin' && (
                <JeeviAssistant onNavigate={handleNavigate} />
              )}
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
