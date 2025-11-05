import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Calendar, Package, User, Upload, Clock, MapPin, Settings, 
  CreditCard, FileText, Camera, Plus, Trash2, Edit, LogOut,
  ShoppingBag, RotateCcw
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { ImageUploadWithCrop } from '../components/ImageUploadWithCrop';
import { toast } from 'sonner@2.0.3';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState<string>('');
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      street: '123 Dhanmondi Road',
      city: 'Dhaka',
      district: 'Dhaka',
      postalCode: '1209',
      phone: '01700000000',
      isDefault: true
    }
  ]);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    street: '',
    city: '',
    district: '',
    postalCode: '',
    phone: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const appointments = [
    {
      id: '1',
      doctor: 'Dr. Rahman Ahmed',
      specialty: 'Cardiologist',
      date: '2025-11-10',
      time: '10:00 AM',
      status: 'confirmed',
      fee: 1200,
    },
    {
      id: '2',
      doctor: 'Dr. Fatima Khanam',
      specialty: 'Pediatrician',
      date: '2025-11-08',
      time: '2:00 PM',
      status: 'pending',
      fee: 1000,
    },
  ];

  const orders = [
    {
      id: '1',
      items: ['Napa Extend 665mg', 'Seclo 20mg'],
      total: 550,
      status: 'delivered',
      date: '2025-11-02',
      address: '123 Dhanmondi Road, Dhaka',
      canRefund: true
    },
    {
      id: '2',
      items: ['Ace Plus', 'Fexo 120mg'],
      total: 450,
      status: 'processing',
      date: '2025-11-05',
      address: '123 Dhanmondi Road, Dhaka',
      canRefund: false
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your dashboard</p>
          <Button onClick={() => onNavigate('login')} className="bg-sky-500 hover:bg-sky-600">
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (user.status === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <CardTitle className="text-center">Account Pending Approval</CardTitle>
            <CardDescription className="text-center">
              Your account is waiting for admin approval. You'll receive an email once activated.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleProfileImageUpload = (imageData: string) => {
    setProfileImage(imageData);
    toast.success('Profile photo updated!');
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.district) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, address]);
    setNewAddress({ type: 'Home', street: '', city: '', district: '', postalCode: '', phone: '' });
    setShowAddressForm(false);
    toast.success('Address added successfully!');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success('Address deleted');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated');
  };

  const handleRequestRefund = (orderId: string) => {
    toast.success('Refund request submitted. Admin will review shortly.');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      confirmed: { color: 'bg-green-100 text-green-700', text: 'Confirmed' },
      pending: { color: 'bg-amber-100 text-amber-700', text: 'Pending' },
      cancelled: { color: 'bg-red-100 text-red-700', text: 'Cancelled' },
      delivered: { color: 'bg-green-100 text-green-700', text: 'Delivered' },
      processing: { color: 'bg-blue-100 text-blue-700', text: 'Processing' },
    };

    const { color, text } = config[status] || { color: 'bg-gray-100 text-gray-700', text: status };
    return <Badge className={color}>{text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'profile' ? 'bg-sky-50 text-sky-600' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'appointments' ? 'bg-sky-50 text-sky-600' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'orders' ? 'bg-sky-50 text-sky-600' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    <span>Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'addresses' ? 'bg-sky-50 text-sky-600' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Addresses</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'settings' ? 'bg-sky-50 text-sky-600' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                  <Separator className="my-2" />
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('home');
                      toast.success('Logged out successfully');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24 ring-4 ring-sky-100">
                        <AvatarImage src={profileImage} />
                        <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-500 text-white text-2xl">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-gray-900 mb-1">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <ImageUploadWithCrop
                        currentImage={profileImage}
                        onImageSelected={handleProfileImageUpload}
                        aspectRatio={1}
                        label="Update Profile Photo"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input defaultValue={user.name} className="mt-1" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input defaultValue={user.email} className="mt-1" disabled />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input placeholder="+880 1700-000000" className="mt-1" />
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input type="date" className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Bio</Label>
                      <Textarea placeholder="Tell us about yourself" className="mt-1" rows={3} />
                    </div>
                  </div>

                  <Button className="bg-sky-500 hover:bg-sky-600">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Appointments</CardTitle>
                    <CardDescription>View and manage your doctor appointments</CardDescription>
                  </CardHeader>
                </Card>
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-1">{appointment.doctor}</h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="text-gray-900">{appointment.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Time</p>
                          <p className="text-gray-900">{appointment.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Fee</p>
                          <p className="text-sky-600">৳{appointment.fee}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>Track your medicine orders and request refunds</CardDescription>
                  </CardHeader>
                </Card>
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-1">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Items:</p>
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-xl text-sky-600">৳{order.total}</p>
                        </div>
                        {order.canRefund && order.status === 'delivered' && (
                          <Button
                            onClick={() => handleRequestRefund(order.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Request Refund
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Delivery Addresses</CardTitle>
                        <CardDescription>Manage your delivery addresses</CardDescription>
                      </div>
                      <Button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="bg-sky-500 hover:bg-sky-600"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  </CardHeader>
                  {showAddressForm && (
                    <CardContent className="border-t pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Address Type</Label>
                          <Input
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                            placeholder="Home, Office, etc."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Phone Number *</Label>
                          <Input
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            placeholder="+880 1700-000000"
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Street Address *</Label>
                          <Input
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            placeholder="House/Flat no, Road, Area"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>City *</Label>
                          <Input
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            placeholder="Dhaka"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>District *</Label>
                          <Input
                            value={newAddress.district}
                            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                            placeholder="Dhaka"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Postal Code</Label>
                          <Input
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            placeholder="1209"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddAddress} className="bg-sky-500 hover:bg-sky-600">
                          Save Address
                        </Button>
                        <Button onClick={() => setShowAddressForm(false)} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {addresses.map((address) => (
                  <Card key={address.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-sky-100 p-3 rounded-lg">
                            <MapPin className="h-5 w-5 text-sky-600" />
                          </div>
                          <div>
                            <h3 className="text-gray-900 mb-1">{address.type}</h3>
                            {address.isDefault && (
                              <Badge className="bg-green-100 text-green-700">Default</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteAddress(address.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{address.street}</p>
                        <p>{address.city}, {address.district} {address.postalCode}</p>
                        <p>{address.phone}</p>
                      </div>
                      {!address.isDefault && (
                        <Button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          variant="outline"
                          size="sm"
                          className="mt-4"
                        >
                          Set as Default
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Current Password</Label>
                        <Input type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label>New Password</Label>
                        <Input type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label>Confirm New Password</Label>
                        <Input type="password" className="mt-1" />
                      </div>
                      <Button className="bg-sky-500 hover:bg-sky-600">
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Email Notifications</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Order Updates</span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Promotional Emails</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
