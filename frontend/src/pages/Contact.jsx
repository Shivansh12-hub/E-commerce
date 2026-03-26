import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

export default function Contact() {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} className='w-full md:max-w-[480px]' alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p>Our Store</p>
          <p className='text-gray-500'>976546 jfaks / behind hehe<br/> asfdfe</p>
          <p className='text-gray-500'>Tel :(045) 5005-545 <br />Email:gasd@gamil.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>Learn more about our teams and job qoenings.<br /> asfdfe</p>
          
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transistion-all duration-500'>Explore Jobs</button>
        </div>
      </div>

    </div>
  )
}
