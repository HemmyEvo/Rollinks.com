import { useShoppingCart } from 'use-shopping-cart';
import PaystackInline from '@paystack/inline-js';
import { useState, useMemo, useEffect } from 'react';
import { client } from '../../../lib/sanity';
import Select from 'react-select';
import data from '../../api/countries+states.json';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from 'next/router';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Option {
  value: string;
  label: string;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { totalPrice, clearCart, cartDetails } = useShoppingCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailWarning, setEmailWarning] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<Option | null>(null);
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [customCity, setCustomCity] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  
  const { isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.user.getMe, isAuthenticated ? undefined : "skip");

  // Delivery pricing
  const deliveryPrices = {
    lautech: 200,
    ogbomoso: 500,
    outside: {
      nearby: 1500,
      mid: 3000,
      far: 5000,
    },
  };

  const predefinedLocations = [
    { value: 'lautech', label: 'LAUTECH Campus' },
    { value: 'ogbomoso', label: 'Inside Ogbomoso' },
    { value: 'outside-nearby', label: 'Nearby States (Ibadan, Ilorin)' },
    { value: 'outside-mid', label: 'Mid-distance (Lagos, Abuja)' },
    { value: 'outside-far', label: 'Far States (Port Harcourt, Kano)' },
    { value: 'custom', label: 'Other (Enter Manually)' },
  ];

  // Build the country list
  const countries = useMemo(() => {
    return data.map((country: any) => ({
      value: country.iso2,
      label: country.name,
    }));
  }, []);

  // When country changes, update states list
  const handleCountryChange = (selectedOption: Option | null) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedLocation(null);
    setShippingFee(0);

    if (selectedOption) {
      const country = data.find((c: any) => c.iso2 === selectedOption.value);
      if (country?.states) {
        setStateOptions(
          country.states.map((state: any) => ({
            value: state.state_code,
            label: state.name,
          }))
        );
      } else {
        setStateOptions([]);
      }
    } else {
      setStateOptions([]);
    }
  };

  const handleStateChange = (selectedOption: Option | null) => {
    setSelectedState(selectedOption);
    setSelectedLocation(null);
    setShippingFee(0);
  };

  const handleLocationChange = (selectedOption: Option | null) => {
    setSelectedLocation(selectedOption);
    setCustomCity('');

    if (!selectedOption) return;

    switch (selectedOption.value) {
      case 'lautech':
        setShippingFee(deliveryPrices.lautech);
        break;
      case 'ogbomoso':
        setShippingFee(deliveryPrices.ogbomoso);
        break;
      case 'outside-nearby':
        setShippingFee(deliveryPrices.outside.nearby);
        break;
      case 'outside-mid':
        setShippingFee(deliveryPrices.outside.mid);
        break;
      case 'outside-far':
        setShippingFee(deliveryPrices.outside.far);
        break;
      case 'custom':
        setShippingFee(0);
        break;
    }
  };

  const totalAmount = useMemo(() => {
    return (totalPrice || 0) + shippingFee;
  }, [totalPrice, shippingFee]);

  const handlePayment = () => {
    if (!email.includes('@')) {
      setEmailWarning(true);
      return;
    }

    setEmailWarning(false);
    setLoading(true);

    const paystack = new PaystackInline();

    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: email,
      amount: totalAmount * 100,
      currency: 'NGN',
      metadata: {
        custom_fields: [
          { display_name: 'Full Name', value: `${firstName} ${lastName}` },
          { display_name: 'Email', value: email },
        ],
      },
      onSuccess: async (response: any) => {
        const orderData = {
          _type: 'order',
          reference: response.reference,
          amount: totalAmount * 100,
          paymentDetails: { method: response.message, status: response.status },
          customerDetails: { fullName: `${firstName} ${lastName}`, email },
          cart: { items: cartDetails || [], total: totalPrice || 0 },
          createdAt: new Date().toISOString(),
        };

        try {
          const createdOrder = await client.create(orderData);
          clearCart();
          onClose();

          //router.push(`/order-tracking/${createdOrder._id}`);
        } catch (error) {
          console.error('Error saving order to Sanity:', error);
        }
      },
      onCancel: () => {
        console.log('Payment Cancelled');
        setLoading(false);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Checkout</h2>

        {/* Name and Email Inputs */}
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="p-2 border rounded w-full mt-2" />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="p-2 border rounded w-full mt-2" />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded w-full mt-2" />
        {emailWarning && <p className="text-red-500 text-sm">Enter a valid email for transaction history</p>}

        {/* Payment Button */}
        <div className="mt-4">
          <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>

        <button className="w-full bg-gray-500 text-white py-2 rounded mt-2" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CheckoutModal;
