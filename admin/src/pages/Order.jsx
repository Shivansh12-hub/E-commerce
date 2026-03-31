import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App.jsx'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets.js'

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch orders');
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const statusHandler = async(e, orderId)=>{
    try {
      const response = await axios.post(backendUrl + "/api/order/status", { orderId, status: e.target.value }, { headers: { Authorization: `Bearer ${token}` } })
      if (response.data.success) {
        await fetchAllOrders()
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch orders');
    }
  }


  return (
    <div className='w-full'>
      <h3 className='text-lg font-medium mb-5 text-gray-700'>Order Page</h3>

      <div className='space-y-4'>
        {orders.map((order, index) => (
          <div
            key={index}
            className='grid grid-cols-1 lg:grid-cols-[48px_2.5fr_1.2fr_0.7fr_1fr] gap-4 items-start border border-gray-200 bg-white px-4 py-5 md:px-6 md:py-6 text-xs sm:text-sm text-gray-700'
          >
            <img className='w-9 mt-1 opacity-80' src={assets.parcel_icon} alt='Parcel icon' />

            <div className='space-y-1.5'>
              {(Array.isArray(order.items) ? order.items : []).map((item, itemIndex) => (
                <p key={itemIndex} className='leading-5'>
                  {item.name} x {item.quantity} {item.size ? <span>{item.size}</span> : null}
                </p>
              ))}

              <p className='font-medium text-gray-800 pt-1'>
                {order.address?.firstName} {order.address?.lastName}
              </p>

              <div className='text-gray-600'>
                <p>{order.address?.street}</p>
                <p>
                  {order.address?.city}, {order.address?.state}, {order.address?.country}, {order.address?.zipcode}
                </p>
                <p>{order.address?.phone}</p>
              </div>
            </div>

            <div className='text-gray-700 leading-6'>
              <p>Items : {order.items?.length || 0}</p>
              <p className='mt-3'>Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className='text-base font-medium text-gray-800'>{currency}{order.amount}</p>

            <div className='w-full lg:max-w-[170px] lg:justify-self-end'>
              <select onChange={(e)=>statusHandler(e,order._id)} value={order.status || 'Order Placed'} className='w-full bg-gray-50 border border-gray-300 text-gray-700 rounded px-2 py-1'>
                <option value='Order Placed'>Order Placed</option>
                <option value='Packing'>Packing</option>
                <option value='Shipped'>Shipped</option>
                <option value='Out for Delivery'>Out for Delivery</option>
                <option value='Delivered'>Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order
