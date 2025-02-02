import { useState } from 'react';
import CheckoutModal from './CheckoutModal';
import { Button } from '@/components/ui/button';

const CheckoutButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
    
      <Button onClick={() => setModalOpen(true)} className="w-full bg-[#e09d22dc]">Checkout</Button>

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};

export default CheckoutButton;
