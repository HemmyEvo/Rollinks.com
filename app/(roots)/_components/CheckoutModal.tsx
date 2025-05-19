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
import { FiX, FiCheck, FiLoader, FiMapPin, FiUser, FiMail, FiPhone, FiHome,FiInfo } from 'react-icons/fi';
import Loading from "@/components/ui/Loading";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Option {
  value: string;
  label: string;
}

interface DeliveryOption {
  value: string;
  name: string;
  price: number;
  description?: string;
  customCityTriggers?: string[];
}

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { totalPrice, clearCart,handleCartClick, cartDetails } = useShoppingCart();
  const [loading, setLoading] = useState(false);
const [paymentDone, setPaymentDone] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
const [showModal, setShowModal] = useState(false);
const { userId } = useAuth();
const { isAuthenticated } = useConvexAuth();
const me = useQuery(api.user.getMe, isAuthenticated ? undefined : "skip");
  // Form state
  const [formData, setFormData] = useState({
  firstName: me?.firstname ?? '',
  lastName: me?.lastname ?? '',
  email: me?.email ?? '',
  phone: '',
  address: '',
  postalCode: '',
  deliveryInstructions: ''
});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailWarning, setEmailWarning] = useState(false);

  // Location state
  const [selectedCountry, setSelectedCountry] = useState<any| null>(null);
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [customCity, setCustomCity] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
const [showBankDetails, setShowBankDetails] = useState(false);
const [paymentSent, setPaymentSent] = useState(false);
  
useEffect(() => {
    async function fetchDeliveryOptions() {
      try {
        const data = await client.fetch(`
          *[_type == "deliveryOption"] {
            name,
            value,
            price,
            description,
            customCityTriggers
          }
        `)
        setDeliveryOptions(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDeliveryOptions()
  }, [])


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

  
  // Convert delivery options to select options
  const locationOptions: SelectOption[] = deliveryOptions.map((option: DeliveryOption) => ({
  value: option.value,
  label: `${option.name}`,
  description: option.description
}));

// Add custom option
locationOptions.push({ 
  value: 'custom', 
  label: 'Other Locations', 
  description: '' 
});

const handleLocationChange = (selectedOption: SelectOption | null) => {
  setSelectedLocation(selectedOption);
  setCustomCity('');
  setErrors(prev => ({ ...prev, location: '', city: '' }));

  if (!selectedOption) return;

  if (selectedOption.value === 'custom') {
    setShippingFee(0);
  } else {
    const option = deliveryOptions.find((opt: DeliveryOption) => opt.value === selectedOption.value);
     setShippingFee(option?.price || 0);
  }
};

// Detect location from custom city input
useEffect(() => {
  if (selectedLocation?.value !== 'custom' || !customCity.trim() || !deliveryOptions.length) return;

  const city = customCity.toLowerCase();
  const matchedOption = deliveryOptions.find((option: DeliveryOption) => 
    option.customCityTriggers?.some((trigger: string) => 
      city.includes(trigger.toLowerCase())
    )
  );

  setShippingFee(matchedOption?.price || 0);
}, [customCity, selectedLocation, deliveryOptions]);
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



const handlePaymentMethodSelect = (method:any) => {
  setSelectedPaymentMethod(method);
  if (method === 'bank-transfer') {
    setShowBankDetails(true);
  } else {
    setShowPaymentMethodModal(false);
    handlePaystackPayment();
  }
};

const handlePaymentInitiation = () => {
  if (!validateForm()) {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
    return;
  }
  setShowPaymentMethodModal(true);
};

const handleBankTransferConfirmation = async () => {
  setPaymentSent(true);
  setLoading(true);
  
  // Prepare order items for WhatsApp message
  const orderItems = cartDetails 
    ? Object.values(cartDetails).map(item => (
        `${item.name} (${item.quantity} x ${item.price}${item.currency})`
      )).join('\n')
    : '';

  const customerInfo = `
    *New Bank Transfer Order*
    Customer: ${formData.firstName} ${formData.lastName}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Address: ${formData.address}, ${selectedLocation?.label || ''}, ${selectedState?.label || ''}, ${selectedCountry?.label || ''}
    Postal Code: ${formData.postalCode}
    
    *Order Items:*
    ${orderItems}
    
    *Total Amount:* ${totalAmount} NGN
    Delivery Instructions: ${formData.deliveryInstructions || 'None'}
  `;

  // Encode message for WhatsApp URL
  const whatsappMessage = encodeURIComponent(customerInfo);
  const whatsappUrl = `https://wa.me/2347053142223?text=${whatsappMessage}`;
  
  
  // Create order document in Sanity (similar to Paystack version but with payment method as bank transfer)
  const orderItem = cartDetails 
  ? Object.values(cartDetails).map((item) => ({
      _key: item.id,
      product: {
        _type: 'reference',
        _ref: item.id,
      },
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      currency: item.currency,
      image: item.image,
    }))
  : [];

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
            items: orderItem,
            payment: {
              method: 'Bank Transfer',
              status: 'pending',
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

  // Save to Sanity (implement your Sanity client code here)
  try {
    await client.create(orderDoc);
    setPaymentDone(true)
    
    // Handle success
  } catch (error) {
    console.error('Error creating order:', error);
    // Handle error
  }

  setLoading(false)
handleCartClick(); // Close cart after submission
clearCart();
};


  const handlePaystackPayment = async () => {
      
  
    handleCartClick()
    setLoading(true);
    
    // Temporarily hide our modal while Paystack is open.
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
   const orderItems = cartDetails 
  ? Object.values(cartDetails).map((item) => ({
      _key: item.id,
      product: {
        _type: 'reference',
        _ref: item.id,
      },
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      currency: item.currency,
      image: item.image,
    }))
  : [];

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
         
          
        } catch (error) {
          console.error('Error saving order:', error);
          alert(error)
          alert('Order was successful but there was an issue saving your details. Please contact support with your payment reference.');
        } finally {
          clearCart();
          setLoading(false);
          // Show our modal again
          if (modalRef.current) {
            modalRef.current.style.display = 'block';
          }
        
        }
      },
      onCancel: () => {
        setLoading(false);
        setPaymentDone(true)
        // Show our modal again if payment is cancelled
        if (modalRef.current) {
          modalRef.current.style.display = 'block';
        }
      },
    });
  };
const items = cartDetails
  ? Object.values(cartDetails).map(
      (item) => `${item.name} (Qty: ${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`
    )
  : [];

  if (!isOpen) return null;

  
  return (
<>
{true && (
 <div className="absolute left-0 right-0 bottom-0 top-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
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
                router.push(`/history`);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Track Your Order
            </button>
          </div>
        </div>
      </div>
    
)}
    <div  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                {emailWarning && !errors.email && (
                  <p className="mt-1 text-sm text-yellow-600">
                    A valid email is required for order tracking and updates
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center mt-6">
                <FiMapPin className="mr-2" /> Shipping Information
              </h3>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <Select
                  options={countries}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                  className={`${errors.country ? 'border-red-500 rounded-md' : ''}`}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.country ? '#ef4444' : '#d1d5db',
                      minHeight: '42px',
                      '&:hover': {
                        borderColor: errors.country ? '#ef4444' : '#9ca3af'
                      }
                    })
                  }}
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <Select
                  options={stateOptions}
                  value={selectedState}
                  onChange={handleStateChange}
                  placeholder="Select State"
                  isDisabled={!selectedCountry}
                  className={`${errors.state ? 'border-red-500 rounded-md' : ''}`}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.state ? '#ef4444' : '#d1d5db',
                      minHeight: '42px',
                      '&:hover': {
                        borderColor: errors.state ? '#ef4444' : '#9ca3af'
                      }
                    })
                  }}
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>
              
            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Location *</label>
  <select
    value={selectedLocation?.value || ''}
    onChange={(e) => handleLocationChange(
      locationOptions.find(opt => opt.value === e.target.value) || null
    )}
    className={`w-full p-2 border rounded-md ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
  >
    <option value="">Select a location</option>
    {deliveryOptions.map(option => (
      <option key={option.value} value={option.value}>
        {option.name} - {option.price === 0 ?'free': '₦'+ option.price}
      </option>
    ))}
    <option value="custom">Other Location</option>
  </select>
  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
</div>

{selectedLocation?.value === 'custom' && (
  <div className="mb-4">
    <div className="w-full flex justify-between">
      <label htmlFor="customCity" className="block text-sm font-medium text-gray-700 w-full flex justify-between mb-1">
        Preferred Location*
        <button
          type="button"
          className="ml-1 text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={() => setShowModal(!showModal)}
          aria-label="Location information"
        >
          <FiInfo className="h-4 w-4 inline" />
        </button>
      </label>

      {/* Modal/Popover */}
      {showModal && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-gray-700">
          <p>
            If your delivery location isn't listed, please use the "Request Quote" option. 
            This will connect you with our sales team via WhatsApp to complete your order.
          </p>
          <button
            type="button"
            className="mt-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
    <input
      type="text"
      id="customCity"
      value={customCity}
      onChange={(e) => setCustomCity(e.target.value)}
      className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
      placeholder="Enter your city"
    />
    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
  </div>
)}
              
              <div className="mb-4">
                <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instructions
                </label>
                <textarea
                  id="deliveryInstructions"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Any special instructions for delivery?"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartDetails && Object.values(cartDetails).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative w-16 h-16 mr-4">
                        <Image
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₦{(totalPrice || 0).toLocaleString()}</span>
                </div>
               <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <span className="text-gray-600 font-medium">Shipping</span>
      
      {shippingFee > 0 ? (
        <span className="text-gray-900 font-medium">
          ₦{shippingFee.toLocaleString()}
        </span>
      ) : selectedLocation ? (
        <div className="group relative inline-flex items-center gap-1">
          <div className="flex items-center text-gray-500 border-b border-dashed border-gray-300 pb-0.5">
            <FiInfo className="h-4 w-4 mr-1" />
            <span>Shipping Quote Required</span>
          </div>
          
       
        </div>
      ) : (
    <span className="text-gray-400">
  {(() => {
    const deliveryOption = deliveryOptions?.find(opt => opt.value === selectedLocation?.value);
    const price = deliveryOption?.price;
    
    if (price === 0) return 'Free';
    if (price !== undefined) return `₦${price.toLocaleString()}`;
    return '--';
  })()}
</span>

)}
    </div>
                <div className="flex justify-between py-2 font-medium text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {shippingFee > 0 ? `₦${totalAmount.toLocaleString()}` : '--'}
                  </span>
                </div>
              </div>
              
             
                {loading ? (
                <button
                onClick={handlePaymentInitiation}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                  <span className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2" />
                    Processing...
                  </span>
  </button>
                ) : customCity && shippingFee <= 0 ? (
<a
  href={`https://wa.me/+2347053142223?text=${encodeURIComponent(
          `Shipping Inquiry\n\nItems:\n${items.join('\n')}\n\nDelivery Area: ${customCity}\n\nUserId: ${userId}\n\nFirst Name: ${formData.firstName}\n\nLast Name: ${formData.lastName}\n\nEmail: ${formData.email}\n\nStreet: ${formData.address}`
        )}`
    
  }
  target="_blank"
  rel="noopener noreferrer"
  className={`w-full py-3 text-center px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
  }`}
  onClick={(e) => {
    if (!validateForm()) {
      e.preventDefault();
    }
    else{
     return undefined 
}
  }}
>
  Request Quote
</a>
) :(
 <button
                onClick={handlePaymentInitiation}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                  Proceed to Payment
  </button>

)}

{showPaymentMethodModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
      
      {!showBankDetails ? (
        <>
         <div className="space-y-4">
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    <h3 className="font-semibold text-lg mb-2 text-gray-800">Pay with Paystack</h3>
    <p className="text-gray-600 mb-3">Secure online payment with credit/debit card or bank account</p>
    <ul className="text-sm text-gray-500 space-y-1 mb-4">
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <span>Processing time: 3-4 business days for order delivery</span>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <span>Instant payment confirmation</span>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <span>Supports all major cards and mobile money</span>
      </li>
    </ul>
    <button
      onClick={() => handlePaymentMethodSelect('paystack')}
      className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
    >
      Proceed with Paystack
    </button>
  </div>

  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    <h3 className="font-semibold text-lg mb-2 text-gray-800">Direct Bank Transfer</h3>
    <p className="text-gray-600 mb-3">Transfer funds directly from your bank account</p>
    <ul className="text-sm text-gray-500 space-y-1 mb-4">
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <span>Fastest option: Delivery within 1 business day after payment</span>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <span>Bank details will be provided after selection</span>
      </li>
      <li className="flex items-start">
        <span className="mr-2">•</span>
        <span>Click on "I've sent the Payment" button after Payment is made</span>
      </li>
    </ul>
    <button
      onClick={() => handlePaymentMethodSelect('bank-transfer')}
      className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
    >
      Proceed with Bank Transfer
    </button>
  </div>

  <button
    onClick={() => setShowPaymentMethodModal(false)}
    className="mt-2 w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 border border-gray-300 font-medium"
  >
    Cancel and Return
  </button>
</div>
        </>
      ) : (
        <div>
          <h3 className="font-bold mb-2">Bank Transfer Details</h3>
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p><strong>Bank Name:</strong> OPay</p>
            <p><strong>Account Number:</strong> 7053142223</p>
            <p><strong>Account Name:</strong> Sukurat Opeyemi Muniru</p>
            <p><strong>Amount:</strong> {totalAmount} NGN</p>
          </div>
          
          <p className="mb-4">Please transfer the exact amount to the account above, then click "I've Sent" to notify us.</p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleBankTransferConfirmation}
              disabled={paymentSent}
              className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                paymentSent ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {paymentSent ? 'Notification Sent' : "I've Sent the Payment"}
            </button>
            <button
              onClick={() => {
                setShowBankDetails(false);
                setShowPaymentMethodModal(false);
              }}
              className="flex-1 py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
        </div>
   </div>
)}

          </div>
 </div>
                )}
            
            </div>
          </div>
        </div>
      </div>
    </div>
</>
  );
};

export default CheckoutModal;
