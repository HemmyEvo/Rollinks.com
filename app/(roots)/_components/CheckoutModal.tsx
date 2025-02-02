import { useShoppingCart } from 'use-shopping-cart';
import PaystackInline from '@paystack/inline-js';
import { useEffect, useState } from 'react';
import { client  } from '../../../lib/sanity'

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { totalPrice, clearCart, handleCartClick, cartDetails } = useShoppingCart();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    handleCartClick();

    const paystack = new PaystackInline();

    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: 'atilolaemmanuel@gmail.com',
      amount: totalPrice ? totalPrice * 100 : 0, 
      currency: 'NGN',
      onSuccess: async (response: any) => {
        
        const orderData = {
          _type: 'order',
          reference: response.reference, 
          amount: totalPrice ? totalPrice * 100 : 0, 
          paymentDetails: {
            method: response.message,
            status: response.status,
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
          // Optionally, you might want to show an error message to the user here.
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Confirm Checkout</h2>
        <p>Total: ₦{totalPrice?.toLocaleString()}</p>
        
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
