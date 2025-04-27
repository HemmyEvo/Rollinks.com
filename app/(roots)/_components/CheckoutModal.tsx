import { useShoppingCart } from 'use-shopping-cart';
import PaystackInline from '@paystack/inline-js';
import { useState, useMemo, useEffect, useRef } from 'react';
import { client } from '../../../lib/sanity';
import Select from 'react-select';
import data from '../../api/countries+states.json';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from 'next/navigation';
import { FiX, FiCheck, FiLoader, FiMapPin, FiUser, FiMail, FiPhone, FiHome } from 'react-icons/fi';

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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    deliveryInstructions: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailWarning, setEmailWarning] = useState(false);

  // Location state
  const [selectedCountry, setSelectedCountry] = useState<Option | null>(null);
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [customCity, setCustomCity] = useState('');
  const [shippingFee, setShippingFee] = useState(0);

  const { userId } = useAuth();
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

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
      setEmailWarning(true);
    }
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Valid phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!selectedCountry) newErrors.country = 'Country is required';
    if (!selectedState) newErrors.state = 'State is required';
    if (!selectedLocation) newErrors.location = 'Delivery location is required';
    if (selectedLocation?.value === 'custom' && !customCity) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // When country changes, update states list
  const handleCountryChange = (selectedOption: Option | null) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedLocation(null);
    setShippingFee(0);
    setErrors(prev => ({ ...prev, country: '', state: '' }));

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
    setErrors(prev => ({ ...prev, state: '', location: '' }));
  };

  const handleLocationChange = (selectedOption: Option | null) => {
    setSelectedLocation(selectedOption);
    setCustomCity('');
    setErrors(prev => ({ ...prev, location: '', city: '' }));

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'email') setEmailWarning(false);
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // Temporarily hide our modal while Paystack is open
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }

    const paystack = new PaystackInline();
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: formData.email,
      amount: totalAmount * 100,
      currency: 'NGN',
      metadata: {
        custom_fields: [
          {
            display_name: 'Full Name',
            variable_name: 'full_name',
            value: `${formData.firstName} ${formData.lastName}`,
          },
          {
            display_name: 'Phone Number',
            variable_name: 'phone',
            value: formData.phone,
          },
          {
            display_name: 'Address',
            variable_name: 'address',
            value: formData.address,
          },
          {
            display_name: 'Postal Code',
            variable_name: 'postal_code',
            value: formData.postalCode,
          },
          {
            display_name: 'City',
            variable_name: 'city',
            value: selectedLocation?.value === 'custom' ? customCity : selectedLocation?.label || '',
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
        try {
          // Prepare order items for Sanity
          const orderItems = cartDetails ? Object.values(cartDetails).map(item => ({
            product: {
              _type: 'reference',
              _ref: item.product_id
            },
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            currency: item.currency,
            image: item.image
          })) : [];

          // Create order document for Sanity
          const orderDoc = {
            _type: 'order',
            orderId: `ORD-${Date.now()}`,
            status: 'processing',
            customer: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              userId: userId || null
            },
            shippingAddress: {
              street: formData.address,
              city: selectedLocation?.value === 'custom' ? customCity : selectedLocation?.label || '',
              state: selectedState?.label || '',
              country: selectedCountry?.label || '',
              postalCode: formData.postalCode,
              specialInstructions: formData.deliveryInstructions
            },
            items: orderItems,
            payment: {
              method: 'paystack',
              status: 'completed',
              transactionId: response.reference,
              amount: totalAmount,
              currency: 'NGN'
            },
            shipping: {
              method: 'standard',
              cost: shippingFee,
              carrier: 'Local Delivery'
            },
            subtotal: totalPrice || 0,
            total: totalAmount,
            discount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Save to Sanity
          const createdOrder = await client.create(orderDoc);
          setOrderId(createdOrder.orderId);
          setPaymentSuccess(true);
          clearCart();
        } catch (error) {
          console.error('Error saving order:', error);
          alert('Order was successful but there was an issue saving your details. Please contact support with your payment reference.');
        } finally {
          setLoading(false);
          // Show our modal again
          if (modalRef.current) {
            modalRef.current.style.display = 'block';
          }
          router.push('/history');
        }
      },
      onCancel: () => {
        setLoading(false);
        // Show our modal again if payment is cancelled
        if (modalRef.current) {
          modalRef.current.style.display = 'block';
        }
      },
    });
  };

  if (!isOpen) return null;

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FiCheck className="text-green-600 text-3xl" />
                </div>
              </div>
              <p className="text-center text-gray-700 mb-4">
                Your order #{orderId} has been placed successfully. A confirmation has been sent to {formData.email}.
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₦{(totalPrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">₦{shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                router.push(`/order-tracking/${orderId}`);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Track Your Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2" /> Customer Information
              </h3>
              
              {/* ... rest of your form fields ... */}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              {/* ... rest of your order summary ... */}
              
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;