import { CheckCircle, Eye, Heart } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useShoppingCart } from 'use-shopping-cart'

type Props = {
  id: string,
  title: string,
  price: number,
  description: string,
  image: string,
  discount: number,
  slug: string
}

const ProductCard = ({ id, title, price, description, slug, image, discount }: Props) => {
  const [number, setNumber] = React.useState(1)
  const [addMessage, setAddMessage] = React.useState("Add to cart")
  const { addItem, incrementItem, setItemQuantity, cartDetails } = useShoppingCart();

  const HandleAddToCart = () => {

    setAddMessage("Added");

    const product = {
      id: id,
      name: title,
      description: description,
      price: price,
      currency: "NGN",
      image: image,
     
    };

    // If the product already exists in the cart, update its quantity.
    if (cartDetails && cartDetails[id]) {
      // Get the current quantity and add the new number.
      const currentQuantity = cartDetails[id].quantity;
      incrementItem(id, { count: number });
    } else {
      addItem(product);
      setItemQuantity(id,number)
    }

    setTimeout(() => {
      setAddMessage("Add to cart");
    }, 2000);
  };

  // Ensure the number stays between 1 and 100.
  if (number > 100) setNumber(100);
  if (number < 1) setNumber(1);

  return (
    <div className="min-h-[300px]  my-3 flex justify-center overflow-hidden rounded-xl w-full relative">
      <div className="wrapper drop-shadow-xl pb-4 bg-[#fd9e4554] rounded-xl overflow-hidden h-full max-w-[212px]">
        <div className="image-cont group cursor-pointer h-[220px] w-[212px] relative">
          <Image 
            alt='hero 1'
            fill
            priority
            className='cursor-pointer object-cover object-center'
            src={image}
          />
          <div className="absolute top-0 bottom-0 right-0 left-0 [@media(hover:hover)]:bg-[#0000007a] bg-[#0000007a]/20 [@media(hover:hover)]:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity">
            <div className="w-full relative h-full">
              <div className="heart-preview drop-shadow-4xl flex flex-col absolute right-2 space-y-4 top-4">
                
                <Link href={`/product/${slug}`}><Eye className='text-white cursor-pointer'/></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="text-cont space-y-3 pt-8">
          <p className='capitalize font-semibold text-sm text-center'>{title}</p>
          <p className='space-x-2 pb-3 text-center text-sm'>
            <span className='text-[#414141]'>#{price && price.toFixed(2)}</span> 
            <span className='italic text-[red] line-through'>#{discount && discount.toFixed(2)}</span>
          </p>

          <div className="quality-add items-center space-x-3 flex justify-center">
            <div className="quality items-center justify-center flex w-24 bg-[goldenrod] drop-shadow-lg rounded-full shadow-inner shadow-white overflow-hidden">
              <button 
                className='text-xl outline-none px-2 bg-[#fcfcfca1] rounded-l-full shadow-inner shadow-white backdrop-blur-md bg-opacity-30' 
                onClick={() => setNumber(prev => prev - 1)}
              >
                -
              </button>
              <input 
                type="text" 
                onChange={(e) => {
                  const value = Number(e.target.value);
                  isNaN(value) ? setNumber(1) : setNumber(value);
                }} 
                className='outline-none bg-[#ffc982] shadow-inner shadow-[gold] text-center w-10 backdrop-blur-2xl bg-opacity-30' 
                value={number} 
                placeholder='1'  
              />
              <button 
                className='text-xl px-2 bg-[#fcfcfca1] rounded-r-full outline-none shadow-inner shadow-white' 
                onClick={() => setNumber(prev => prev + 1)}
              >
                +
              </button>
            </div>
            <div className="add-to-cart flex items-center justify-center">
              <button 
                onClick={HandleAddToCart} 
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
          </div>
        </div>
      </div>      
    </div>
  )
}

export default ProductCard;
