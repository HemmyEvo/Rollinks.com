'use client'
import { fullProduct } from '@/app/interface';
import { client, urlFor } from '@/lib/sanity';
import React from 'react'
import { useParams } from 'next/navigation';
import ImageGallery from '../../_components/ImageGallery';
import { CheckCircle, Star, Truck } from 'lucide-react';
import { useShoppingCart } from 'use-shopping-cart';
import { motion } from 'framer-motion';
import Loading from '@/components/ui/Loading';

// Fetch data from Sanity
async function getData(slug: any) {
  const query = `*[_type == "product" && slug.current == "${slug}"][0]{
    _id,
    name,
    "slug": slug.current,
    "images":image,
    description,
    price,
    "categoryName": category->name
  }`;
  const data = await client.fetch(query);
  return data;
}

export default function Page() {
    const params = useParams();
    const [number, setNumber] = React.useState(1)
    if(number > 100) setNumber(100)
    if(number < 1) setNumber(1)
    const [addMessage, SetAddMessage] = React.useState("Add to cart")
      const { addItem, incrementItem, setItemQuantity, cartDetails } = useShoppingCart();
    const HandleAddToCart =(item:any) =>{
        SetAddMessage("Added")
        const image = urlFor(item.images[0]).url()
      
        const product = {
            name: item.name,
            description: item.description,
            price:item.price,
            currency: "NGN",
            image: image,
            quantity: item.number,
            id: item._id
        }
           // If the product already exists in the cart, update its quantity.
    if (cartDetails && cartDetails[item._id]) {
        // Get the current quantity and add the new number.
        const currentQuantity = cartDetails[item._id].quantity;
        incrementItem(item._id, { count: number });
      } else {
        addItem(product);
        setItemQuantity(item._id,number)
      } 
  
        setTimeout(() => {
            SetAddMessage("Add to cart")
        }, 2000);
        
    }
    const [data, setData] = React.useState<fullProduct | null>(null);

    React.useEffect(() => {
        async function fetchData() {
            const productData = await getData(params.productId);
            setData(productData);
        }
        fetchData();
    }, [params.productId]);

    if (!data) {
        return <Loading />;
    }
      
    
    

    return (
        <div className='py-10 bg-[gre] min-h-[100vh]'>
            <div className="mx-auto max-w-screen-xl px-4 sm:px-8">
                <div className="grid sm:grid-cols-2 gap-8">
                {data && <ImageGallery images={data.images} />}
                <div className="md:py-8">
                    <div className="mb-2 md:mb-3">
                        <span className='mb-0.5 inline-block text-gray-500'>{data.categoryName}</span>
                        <h2 className='text-2xl font-bold text-gray-800 lg:text-3xl'>{data.name}</h2>
                    </div>
                    <div className="mb-6 flex items-center gap-3 md:mb-18">
                    <button className='bg-[#e09d22dc] flex rounded-full gap-2 px-2 py-1 '>
                        <span className='text-sm'>4.2</span>
                        <Star className='w-5 h-5' />
                    </button>
                    <span className='text-sm text-gray-500 transition duration-100'>56 Ratings</span>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-end gap-2">
                            <span className='text-xl font-bold text-gray-800 md:text-2xl'>#{data.price}</span>
                            <span className='mb-0.5 text-red-500 line-through '>#{data.price + 1000}</span>
                        </div>
                    </div>
                    <div className="mb-6 flex items-center gap-2 text-gray-500">
                        <Truck />
                        <span className='text-sm'>1-2 Day Shipping </span>
                    </div>
                    <div className="flex gap-2.5">
                    <div className="quality items-center justify-center flex w-24  bg-gray-200 drop-shadow-lg rounded-full shadow-inner shadow-white overflow-hidden">
                    <button className='text-xl outline-none px-2 bg-[#fcfcfca1] rounded-l-full shadow-inner shadow-white backdrop-blur-md bg-opacity-30' onClick={() => setNumber(prev => (--prev))}>-</button>
                    <input type="text" onChange={(e) => isNaN(Number(e.target.value)) ? setNumber(0) : setNumber(Number(e.target.value))} className='outline-none bg-[#ffc982] shadow-inner shadow-[#e0e0e0] text-center w-10 backdrop-blur-2xl bg-opacity-30' value={number} placeholder='1'  />
                    <button className='text-xl px-2 bg-[#fcfcfca1] rounded-r-full outline-none shadow-inner shadow-white' onClick={() => setNumber(prev => (++prev))}>+</button>
                   </div>
                    <button 
                    onClick={() => HandleAddToCart(data)} 
                    className='shadow-inner shadow-white bg-[goldenrod] outline-none overflow-hidden flex space-x-1 items-center text-white px-4 py-2 text-sm rounded-full drop-shadow-xl'
                    >
                    <p>{addMessage}</p>
                    {addMessage === "Added" && (
                    <motion.p transition={{ delay: 0.1, duration: 0.2 }} initial={{ x: -100 }} animate={{ x: 0 }}>
                    <CheckCircle className='w-4 text-[green] h-4'/>
                    </motion.p>
                    )}
                    </button>
                   
                    </div>
                    <div className="mt-10 text-base text-gray-500 tracking-wide">
                        {data.description}
                    </div>
                    
                </div>
                </div>
            </div>
        </div>
    );
}
