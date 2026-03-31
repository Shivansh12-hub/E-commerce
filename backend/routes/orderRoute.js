import express from 'express'
import { adminAuth } from '../middleware/adminAuth.js';
import { allOrders, placeOrder, updateStatus, userOrder, verifyStripe } from '../controllers/orderController.js';
//placeOrderRazorpay, placeOrderStripe,
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();


// admin feature
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// payment feature
orderRouter.post('/place', authUser, placeOrder);
// orderRouter.post('/stripe', adminAuth, placeOrderStripe);
// orderRouter.post('/razoypay', adminAuth, placeOrderRazorpay);

// user feature
orderRouter.post('/userorders', authUser, userOrder);

// orderRouter.post('/verifyStripe', authUser, verifyStripe);

export default orderRouter