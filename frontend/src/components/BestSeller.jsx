import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

export default function BestSeller() {

    const { products } = useContext(ShopContext); // ✅ fixed
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 5));
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"BEST"} text2={"SELLER"} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-400'>
                    Lorem consectet ur unde dolores...
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-y-6'>
                {bestSeller.map((item) => (
                    <ProductItem 
                        key={item._id}   // ✅ fixed
                        id={item._id}
                        name={item.name}
                        image={item.image}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    )
}