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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Option {
  value: string;
  label: string;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { totalPrice, clearCart, handleCartClick, cartDetails } = useShoppingCart();
  const [loading, setLoading] = useState(false);

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
      if (country && country.states) {
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
        setShippingFee(0); // Wait for manual city input
        break;
    }
  };

  // Detect location from user input
  useEffect(() => {
    if (selectedLocation?.value !== 'custom' || !customCity.trim()) return;

    const city = customCity.toLowerCase();
    if (city.includes('lautech') || city.includes('university')) {
      setShippingFee(deliveryPrices.lautech);
    } else if (city.includes('ogbomoso')) {
      setShippingFee(deliveryPrices.ogbomoso);
    } else {
      setShippingFee(deliveryPrices.outside.nearby);
    }
  }, [customCity, selectedLocation]);

  const totalAmount = useMemo(() => {
    return (totalPrice || 0) + shippingFee;
  }, [totalPrice, shippingFee]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        {/* Order Summary */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₦{(totalPrice || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₦{shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
          <Select options={countries} value={selectedCountry} onChange={handleCountryChange} placeholder="Select Country" />
          <Select options={stateOptions} value={selectedState} onChange={handleStateChange} placeholder="Select State" isDisabled={!selectedCountry} className="mt-2" />

          <Select options={predefinedLocations} value={selectedLocation} onChange={handleLocationChange} placeholder="Select Delivery Location" className="mt-2" />
          
          {selectedLocation?.value === 'custom' && (
            <input type="text" value={customCity} onChange={(e) => setCustomCity(e.target.value)} placeholder="Enter your city" className="mt-2 p-2 border rounded w-full" />
          )}

          <p className="text-sm text-gray-600 mt-2">
            Delivery estimate: {shippingFee > 0 ? `₦${shippingFee.toLocaleString()}` : 'Enter city for price'}
          </p>
        </div>

        {/* Payment Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <div className="p-4 border rounded-md bg-gray-50 flex items-center justify-between">
            <Image src="/paystack.png" width={150} height={50} alt="Paystack" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => alert("Proceed to Paystack")}>
              Pay Now
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button className="w-full bg-gray-500 text-white py-2 rounded" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CheckoutModal;
