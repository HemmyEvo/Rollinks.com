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

interface Country {
  iso2: string;
  name: string;
  states: State[];
}

interface State {
  id: string;
  name: string;
  state_code: string;
  latitude: string | null;
  longitude: string | null;
  type: string;
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
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [shippingFee, setShippingFee] = useState(0);

  const { isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.user.getMe, isAuthenticated ? undefined : "skip");

  // Delivery pricing matrix (modify these as needed)
  const deliveryPrices = {
    lautech: 200,       // LAUTECH campus deliveries
    ogbomoso: 500,      // Within Ogbomoso city
    outside: {
      nearby: 1500,     // Nearby states (e.g., Ibadan, Ilorin)
      mid: 3000,        // Mid-distance states (e.g., Lagos, Abuja)
      far: 5000,        // Far states (e.g., Port Harcourt, Kano)
    },
  };

  // Build the countries list from the imported data
  const countries = useMemo(() => {
    return data.map((country: any) => ({
      value: country.iso2,
      label: country.name,
    }));
  }, []);

  // When the country changes, update the state options based on the selected country.
  const handleCountryChange = (selectedOption: Option | null) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null); // Reset state when country changes

    if (selectedOption) {
      // Find the country by ISO code
      const country = data.find(
        (country: any) => country.iso2 === selectedOption.value
      );
      if (country && country.states) {
        // Map the country's states into Option format for react-select
        const mappedStates = country.states.map((state: any) => ({
          value: state.state_code,
          label: state.name,
        }));
        setStateOptions(mappedStates);
      } else {
        setStateOptions([]);
      }
    } else {
      setStateOptions([]);
    }
  };

  // Update shipping fee based on location
  useEffect(() => {
    const calculateShipping = () => {
      if (!selectedCountry || !selectedState) return;

      // Check if within Nigeria and Oyo state
      if (selectedCountry.value === 'NG' && selectedState.value === 'OY') {
        // Check specific cities/areas
        const normalizedCity = city.toLowerCase();

        if (normalizedCity.includes('lautech') || normalizedCity.includes('university')) {
          setShippingFee(deliveryPrices.lautech);
        } else if (normalizedCity.includes('ogbomoso')) {
          setShippingFee(deliveryPrices.ogbomoso);
        } else {
          setShippingFee(deliveryPrices.outside.nearby); // Default to nearby for Oyo state
        }
      } else if (selectedCountry.value === 'NG') {
        // For other states in Nigeria
        const state = selectedState.label.toLowerCase();
        if (['lagos', 'abuja', 'kano', 'rivers'].includes(state)) {
          setShippingFee(deliveryPrices.outside.mid);
        } else if (['port harcourt', 'kaduna', 'enugu'].includes(state)) {
          setShippingFee(deliveryPrices.outside.far);
        } else {
          setShippingFee(deliveryPrices.outside.nearby);
        }
      } else {
        // For international deliveries
        setShippingFee(deliveryPrices.outside.far * 2); // Double the far price for international
      }
    };

    calculateShipping();
  }, [city, selectedCountry, selectedState]);

  // Update total amount display
  const totalAmount = useMemo(() => {
    return (totalPrice || 0) + shippingFee;
  }, [totalPrice, shippingFee]);

  // Handler for selecting a state (optional)
  const handleStateChange = (selectedOption: Option | null) => {
    setSelectedState(selectedOption);
  };

  useEffect(() => {
    if (isSignedIn && me) {
      setFirstName(me.firstname);
      setLastName(me.lastname);
      setEmail(me.email);
    }
  }, [isSignedIn, me]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    handleCartClick();

    const paystack = new PaystackInline();

    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: email,
      amount: totalAmount * 100, // Include shipping fee
      currency: 'NGN',
      metadata: {
        custom_fields: [
          {
            display_name: 'Full Name',
            variable_name: 'full_name',
            value: `${firstName} ${lastName}`,
          },
          {
            display_name: 'Phone Number',
            variable_name: 'phone',
            value: phone,
          },
          {
            display_name: 'Address',
            variable_name: 'address',
            value: address,
          },
          {
            display_name: 'City',
            variable_name: 'city',
            value: city,
          },
          {
            display_name: 'State',
            variable_name: 'state',
            value: selectedState?.label || '',
          },
          {
            display_name: 'Country',
            variable_name: 'country',
            value: selectedCountry?.label || '',
          },
        ],
      },
      onSuccess: async (response: any) => {
        const orderData = {
          _type: 'order',
          reference: response.reference,
          amount: totalAmount * 100,
          paymentDetails: {
            method: response.message,
            status: response.status,
          },
          customerDetails: {
            fullName: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            address: {
              street: address,
              city: city,
              state: selectedState?.label || '',
              country: selectedCountry?.label || '',
            },
          },
          cart: {
            items: cartDetails || [],
            total: totalPrice || 0,
          },
          createdAt: new Date().toISOString(),
        };

        try {
          await client.create(orderData);
          clearCart();
          onClose();
        } catch (error) {
          console.error('Error saving order to Sanity:', error);
        }
      },
      onCancel: () => {
        console.log('Payment Cancelled');
      },
    });

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl overflow-y-scroll h-screen bg-white p-6 rounded-lg shadow-lg">
        {/* Order Summary */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₦{(totalPrice || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>₦{shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Contact</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Delivery Section */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Delivery</label>
          <Select
            options={countries}
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="Select a country"
            required
          />

          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="text"
              value={firstName}
              placeholder="First name"
              className="p-2 border border-gray-300 rounded-md"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              value={lastName}
              placeholder="Last name"
              className="p-2 border border-gray-300 rounded-md"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
            required
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-3 gap-2 mt-2">
            <input
              type="text"
              required
              placeholder="City"
              className="p-2 border border-gray-300 rounded-md"
              onChange={(e) => setCity(e.target.value)}
            />
            <Select
              options={stateOptions}
              value={selectedState}
              onChange={handleStateChange}
              isDisabled={!selectedCountry}
              placeholder="Select a state"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              className="p-2 border border-gray-300 rounded-md"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Shipping Method */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Shipping method</label>
          <div className="p-2 border border-gray-300 rounded-md flex justify-between">
            <span>Shipping to {city || 'your location'}</span>
            <span className="font-semibold">₦{shippingFee.toLocaleString()}</span>
          </div>
          {selectedCountry?.value === 'NG' && (
            <p className="text-sm text-gray-600 mt-2">
              Delivery estimates:
              {shippingFee === deliveryPrices.lautech && " Same day (LAUTECH campus)"}
              {shippingFee === deliveryPrices.ogbomoso && " 1-3 hours (Ogbomoso)"}
              {shippingFee === deliveryPrices.outside.nearby && " 1-2 days (Nearby states)"}
              {shippingFee === deliveryPrices.outside.mid && " 2-3 days (Mid-distance states)"}
              {shippingFee === deliveryPrices.outside.far && " 3-5 days (Far states)"}
            </p>
          )}
        </div>

        {/* Payment Section */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Payment</label>
          <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
            <Image src={"/paystack.png"} width={200} height={70} alt='Paystack' />
            <p className="text-sm text-gray-600">
              After clicking "Pay now", you will be redirected to Paystack to complete your
              purchase securely.
            </p>
          </div>
        </div>

        {/* Pay Button */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
