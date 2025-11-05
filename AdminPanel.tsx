import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ImageUploadWithCrop } from '../components/ImageUploadWithCrop';
import { 
  Users, Calendar, Package, DollarSign, Stethoscope, MessageSquare,
  CheckCircle, XCircle, TrendingUp, Pill, ShoppingBag, Image as ImageIcon,
  Plus, Edit, Trash2, Send, LayoutDashboard, Menu, X as CloseIcon, Shield,
  Activity, UserCheck, FileText, Settings, AlertCircle, ChevronRight,
  ArrowUpRight, ArrowDownRight, Eye, RotateCcw, Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { mockDoctors, mockMedicines } from '../data/mockData';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State for data management
  const [doctors, setDoctors] = useState(mockDoctors);
  const [medicines, setMedicines] = useState(mockMedicines);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);
  const [editingCarousel, setEditingCarousel] = useState<any>(null);
  
  const [carouselImages, setCarouselImages] = useState([
    { id: '1', image: 'https://images.unsplash.com/photo-1666886573230-2b730505f298?w=1200', title: 'Expert Healthcare', subtitle: 'Book appointments with top specialists', cta: 'Find Doctors' },
    { id: '2', image: 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?w=1200', title: 'Fast Medicine Delivery', subtitle: 'Order medicines online', cta: 'Order Now' },
  ]);

  // Form states
  const [doctorForm, setDoctorForm] = useState({
    name: '', specialty: '', experience: '', fee: '', rating: '', patients: '',
    availability: '', image: ''
  });
  
  const [medicineForm, setMedicineForm] = useState({
    name: '', company: '', type: '', price: '', stock: '', image: '', description: ''
  });

  const [carouselForm, setCarouselForm] = useState({
    title: '', subtitle: '', cta: '', image: ''
  });

  const stats = {
    totalUsers: 1248,
    totalDoctors: doctors.length,
    totalAppointments: 892,
    totalMedicineOrders: 2340,
    totalMedicines: medicines.length,
    appointmentRevenue: 1056000,
    medicineRevenue: 784500,
    totalRevenue: 1840500,
  };

  const [pendingUsers, setPendingUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'pending', date: '2025-11-05' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'pending', date: '2025-11-06' },
  ]);

  const [pendingPayments, setPendingPayments] = useState([
    {
      id: '1',
      user: 'Alice Johnson',
      type: 'Appointment',
      amount: 1200,
      transactionId: 'BK123456789',
      status: 'pending',
    },
    {
      id: '2',
      user: 'Bob Wilson',
      type: 'Medicine Order',
      amount: 550,
      transactionId: 'NG987654321',
      status: 'pending',
    },
  ]);

  // Load messages from localStorage
  const loadMessages = () => {
    try {
      const stored = localStorage.getItem('adminMessages');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading messages:', e);
    }
    return [
      {
        id: '1',
        userName: 'Sarah Ahmed',
        userEmail: 'sarah@example.com',
        message: 'I need help with my prescription order',
        timestamp: '2025-11-05 10:30 AM',
        status: 'unread',
        replies: [],
      },
    ];
  };

  // Load prescriptions from localStorage
  const loadPrescriptions = () => {
    try {
      const stored = localStorage.getItem('adminPrescriptions');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading prescriptions:', e);
    }
    return [];
  };

  const [liveMessages, setLiveMessages] = useState(loadMessages());
  const [prescriptions, setPrescriptions] = useState(loadPrescriptions());

  // Update localStorage when messages change
  React.useEffect(() => {
    localStorage.setItem('adminMessages', JSON.stringify(liveMessages));
  }, [liveMessages]);

  // Update localStorage when prescriptions change
  React.useEffect(() => {
    localStorage.setItem('adminPrescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const [refundRequests, setRefundRequests] = useState([
    {
      id: '1',
      userName: 'John Doe',
      orderType: 'Medicine Order',
      orderId: 'ORD123456',
      amount: 850,
      reason: 'Received wrong medicine',
      status: 'pending',
      requestDate: '2025-11-04',
      transactionId: 'BK987654321',
    },
    {
      id: '2',
      userName: 'Emma Wilson',
      orderType: 'Appointment',
      orderId: 'APT789012',
      amount: 1200,
      reason: 'Doctor cancelled appointment',
      status: 'pending',
      requestDate: '2025-11-05',
      transactionId: 'NG456789123',
    },
  ]);

  const [appointments, setAppointments] = useState([
    { id: '1', patientName: 'Sarah Ahmed', doctorName: 'Dr. Rahman', specialty: 'Cardiology', date: '2025-11-06', time: '10:00 AM', status: 'pending', amount: 1200, transactionId: 'BK123456' },
    { id: '2', patientName: 'Rakib Hassan', doctorName: 'Dr. Khan', specialty: 'Neurology', date: '2025-11-07', time: '02:00 PM', status: 'confirmed', amount: 1500, transactionId: 'NG789012' },
    { id: '3', patientName: 'Fatima Begum', doctorName: 'Dr. Islam', specialty: 'Pediatrics', date: '2025-11-05', time: '11:30 AM', status: 'completed', amount: 800, transactionId: 'BK345678' },
  ]);

  const [userActivities, setUserActivities] = useState([
    { id: '1', userName: 'Sarah Ahmed', email: 'sarah@example.com', action: 'Booked appointment with Dr. Rahman', timestamp: '2025-11-05 10:30 AM', type: 'appointment' },
    { id: '2', userName: 'Rakib Hassan', email: 'rakib@example.com', action: 'Ordered medicines (Napa, Ace)', timestamp: '2025-11-05 11:15 AM', type: 'order' },
    { id: '3', userName: 'Fatima Begum', email: 'fatima@example.com', action: 'Cancelled appointment', timestamp: '2025-11-05 09:45 AM', type: 'cancellation' },
  ]);

  const [paymentActivities, setPaymentActivities] = useState([
    { id: '1', user: 'Alice Johnson', type: 'Appointment', amount: 1200, transactionId: 'BK123456789', action: 'Verified', timestamp: '2025-11-05 10:00 AM', date: '2025-11-05' },
    { id: '2', user: 'Bob Wilson', type: 'Medicine Order', amount: 550, transactionId: 'NG987654321', action: 'Verified', timestamp: '2025-11-05 11:30 AM', date: '2025-11-05' },
  ]);

  const [revenueFilter, setRevenueFilter] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  const [replyText, setReplyText] = useState('');
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  // Handlers
  const handleApproveUser = (id: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User approved successfully!');
  };

  const handleRejectUser = (id: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User rejected');
  };

  const handleVerifyPayment = (id: string) => {
    setPendingPayments(prev => prev.filter(p => p.id !== id));
    toast.success('Payment verified successfully!');
  };

  const handleRejectPayment = (id: string) => {
    setPendingPayments(prev => prev.filter(p => p.id !== id));
    toast.error('Payment rejected');
  };

  const handleSendMessage = (messageId: string) => {
    if (!replyText.trim()) return;
    
    setLiveMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            status: 'read', 
            replies: [...msg.replies, { admin: true, text: replyText, timestamp: new Date().toLocaleString() }] 
          }
        : msg
    ));
    setReplyText('');
    toast.success('Message sent!');
  };

  const handleMarkAsRead = (messageId: string) => {
    setLiveMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ));
  };

  const handleApproveRefund = (id: string) => {
    setRefundRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
    toast.success('Refund approved! Amount will be processed.');
  };

  const handleRejectRefund = (id: string) => {
    setRefundRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
    toast.error('Refund request rejected');
  };

  const handleDeleteRefund = (id: string) => {
    setRefundRequests(prev => prev.filter(req => req.id !== id));
    toast.success('Refund request deleted');
  };

  const handleConfirmAppointment = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: 'confirmed' } : apt
    ));
    toast.success('Appointment confirmed!');
  };

  const handleCompleteAppointment = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: 'completed' } : apt
    ));
    toast.success('Appointment marked as completed!');
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    ));
    toast.error('Appointment cancelled');
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    toast.success('Appointment deleted');
  };

  const handleApprovePrescription = (id: string) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'approved' } : p
    ));
    toast.success('Prescription approved!');
  };

  const handleRejectPrescription = (id: string) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'rejected' } : p
    ));
    toast.error('Prescription rejected');
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
    toast.success('Prescription deleted');
  };

  const handleDeleteUserActivity = (id: string) => {
    setUserActivities(prev => prev.filter(activity => activity.id !== id));
    toast.success('Activity deleted');
  };

  const handleDeletePaymentActivity = (id: string) => {
    setPaymentActivities(prev => prev.filter(activity => activity.id !== id));
    toast.success('Activity deleted');
  };

  const handleAddDoctor = () => {
    const newDoctor = {
      id: Date.now().toString(),
      ...doctorForm,
      experience: Number(doctorForm.experience),
      fee: Number(doctorForm.fee),
      rating: Number(doctorForm.rating),
      patients: Number(doctorForm.patients),
    };
    setDoctors([...doctors, newDoctor]);
    setDoctorForm({ name: '', specialty: '', experience: '', fee: '', rating: '', patients: '', availability: '', image: '' });
    setShowDoctorForm(false);
    toast.success('Doctor added successfully!');
  };

  const handleAddMedicine = () => {
    const newMedicine = {
      id: Date.now().toString(),
      ...medicineForm,
      price: Number(medicineForm.price),
      stock: Number(medicineForm.stock),
      inStock: Number(medicineForm.stock) > 0,
    };
    setMedicines([...medicines, newMedicine]);
    setMedicineForm({ name: '', company: '', type: '', price: '', stock: '', image: '', description: '' });
    setShowMedicineForm(false);
    toast.success('Medicine added successfully!');
  };

  const handleAddCarousel = () => {
    const newCarousel = {
      id: Date.now().toString(),
      ...carouselForm,
    };
    setCarouselImages([...carouselImages, newCarousel]);
    setCarouselForm({ title: '', subtitle: '', cta: '', image: '' });
    setShowCarouselForm(false);
    toast.success('Carousel slide added successfully!');
  };

  const handleDeleteCarousel = (id: string) => {
    setCarouselImages(carouselImages.filter(img => img.id !== id));
    toast.success('Carousel slide deleted');
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
    toast.success('Doctor removed');
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
    toast.success('Medicine removed');
  };

  // Admin access is controlled by AdminLoginPage, so no need to check here
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'payments', label: 'Payment Verification', icon: DollarSign },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'messages', label: 'Live Messages', icon: MessageSquare },
    { id: 'refunds', label: 'Refund Requests', icon: RotateCcw },
    { id: 'doctors', label: 'Manage Doctors', icon: Stethoscope },
    { id: 'medicines', label: 'Manage Medicines', icon: Pill },
    { id: 'carousel', label: 'Carousel Manager', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-600">Manage Jeevita Platform</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('home')}
              variant="outline"
              className="border-gray-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Site
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[73px] z-30 h-[calc(100vh-73px)] w-72 bg-gradient-to-b from-white via-amber-50/30 to-orange-50/20 backdrop-blur-xl border-r border-amber-200 transition-transform duration-300 shadow-2xl shadow-amber-500/10`}>
          <ScrollArea className="h-full p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const unreadCount = item.id === 'messages' ? liveMessages.filter(m => m.status === 'unread').length : 
                                   item.id === 'refunds' ? refundRequests.filter(r => r.status === 'pending').length : 
                                   item.id === 'prescriptions' ? prescriptions.filter(p => p.status === 'pending').length : 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-200 group ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/40 scale-[1.02]'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-amber-800 hover:shadow-md'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-amber-100 group-hover:bg-amber-200'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 min-w-[20px] justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                    {activeTab === item.id && <ChevronRight className="h-4 w-4 animate-pulse" />}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card onClick={() => setActiveTab('users')} className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-amber-700 mb-1 font-medium">Total Users</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">{stats.totalUsers}</p>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                          <ArrowUpRight className="h-2.5 w-2.5 text-green-600" />
                          <span className="text-xs font-bold text-green-700">+12%</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg shadow-amber-500/30 flex-shrink-0">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card onClick={() => setActiveTab('doctors')} className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-orange-700 mb-1 font-medium">Total Doctors</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">{stats.totalDoctors}</p>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                          <TrendingUp className="h-2.5 w-2.5 text-green-600" />
                          <span className="text-xs font-bold text-green-700">+5 new</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl shadow-lg shadow-orange-500/30 flex-shrink-0">
                        <Stethoscope className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card onClick={() => setActiveTab('appointments')} className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-amber-700 mb-1 font-medium">Appointments</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">{stats.totalAppointments}</p>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                          <Activity className="h-2.5 w-2.5 text-green-600" />
                          <span className="text-xs font-bold text-green-700">+18%</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg shadow-amber-500/30 flex-shrink-0">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card onClick={() => setActiveTab('payments')} className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-orange-700 mb-1 font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">৳{(stats.totalRevenue / 1000).toFixed(0)}K</p>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                          <ArrowUpRight className="h-2.5 w-2.5 text-green-600" />
                          <span className="text-xs font-bold text-green-700">+22%</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl shadow-lg shadow-orange-500/30 flex-shrink-0">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-amber-600" />
                      Pending User Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {pendingUsers.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No pending users</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingUsers.slice(0, 3).map(user => (
                          <div key={user.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200 rounded-xl hover:shadow-md transition-all">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleApproveUser(user.id)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectUser(user.id)} className="border-red-300 text-red-600 hover:bg-red-50">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                      Pending Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {pendingPayments.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No pending payments</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingPayments.slice(0, 3).map(payment => (
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200 rounded-xl hover:shadow-md transition-all">
                            <div>
                              <p className="font-medium text-gray-900">{payment.user}</p>
                              <p className="text-sm text-gray-600">৳{payment.amount} - {payment.transactionId}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleVerifyPayment(payment.id)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectPayment(payment.id)} className="border-red-300 text-red-600 hover:bg-red-50">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
                  <p className="text-gray-600">Approve or reject user registrations and monitor activities</p>
                </div>
              </div>

              <Card className="border-2 border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-600" />
                    Pending User Approvals
                  </CardTitle>
                  <CardDescription>Review and approve new user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border-2 border-amber-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all bg-gradient-to-r from-amber-50/30 to-orange-50/30">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-amber-600 mt-1">Registered: {user.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleApproveUser(user.id)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="outline" onClick={() => handleRejectUser(user.id)} className="border-red-300 text-red-600 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pendingUsers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 text-amber-300 mx-auto mb-2" />
                        <p>No pending user approvals</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-600" />
                    User Activities
                  </CardTitle>
                  <CardDescription>Recent user actions and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border border-amber-200 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'appointment' ? 'bg-blue-100' :
                            activity.type === 'order' ? 'bg-green-100' :
                            'bg-red-100'
                          }`}>
                            {activity.type === 'appointment' && <Calendar className="h-4 w-4 text-blue-600" />}
                            {activity.type === 'order' && <Pill className="h-4 w-4 text-green-600" />}
                            {activity.type === 'cancellation' && <XCircle className="h-4 w-4 text-red-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.userName}</p>
                            <p className="text-sm text-gray-600">{activity.email}</p>
                            <p className="text-sm text-gray-700 mt-1">{activity.action}</p>
                            <p className="text-xs text-amber-600 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteUserActivity(activity.id)} className="text-red-500 hover:bg-red-50 border-red-200">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {userActivities.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="h-12 w-12 text-amber-300 mx-auto mb-2" />
                        <p>No recent activities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointments Management</h2>
                  <p className="text-gray-600">Manage all doctor appointments</p>
                </div>
              </div>

              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className={`border-2 ${
                    appointment.status === 'pending' ? 'border-amber-300 bg-amber-50/30' :
                    appointment.status === 'confirmed' ? 'border-blue-300 bg-blue-50/30' :
                    appointment.status === 'completed' ? 'border-green-300 bg-green-50/30' :
                    'border-red-300 bg-red-50/30'
                  } hover:shadow-xl transition-all`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-full ${
                            appointment.status === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                            appointment.status === 'confirmed' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                            appointment.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                            'bg-gradient-to-br from-red-500 to-rose-500'
                          }`}>
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{appointment.patientName}</h3>
                              <Badge className={
                                appointment.status === 'pending' ? 'bg-amber-500' :
                                appointment.status === 'confirmed' ? 'bg-blue-500' :
                                appointment.status === 'completed' ? 'bg-green-500' :
                                'bg-red-500'
                              }>
                                {appointment.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              With {appointment.doctorName} • {appointment.specialty}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-1 text-gray-700">
                                <Calendar className="h-3 w-3 text-amber-600" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-700">
                                <Clock className="h-3 w-3 text-amber-600" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-700">
                                <DollarSign className="h-3 w-3 text-amber-600" />
                                <span>৳{appointment.amount}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-700 font-mono text-xs">
                                <span className="text-gray-500">TxID:</span>
                                <span className="text-amber-600">{appointment.transactionId}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {appointment.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button onClick={() => handleCancelAppointment(appointment.id)} variant="outline" className="flex-1 text-red-600 hover:bg-red-50 border-red-200">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={() => handleConfirmAppointment(appointment.id)} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm
                          </Button>
                        </div>
                      )}

                      {appointment.status === 'confirmed' && (
                        <Button onClick={() => handleCompleteAppointment(appointment.id)} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </Button>
                      )}

                      {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                        <div className="space-y-2">
                          <div className={`${
                            appointment.status === 'completed' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                          } border rounded-lg p-3 text-center`}>
                            <span className={`${
                              appointment.status === 'completed' ? 'text-green-700' : 'text-red-700'
                            } font-medium`}>
                              {appointment.status === 'completed' ? '✓ Appointment Completed' : '✗ Appointment Cancelled'}
                            </span>
                          </div>
                          <Button onClick={() => handleDeleteAppointment(appointment.id)} variant="outline" className="w-full text-red-500 hover:bg-red-50 border-red-200">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Record
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {appointments.length === 0 && (
                  <Card className="border-2 border-dashed border-amber-200">
                    <CardContent className="p-12 text-center">
                      <Calendar className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-gray-600">No appointments found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification</h2>
                  <p className="text-gray-600">Verify bKash/Nagad payments and track activities</p>
                </div>
              </div>

              <Card className="border-2 border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                    Pending Payment Verifications
                  </CardTitle>
                  <CardDescription>Review and verify user payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border-2 border-amber-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all bg-gradient-to-r from-amber-50/30 to-orange-50/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">{payment.type}</Badge>
                            <span className="font-medium text-gray-900">{payment.user}</span>
                          </div>
                          <p className="text-sm text-gray-600">Amount: <span className="font-bold text-amber-600">৳{payment.amount}</span></p>
                          <p className="text-sm text-gray-600">Transaction ID: <span className="font-mono bg-amber-100 px-2 py-1 rounded text-amber-700">{payment.transactionId}</span></p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => {
                            handleVerifyPayment(payment.id);
                            setPaymentActivities(prev => [...prev, {
                              id: Date.now().toString(),
                              user: payment.user,
                              type: payment.type,
                              amount: payment.amount,
                              transactionId: payment.transactionId,
                              action: 'Verified',
                              timestamp: new Date().toLocaleString(),
                              date: new Date().toISOString().split('T')[0]
                            }]);
                          }} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verify
                          </Button>
                          <Button variant="outline" onClick={() => {
                            handleRejectPayment(payment.id);
                            setPaymentActivities(prev => [...prev, {
                              id: Date.now().toString(),
                              user: payment.user,
                              type: payment.type,
                              amount: payment.amount,
                              transactionId: payment.transactionId,
                              action: 'Rejected',
                              timestamp: new Date().toLocaleString(),
                              date: new Date().toISOString().split('T')[0]
                            }]);
                          }} className="border-red-300 text-red-600 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pendingPayments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="h-12 w-12 text-amber-300 mx-auto mb-2" />
                        <p>No pending payments</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-600" />
                    Recent Payment Activities
                  </CardTitle>
                  <CardDescription>History of verified and rejected payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paymentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border border-amber-200 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${activity.action === 'Verified' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {activity.action === 'Verified' ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> : 
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">{activity.user}</p>
                              <Badge className={activity.action === 'Verified' ? 'bg-green-500' : 'bg-red-500'}>
                                {activity.action}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{activity.type} • ৳{activity.amount}</p>
                            <p className="text-xs text-gray-600 font-mono">TxID: {activity.transactionId}</p>
                            <p className="text-xs text-amber-600 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDeletePaymentActivity(activity.id)} className="text-red-500 hover:bg-red-50 border-red-200">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {paymentActivities.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="h-12 w-12 text-amber-300 mx-auto mb-2" />
                        <p>No payment activities yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                        Revenue Analytics
                      </CardTitle>
                      <CardDescription>Track revenue by daily, monthly, and yearly periods</CardDescription>
                    </div>
                    <Select value={revenueFilter} onValueChange={(value: any) => setRevenueFilter(value)}>
                      <SelectTrigger className="w-40 border-amber-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Revenue Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 mb-1">
                            {revenueFilter === 'daily' ? 'Today' : revenueFilter === 'monthly' ? 'This Month' : 'This Year'}
                          </p>
                          <p className="text-2xl font-bold text-amber-600">
                            ৳{paymentActivities
                              .filter(a => a.action === 'Verified')
                              .reduce((sum, a) => sum + a.amount, 0)
                              .toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                          <p className="text-2xl font-bold text-green-600">
                            {paymentActivities.filter(a => a.action === 'Verified').length}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 mb-1">Average Transaction</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ৳{paymentActivities.filter(a => a.action === 'Verified').length > 0 
                              ? Math.round(paymentActivities.filter(a => a.action === 'Verified').reduce((sum, a) => sum + a.amount, 0) / paymentActivities.filter(a => a.action === 'Verified').length)
                              : 0}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Revenue Transactions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Revenue Transactions</h4>
                      {paymentActivities
                        .filter(a => a.action === 'Verified')
                        .map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between p-4 border border-green-200 rounded-xl hover:border-green-300 hover:shadow-sm transition-all bg-green-50/30">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-green-100">
                                <DollarSign className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-gray-900">{activity.user}</p>
                                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">{activity.type}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">Amount: <span className="font-bold text-green-600">৳{activity.amount}</span></p>
                                <p className="text-xs text-gray-600 font-mono">TxID: {activity.transactionId}</p>
                                <p className="text-xs text-amber-600 mt-1">{activity.timestamp}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleDeletePaymentActivity(activity.id)} className="text-red-500 hover:bg-red-50 border-red-200">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      {paymentActivities.filter(a => a.action === 'Verified').length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <TrendingUp className="h-12 w-12 text-amber-300 mx-auto mb-2" />
                          <p>No revenue transactions yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Prescription Management</h2>
                  <p className="text-gray-600">Review and process prescription uploads from users</p>
                </div>
              </div>

              <div className="grid gap-4">
                {prescriptions.map((prescription) => (
                  <Card key={prescription.id} className={`border-2 ${
                    prescription.status === 'pending' ? 'border-amber-300 bg-amber-50/30' :
                    prescription.status === 'approved' ? 'border-green-300 bg-green-50/30' :
                    'border-red-300 bg-red-50/30'
                  } hover:shadow-xl transition-all`}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Prescription Image */}
                        <div>
                          <div className="relative group">
                            <img 
                              src={prescription.image} 
                              alt="Prescription" 
                              className="w-full h-64 object-cover rounded-xl border-2 border-amber-200"
                            />
                            <Button 
                              size="sm"
                              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-900"
                              onClick={() => window.open(prescription.image, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Full
                            </Button>
                          </div>
                        </div>

                        {/* Prescription Details */}
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-3 rounded-full ${
                                prescription.status === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                                prescription.status === 'approved' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                                'bg-gradient-to-br from-red-500 to-rose-500'
                              }`}>
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-gray-900">{prescription.userName}</h3>
                                  <Badge className={
                                    prescription.status === 'pending' ? 'bg-amber-500' :
                                    prescription.status === 'approved' ? 'bg-green-500' :
                                    'bg-red-500'
                                  }>
                                    {prescription.status.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{prescription.userEmail}</p>
                                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Uploaded: {prescription.uploadDate}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* User Details Card */}
                          <Card className="border border-amber-200 bg-white">
                            <CardContent className="p-4">
                              <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">User ID:</span>
                                  <span className="font-medium">{prescription.userId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Name:</span>
                                  <span className="font-medium">{prescription.userName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium">{prescription.userEmail}</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full mt-3 border-amber-300 text-amber-700 hover:bg-amber-50"
                                onClick={() => {
                                  // Navigate to user cart management
                                  toast.success(`Opening cart for ${prescription.userName}...`);
                                  // In a real app, this would open a modal or navigate to user's cart
                                }}
                              >
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Manage User Cart
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Action Buttons */}
                          {prescription.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button onClick={() => handleRejectPrescription(prescription.id)} variant="outline" className="flex-1 text-red-600 hover:bg-red-50 border-red-300">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button onClick={() => handleApprovePrescription(prescription.id)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </div>
                          )}

                          {prescription.status === 'approved' && (
                            <div className="space-y-2">
                              <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                                <CheckCircle className="h-5 w-5 text-green-600 inline mr-2" />
                                <span className="text-green-700 font-medium">Prescription Approved - Ready to add medicines</span>
                              </div>
                              <Button onClick={() => handleDeletePrescription(prescription.id)} variant="outline" className="w-full text-red-500 hover:bg-red-50 border-red-200">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Record
                              </Button>
                            </div>
                          )}

                          {prescription.status === 'rejected' && (
                            <div className="space-y-2">
                              <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center">
                                <XCircle className="h-5 w-5 text-red-600 inline mr-2" />
                                <span className="text-red-700 font-medium">Prescription Rejected</span>
                              </div>
                              <Button onClick={() => handleDeletePrescription(prescription.id)} variant="outline" className="w-full text-red-500 hover:bg-red-50 border-red-200">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Record
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {prescriptions.length === 0 && (
                  <Card className="border-2 border-dashed border-amber-200">
                    <CardContent className="p-12 text-center">
                      <FileText className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-gray-600">No prescription uploads</p>
                      <p className="text-sm text-gray-500 mt-2">Prescription uploads from users will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Doctors</h2>
                  <p className="text-gray-600">Add, edit, or remove doctors</p>
                </div>
                <Button onClick={() => setShowDoctorForm(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Doctor
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{doctor.experience}+ years</Badge>
                            <span className="text-xs text-gray-500">৳{doctor.fee}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDeleteDoctor(doctor.id)}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add Doctor Dialog */}
              <Dialog open={showDoctorForm} onOpenChange={setShowDoctorForm}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Doctor</DialogTitle>
                    <DialogDescription>Fill in the details to add a new doctor to the platform</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Doctor Name</Label>
                        <Input
                          value={doctorForm.name}
                          onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                          placeholder="Dr. Rahman Ahmed"
                        />
                      </div>
                      <div>
                        <Label>Specialty</Label>
                        <Input
                          value={doctorForm.specialty}
                          onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                          placeholder="Cardiologist"
                        />
                      </div>
                      <div>
                        <Label>Experience (years)</Label>
                        <Input
                          type="number"
                          value={doctorForm.experience}
                          onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                          placeholder="15"
                        />
                      </div>
                      <div>
                        <Label>Consultation Fee (৳)</Label>
                        <Input
                          type="number"
                          value={doctorForm.fee}
                          onChange={(e) => setDoctorForm({ ...doctorForm, fee: e.target.value })}
                          placeholder="1200"
                        />
                      </div>
                      <div>
                        <Label>Rating (1-5)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={doctorForm.rating}
                          onChange={(e) => setDoctorForm({ ...doctorForm, rating: e.target.value })}
                          placeholder="4.8"
                        />
                      </div>
                      <div>
                        <Label>Patients Treated</Label>
                        <Input
                          type="number"
                          value={doctorForm.patients}
                          onChange={(e) => setDoctorForm({ ...doctorForm, patients: e.target.value })}
                          placeholder="500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Availability</Label>
                      <Input
                        value={doctorForm.availability}
                        onChange={(e) => setDoctorForm({ ...doctorForm, availability: e.target.value })}
                        placeholder="Mon-Fri, 9AM-5PM"
                      />
                    </div>
                    <div>
                      <ImageUploadWithCrop
                        currentImage={doctorForm.image}
                        onImageSelected={(image) => setDoctorForm({ ...doctorForm, image })}
                        aspectRatio={1}
                        label="Doctor Photo"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowDoctorForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddDoctor} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                        Add Doctor
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === 'medicines' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Medicines</h2>
                  <p className="text-gray-600">Add, edit, or remove medicines</p>
                </div>
                <Button onClick={() => setShowMedicineForm(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medicine
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {medicines.map((medicine) => (
                  <Card key={medicine.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <img src={medicine.image} alt={medicine.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <p className="font-medium text-gray-900 mb-1">{medicine.name}</p>
                      <p className="text-sm text-gray-600 mb-2">{medicine.company}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-amber-600">৳{medicine.price}</span>
                        <Badge className={medicine.inStock ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'}>
                          {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => handleDeleteMedicine(medicine.id)}>
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add Medicine Dialog */}
              <Dialog open={showMedicineForm} onOpenChange={setShowMedicineForm}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Medicine</DialogTitle>
                    <DialogDescription>Fill in the details to add a new medicine</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Medicine Name</Label>
                        <Input
                          value={medicineForm.name}
                          onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                          placeholder="Napa Extend 665mg"
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={medicineForm.company}
                          onChange={(e) => setMedicineForm({ ...medicineForm, company: e.target.value })}
                          placeholder="Beximco Pharmaceuticals"
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={medicineForm.type} onValueChange={(value) => setMedicineForm({ ...medicineForm, type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tablet">Tablet</SelectItem>
                            <SelectItem value="Capsule">Capsule</SelectItem>
                            <SelectItem value="Syrup">Syrup</SelectItem>
                            <SelectItem value="Injection">Injection</SelectItem>
                            <SelectItem value="Cream">Cream</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Price (৳)</Label>
                        <Input
                          type="number"
                          value={medicineForm.price}
                          onChange={(e) => setMedicineForm({ ...medicineForm, price: e.target.value })}
                          placeholder="80"
                        />
                      </div>
                      <div>
                        <Label>Stock Quantity</Label>
                        <Input
                          type="number"
                          value={medicineForm.stock}
                          onChange={(e) => setMedicineForm({ ...medicineForm, stock: e.target.value })}
                          placeholder="100"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={medicineForm.description}
                        onChange={(e) => setMedicineForm({ ...medicineForm, description: e.target.value })}
                        placeholder="Medicine description..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <ImageUploadWithCrop
                        currentImage={medicineForm.image}
                        onImageSelected={(image) => setMedicineForm({ ...medicineForm, image })}
                        aspectRatio={1}
                        label="Medicine Image"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowMedicineForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMedicine} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                        Add Medicine
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === 'carousel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Carousel Manager</h2>
                  <p className="text-gray-600">Manage homepage carousel slides</p>
                </div>
                <Button onClick={() => setShowCarouselForm(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slide
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {carouselImages.map((slide) => (
                  <Card key={slide.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-xl mb-1">{slide.title}</h3>
                        <p className="text-sm text-white/90">{slide.subtitle}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-amber-500">{slide.cta}</Badge>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteCarousel(slide.id)} className="text-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add Carousel Dialog */}
              <Dialog open={showCarouselForm} onOpenChange={setShowCarouselForm}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Carousel Slide</DialogTitle>
                    <DialogDescription>Create a new carousel slide for the homepage</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Slide Title</Label>
                      <Input
                        value={carouselForm.title}
                        onChange={(e) => setCarouselForm({ ...carouselForm, title: e.target.value })}
                        placeholder="Expert Healthcare"
                      />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input
                        value={carouselForm.subtitle}
                        onChange={(e) => setCarouselForm({ ...carouselForm, subtitle: e.target.value })}
                        placeholder="Book appointments with top specialists"
                      />
                    </div>
                    <div>
                      <Label>Call-to-Action Button Text</Label>
                      <Input
                        value={carouselForm.cta}
                        onChange={(e) => setCarouselForm({ ...carouselForm, cta: e.target.value })}
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <ImageUploadWithCrop
                        currentImage={carouselForm.image}
                        onImageSelected={(image) => setCarouselForm({ ...carouselForm, image })}
                        aspectRatio={16/9}
                        label="Slide Image (1200x400 recommended)"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowCarouselForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCarousel} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                        Add Slide
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Messages</h2>
                <p className="text-gray-600">Chat with users in real-time</p>
              </div>

              <div className="grid gap-4">
                {liveMessages.map((message) => (
                  <Card key={message.id} className={`border-2 ${message.status === 'unread' ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200'} hover:shadow-xl transition-all`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-full">
                            <MessageSquare className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">{message.userName}</h3>
                              {message.status === 'unread' && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{message.userEmail}</p>
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {message.status === 'unread' && (
                            <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(message.id)} className="text-amber-600 hover:bg-amber-50">
                              Mark as Read
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => setLiveMessages(prev => prev.filter(m => m.id !== message.id))} className="text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* User Message */}
                      <div className="bg-white border border-amber-200 rounded-xl p-4 mb-4">
                        <p className="text-gray-800">{message.message}</p>
                      </div>

                      {/* Previous Replies */}
                      {message.replies.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {message.replies.map((reply, idx) => (
                            <div key={idx} className={`${reply.admin ? 'bg-gradient-to-r from-amber-100 to-orange-100 ml-8' : 'bg-gray-100 mr-8'} rounded-xl p-4`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={reply.admin ? 'bg-amber-600' : 'bg-gray-600'}>
                                  {reply.admin ? 'Admin' : 'User'}
                                </Badge>
                                <span className="text-xs text-gray-600">{reply.timestamp}</span>
                              </div>
                              <p className="text-gray-800">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Section */}
                      {activeMessageId === message.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            className="border-amber-300 focus:border-amber-500"
                            rows={3}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => { setActiveMessageId(null); setReplyText(''); }}>
                              Cancel
                            </Button>
                            <Button onClick={() => { handleSendMessage(message.id); setActiveMessageId(null); }} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={() => setActiveMessageId(message.id)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                          <Send className="h-4 w-4 mr-2" />
                          Reply to {message.userName}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {liveMessages.length === 0 && (
                  <Card className="border-2 border-dashed border-amber-200">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-gray-600">No messages yet</p>
                      <p className="text-sm text-gray-500 mt-2">When users request live chat, their messages will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === 'refunds' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Refund Requests</h2>
                <p className="text-gray-600">Review and process refund requests</p>
              </div>

              <div className="grid gap-4">
                {refundRequests.map((request) => (
                  <Card key={request.id} className={`border-2 ${
                    request.status === 'pending' ? 'border-amber-300 bg-amber-50/30' : 
                    request.status === 'approved' ? 'border-green-300 bg-green-50/30' : 
                    'border-red-300 bg-red-50/30'
                  } hover:shadow-xl transition-all`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${
                            request.status === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                            request.status === 'approved' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                            'bg-gradient-to-br from-red-500 to-rose-500'
                          }`}>
                            <RotateCcw className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">{request.userName}</h3>
                              <Badge className={
                                request.status === 'pending' ? 'bg-amber-500' :
                                request.status === 'approved' ? 'bg-green-500' :
                                'bg-red-500'
                              }>
                                {request.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{request.orderType} • {request.orderId}</p>
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Requested on {request.requestDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-600">৳{request.amount}</p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="bg-white border border-amber-200 rounded-xl p-4 mb-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Type:</span>
                          <span className="font-medium">{request.orderType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">{request.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-medium text-amber-600">{request.transactionId}</span>
                        </div>
                        <Separator />
                        <div>
                          <span className="text-gray-600 block mb-1">Reason:</span>
                          <p className="text-gray-900 font-medium">{request.reason}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button onClick={() => handleRejectRefund(request.id)} variant="outline" className="flex-1 text-red-600 hover:bg-red-50 border-red-300">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Refund
                          </Button>
                          <Button onClick={() => handleApproveRefund(request.id)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve & Process
                          </Button>
                        </div>
                      )}

                      {request.status === 'approved' && (
                        <div className="space-y-2">
                          <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                            <CheckCircle className="h-5 w-5 text-green-600 inline mr-2" />
                            <span className="text-green-700 font-medium">Refund Approved - Amount will be processed to user's bKash/Nagad</span>
                          </div>
                          <Button onClick={() => handleDeleteRefund(request.id)} variant="outline" className="w-full text-red-500 hover:bg-red-50 border-red-200">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Record
                          </Button>
                        </div>
                      )}

                      {request.status === 'rejected' && (
                        <div className="space-y-2">
                          <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center">
                            <XCircle className="h-5 w-5 text-red-600 inline mr-2" />
                            <span className="text-red-700 font-medium">Refund Request Rejected</span>
                          </div>
                          <Button onClick={() => handleDeleteRefund(request.id)} variant="outline" className="w-full text-red-500 hover:bg-red-50 border-red-200">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Record
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {refundRequests.length === 0 && (
                  <Card className="border-2 border-dashed border-amber-200">
                    <CardContent className="p-12 text-center">
                      <RotateCcw className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-gray-600">No refund requests</p>
                      <p className="text-sm text-gray-500 mt-2">Refund requests from users will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600">Configure platform settings</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                  <CardDescription>Manage global platform settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Platform Name</Label>
                    <Input defaultValue="Jeevita" />
                  </div>
                  <div>
                    <Label>Admin Email</Label>
                    <Input defaultValue="admin@jeevita.com" type="email" />
                  </div>
                  <div>
                    <Label>Support Phone</Label>
                    <Input defaultValue="01625691878" />
                  </div>
                  <div>
                    <Label>bKash Number</Label>
                    <Input defaultValue="01625691878" />
                  </div>
                  <Separator />
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
