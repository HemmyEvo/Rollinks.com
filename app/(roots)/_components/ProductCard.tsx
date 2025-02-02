import { CheckCircle, CheckCircle2, Eye, Heart } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
type Props = {
    id: any,
    title: string,
    price: number,
    rating:number,
    image:string,
    discount:number
}

const ProductCard = ({id, title,price,rating, image, discount }: Props) => {
    const [addMessage, SetAddMessage] = React.useState("Add to cart")
    const HandleAddToCart =(item:any) =>{
        SetAddMessage("Added")
        setTimeout(() => {
            SetAddMessage("Add to cart")
        }, 2000);
        
    }
    const [number, setNumber] = React.useState(1)
    if(number > 100) setNumber(100)
    if(number < 1) setNumber(1)
  return (
    <div className="min-h-[300px] my-3  flex justify-center  overflow-hidden rounded-xl w-full relative ">
        <div className="wrapper drop-shadow-xl pb-4  bg-[#fd9e4554] rounded-xl overflow-hidden   h-full max-w-[212px] ">
        <div className="image-cont group cursor-pointer h-[220px] w-[212px] relative">
            <Image 
            alt='hero 1'
            quality={100}
            fill
            className='cursor-pointer'
            objectFit='cover'
            objectPosition='center' 
            src={image}/>
            <div className="absolute top-0 bottom-0 right-0 left-0 [@media(hover:hover)]:bg-[#0000007a]  bg-transparent [@media(hover:hover)]:opacity-0 opacity-100  group-hover:opacity-100 transition-opacity">
                <div className="w-full relative h-full">
                    <div className="heart-preview drop-shadow-4xl flex flex-col absolute right-2 space-y-4 top-4">
                        <Heart className='text-white cursor-pointer'/>
                        <Eye className='text-white cursor-pointer'/>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-cont space-y-3  pt-8">
            <p className='capitalize font-semibold text-sm text-center'>{title}</p>
            <p className='space-x-2 pb-3 text-center text-sm'><span className='text-[#414141]'>#{discount.toFixed(2)}</span> <span className=' italic text-[red] line-through'>#{price.toFixed(2)}</span></p>

            <div className="quality-add  items-center space-x-3  flex justify-center">
                <div className="quality items-center justify-center flex w-24  bg-[goldenrod] drop-shadow-lg rounded-full shadow-inner shadow-white overflow-hidden">
                    <button className='text-xl outline-none px-2 bg-[#fcfcfca1] rounded-l-full shadow-inner shadow-white backdrop-blur-md bg-opacity-30' onClick={() => setNumber(prev => (--prev))}>-</button>
                    <input type="text" onChange={(e) => isNaN(Number(e.target.value)) ? setNumber(0) : setNumber(Number(e.target.value))} className='outline-none bg-[#ffc982] shadow-inner shadow-[gold] text-center w-10 backdrop-blur-2xl bg-opacity-30' value={number} placeholder='1'  />
                    <button className='text-xl px-2 bg-[#fcfcfca1] rounded-r-full outline-none shadow-inner shadow-white' onClick={() => setNumber(prev => (++prev))}>+</button>
               
                </div>
                <div className="add-to-cart  flex items-center justify-center">
                        <button onClick={HandleAddToCart} className=' shadow-inner shadow-white bg-[goldenrod] outline-none overflow-hidden flex space-x-1 items-center text-white px-4 py-2 text-sm rounded-full drop-shadow-xl '>
                            <p>{addMessage}</p>
                            {addMessage === "Added" && (
                                <motion.p transition={{delay:0.1, duration:.2}} initial={{x:-100}} animate={{x: 0}} ><CheckCircle className='w-4 text-[green] h-4'/></motion.p>
                            )}
                        </button>
                </div>
            </div>


        </div>
        </div>
          
     </div>
  )
}

export default ProductCard