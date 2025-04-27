import dynamic from 'next/dynamic';

const ProductPage= dynamic(() => import('./ProductPage'), {
  ssr: false,  // Disable server-side rendering for this component
});

export default function Page() {
  return (
    <div>
      <ProductPage/>
    </div>
  );
}