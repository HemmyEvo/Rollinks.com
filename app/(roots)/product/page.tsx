import dynamic from 'next/dynamic';

const ProductPage= dynamic(() => import('./ProductPage'));

export default function Page() {
  return (
    <div>
      <ProductPage/>
    </div>
  );
}