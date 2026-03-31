import React, { useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Orders() {

  const { token, backendUrl, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const loadOrderData = async () => {
    try {
      if (!token) return;
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        setOrderData(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load orders');
    }
  }

  useEffect(() => {
    loadOrderData();
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>
      <div>
        {
          orderData.flatMap((order, index) =>
            order.items.map((item, itemIndex) => (

            <div key={`${order._id || index}-${itemIndex}`} className='py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start text-sm gap-6'>
                <img src={item.image?.[0]} className='w-16 sm:w-20' alt="" />
              
              
                
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-gray-700'>
                    <p className='text-lg'>{currency}{item.price}</p>
                    <p className=''>Quantity:{item.quantity}</p>
                    <p>Size:{item.size}</p>
                  </div>
                  <p className=''>Date: <span className='text-gray-400'>{new Date(order.date).toDateString()}</span></p>
                  <p className=''>Payment: <span className='text-gray-400'>{order.paymentMethod}</span></p>
                </div>
              </div>
                <div className='md:w-1/2 flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500 '></p>
                    <p className='text-sm md:text-base '>{order.status}</p>
                </div>
                <button className='border px-4 py-2 text-sm font-medium rounded-sm' onClick={loadOrderData}>Track Order</button>
              </div>
              </div>
          )))
        }
      </div>
    </div>
  )
}
