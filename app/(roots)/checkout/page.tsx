import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className=' text-black bg font-[arial] max-w-6xl max-[1000px]:max-w-lg px-8 ml-auto mr-auto mt-36 mb-24 max-[1000px]:justify-center'>
    <div className="page-tile font-bold text-2xl font-[arial] mb-5 ">Review your order</div>
    <div className="checkout-grid grid gap-x-3 items-start grid-cols-[1fr_350px] max-[1000px]:grid-cols-1">

      

      <div className="order-summary  max-[1000px]:order-2">
        
        <div className="cart-items-container mb-3 p-5 rounded border">
        <div className="delivery-date text-[#007600] font-bold text-[19px] mt-1 mb-5">Delivery Date: Tuesday, June 21</div>

          <div className="cart-container-grid ">


            <img src="../Asset/products/blackout-curtain-set-beige.webp" className=" max-h-36 w-full mx-auto bg-clip-content "/>

            <div className="cart-item-details">
          <div className="product-name font-bold mb-2">Black and Gray Athletic Cotton Socks - 6 Pairs</div>


          <div className="product-price font-bold text-[#b12704] mb-1">
          $10.90
          </div>


        <div className="product-quantity">
        <span>Quantity: <span className='quantity-label'>4</span></span>

        <span className=' ml-2 cursor-pointer text-[#017cb6]'>Update</span>
        <span className=' ml-2 cursor-pointer text-[#017cb6]'>Delete</span>
        </div>



            </div>



          </div>


        </div>

      </div>




      <div className="payment-summary max-[1000px]:order-1 mb-3 p-5 pb-1 rounded border">
        <div className="payment-title font-bold mb-3 text-[18px]">Order Summary</div>

        <div className="summary-row flex w-full justify-between mb-2">
          <div className="item-quantiy">Items (3):</div>
          <div className="summary-money">$43.20</div>
        </div>

        <div className="summary-row flex w-full justify-between mb-2 ">
          <div className="item-quantiy">Shipping & handling:</div>
          <div className="summary-money">$4.99</div>
        </div>

        <div className="summary-row flex w-full justify-between items-end mb-2">
          <div className="item-quantiy">Total before tax:</div>
          <div className="summary-money border-t pt-2">$47.74</div>
        </div>

        <div className="summary-row flex w-full justify-between items-end mb-2">
          <div className="item-quantiy">Estimated tax (10%):</div>
          <div className="summary-money ">$4.77</div>
        </div>



        <div className="summary-row font-bold text-[18px] border-t text-[#b12704] flex w-full justify-between items-end pt-5 mb-2">
          <div className="item-quantiy">Order total:</div>
          <div className="summary-money ">$52.51</div>
        </div>


      <button className='w-full mt-3 mb-4 bg-[#ffd814] rounded-lg py-3 shadow-lg hover:bg-[#f7ca00]'>Place your Order</button>
      
      </div>
    </div>
</div>
  )
}

export default page