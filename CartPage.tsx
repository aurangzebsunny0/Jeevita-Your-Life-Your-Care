import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag, User, MapPin, Phone, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';

interface CartPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [showGuestCheckout, setShowGuestCheckout] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const deliveryFee = 50;
  const total = cartTotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!user) {
      setShowGuestCheckout(true);
      return;
    }

    onNavigate('payment', {
      type: 'medicine',
      items: cart,
      amount: total,
    });
  };

  const handleGuestCheckout = () => {
    if (!guestInfo.name || !guestInfo.phone || !guestInfo.address) {
      toast.error('Please fill in all fields');
      return;
    }

    onNavigate('payment', {
      type: 'medicine',
      items: cart,
      amount: total,
      guestInfo,
    });
    setShowGuestCheckout(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent inline-block">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout</p>
        </div>

        {cart.length === 0 ? (
          <Card className="border-2 border-amber-200">
            <CardContent className="p-12 text-center">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-amber-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">
                Add some medicines to get started
              </p>
              <Button
                onClick={() => onNavigate('medicines')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30"
              >
                <Package className="h-4 w-4 mr-2" />
                Browse Medicines
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl border-2 border-amber-100"
                      />

                      {/* Item Details */}
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-2 font-semibold">{item.name}</h4>
                        <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                          ৳{item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-xl px-3 py-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-lg hover:bg-amber-100 transition-colors"
                            >
                              <Minus className="h-4 w-4 text-amber-700" />
                            </button>
                            <span className="w-12 text-center font-bold text-amber-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-lg hover:bg-amber-100 transition-colors"
                            >
                              <Plus className="h-4 w-4 text-amber-700" />
                            </button>
                          </div>

                          <p className="text-lg font-bold text-gray-900">
                            = ৳{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success('Item removed from cart');
                        }}
                        className="text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-50 transition-all h-fit"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-amber-200 sticky top-24">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="text-amber-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({cart.length} items)</span>
                      <span className="font-semibold">৳{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee</span>
                      <span className="font-semibold">৳{deliveryFee}</span>
                    </div>
                    <div className="border-t-2 border-amber-200 pt-3 flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ৳{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {!user && (
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
                      <p className="text-sm text-amber-800 mb-2 font-medium">
                        🚀 Need urgent delivery?
                      </p>
                      <p className="text-xs text-gray-600">
                        Checkout as guest without creating an account!
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 text-lg py-6"
                  >
                    {user ? 'Proceed to Payment' : 'Guest Checkout'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>

                  {!user && (
                    <Button
                      onClick={() => onNavigate('login')}
                      variant="outline"
                      className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Login to Continue
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      clearCart();
                      toast.success('Cart cleared');
                    }}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Guest Checkout Dialog */}
        <Dialog open={showGuestCheckout} onOpenChange={setShowGuestCheckout}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Guest Checkout
              </DialogTitle>
              <DialogDescription>
                Provide your details for delivery. No account needed for urgent orders!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="guest-name" className="text-gray-700 font-medium">Full Name *</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
                  <Input
                    id="guest-name"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    placeholder="John Doe"
                    className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guest-phone" className="text-gray-700 font-medium">Phone Number *</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
                  <Input
                    id="guest-phone"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                    placeholder="01712345678"
                    className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guest-address" className="text-gray-700 font-medium">Delivery Address *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-amber-400" />
                  <Textarea
                    id="guest-address"
                    value={guestInfo.address}
                    onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                    placeholder="House, Road, Area, City"
                    rows={3}
                    className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> You'll receive payment details after submitting. Delivery within 24-48 hours.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowGuestCheckout(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGuestCheckout}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30"
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
