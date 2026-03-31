import React from 'react'
import {assets} from '../assets/assets'
const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between border-b'>
  <img src={assets.logo} className='w-[max(10%,80px)]' alt="" />
  <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 rounded-full text-sm'>
    Logout
  </button>
</div>
  )
}

export default Navbar
