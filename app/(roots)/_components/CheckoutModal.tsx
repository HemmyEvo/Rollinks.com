import { useShoppingCart } from 'use-shopping-cart';
import PaystackInline from '@paystack/inline-js';
import { useState, useMemo } from 'react';
import { client } from '../../../lib/sanity';
import Select from 'react-select';
import data from '../../api/countries+states.json';
import Image from 'next/image';

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

  // Handler for selecting a state (optional)
  const handleStateChange = (selectedOption: Option | null) => {
    setSelectedState(selectedOption);
  };

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    handleCartClick();

    const paystack = new PaystackInline();

    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: email,
      amount: totalPrice ? totalPrice * 100 : 0,
      currency: 'NGN',
      metadata: {
        full_name: `${firstName} ${lastName}`,
        phone: phone,
        address: {
          street: address,
          city: city,
          state: selectedState?.label || '',
          country: selectedCountry?.label || '',
        },
      },
      onSuccess: async (response: any) => {
        const orderData = {
          _type: 'order',
          reference: response.reference,
          amount: totalPrice ? totalPrice * 100 : 0,
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
        <div className="flex justify-between mt-6 text-lg font-semibold mb-4">
          <span>Total Amount</span>
          <span className="text-black">
            ₦{totalPrice ? totalPrice.toLocaleString() : '0'}
          </span>
        </div>

        {/* Contact Section */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Contact</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Delivery Section */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Delivery</label>
          <div className="flex items-center space-x-4 mb-2">
            <p>The only delivery method available is shipping</p>
          </div>

          <Select
            options={countries}
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="Select a country"
          />

          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <input
            type="text"
            placeholder="Company (optional)"
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />

          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            />
            <Select
              options={stateOptions}
              value={selectedState}
              onChange={handleStateChange}
              isDisabled={!selectedCountry}
              placeholder="Select a state"
            />
          </div>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
        </div>

        {/* Shipping Method */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Shipping method</label>
          <div className="p-2 border border-gray-300 rounded-md flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold">₦4,000.00</span>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Payment</label>
          <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
            <Image src={"/paystack.png"} width={200} height={70} alt="Paystack" />
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
