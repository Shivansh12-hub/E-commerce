
// placing order using cod

import orderModel from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
// import Stripe from "stripe";
// import razorpay from 'razorpay'

// global variables
const currency = 'inr';
const deliveryCharges = 10;

// Lazy-load Stripe and Razorpay only when needed
// let stripe;
// let razorpayInstance;

// const getStripe = () => {
//     if (!stripe && process.env.STRIPE_SECRET_KEY) {
//         stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//     }
//     return stripe;
// };

// const getRazorpay = () => {
//     if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
//         razorpayInstance = new razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_KEY_SECRET,
//         });
//     }
//     return razorpayInstance;
// };



export const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId, 
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date:Date.now()
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

       

        res.json({success:true,message:"Successfully placed the order"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({success:true})
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// placing order using stripe


// export const placeOrderStripe = async (req, res) => {
//     try {
//         const { userId, items, amount, address } = req.body;
//         const { origin } = req.headers;
//         const orderData = {
//             userId, 
//             items,
//             amount,
//             address,
//             paymentMethod: "Stripe",
//             payment: false,
//             date:Date.now()
//         }

//         const newOrder = new orderModel(orderData);
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(userId, { cartData: {} });

//         const line_items = items.map((item) => ({
//             price_data: {
//                 currency: currency,
//                 product_data: {
//                     name: item.name
//                 },
//                 unit_amount: item.price * 100
//             },
//             quantity: item.quantity
//         }));


//         line_items.push({
//             price_data: {
//                 currency: currency,
//                 product_date: {
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:deliveryCharges*100
//             },
//             quantity:1
//         });

//         const stripeInstance = getStripe();
//         if (!stripeInstance) {
//             return res.json({ success: false, message: 'Stripe is not configured' });
//         }
        
//         const session = await stripeInstance.checkout.sessions.create({
//             success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//             line_items,
//             mode:"payment",
//         })
//         res.json({success:true, session_url:session.url})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

// placing order using razorpay


// export const placeOrderRazorpay = async (req, res) => {
//     try {
//         const { userId, items, amount, address } = req.body;
//         const orderData = {
//             userId, 
//             items,
//             amount,
//             address,
//             paymentMethod: "Razorpay",
//             payment: false,
//             date:Date.now()
//         }

//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

//         const options = {
//             amount: amount * 100,
//             currency: currency.toUpperCase(),
//             receipt:newOrder._id.toString()
//         }

//         const razorpay = getRazorpay();
//         if (!razorpay) {
//             return res.json({ success: false, message: 'Razorpay is not configured' });
//         }

//         await razorpay.orders.create(options, (error, order) => {
//             if (error) {
//                 console.log(error);
//                 return res.json({success:false, message:error.message})
//             }
//             res.json({success:true, order})
//         });

        
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }


// all the order data

export const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//User orders Data for frontEnd

export const userOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update order status

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.json({ success: false, message: 'orderId and status are required' });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


