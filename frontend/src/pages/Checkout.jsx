import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'Bangladesh',
  });

  const items = cart.items || [];
  const shipping = cartTotal >= 50 ? 0 : 5;
  const total = cartTotal + shipping;

  const orderItems = items.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.images?.[0] || '',
    price: i.product.discountPrice > 0 ? i.product.discountPrice : i.product.price,
    quantity: i.quantity,
    size: i.size,
    color: i.color,
  }));

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/orders', {
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        totalPrice: total,
      });

      if (paymentMethod === 'stripe') {
        // Create payment intent & navigate to payment
        const { data: pi } = await axios.post('/api/payment/create-intent', { amount: total });
        navigate(`/order-success/${data._id}`, { state: { clientSecret: pi.clientSecret, orderId: data._id } });
      } else {
        navigate(`/order-success/${data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-10">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${step === i + 1 ? 'text-primary' : 'text-gray-500'}`}>{s}</span>
            {i < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-3" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Phone Number', key: 'phone', type: 'tel' },
                { label: 'Street Address', key: 'street', type: 'text' },
                { label: 'City', key: 'city', type: 'text' },
                { label: 'Postal Code', key: 'postalCode', type: 'text' },
                { label: 'Country', key: 'country', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    required
                    value={address[key]}
                    onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                    className="input-field"
                  />
                </div>
              ))}
              <button type="submit" className="btn-primary w-full py-3">Continue to Payment</button>
            </form>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  { value: 'stripe', label: 'Credit/Debit Card (Stripe)', desc: 'Secure online payment' },
                ].map((pm) => (
                  <label key={pm.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === pm.value ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={pm.value}
                      checked={paymentMethod === pm.value}
                      onChange={() => setPaymentMethod(pm.value)}
                      className="accent-primary mt-1"
                    />
                    <div>
                      <p className="font-semibold">{pm.label}</p>
                      <p className="text-sm text-gray-500">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const p = item.product;
                  const price = p.discountPrice > 0 ? p.discountPrice : p.price;
                  return (
                    <div key={item._id} className="flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/60'} alt={p.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{p.name}</p>
                        {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(price * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 mb-4">
                <p className="text-sm text-gray-600 mb-1"><strong>Ship to:</strong> {address.name}, {address.street}, {address.city}</p>
                <p className="text-sm text-gray-600"><strong>Payment:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-outline flex-1 py-3">Back</button>
                <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1 py-3">
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
