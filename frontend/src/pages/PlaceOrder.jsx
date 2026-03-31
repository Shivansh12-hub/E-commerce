import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function PlaceOrder() {

  const { navigate, backendUrl, token, cartItems, setCartItems, products, getCartAmount, delivery_fee } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    status: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandle = async (e)=> {
    e.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item]) {
            const itemInfo = structuredClone(products.find(product=> product._id  == items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        // payment method for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
          console.log(response.data);
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          }
          else {
            toast.error(response.data.message);
          }
          break;
        
        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe, orderData, { headers: { token } } ');
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          }
          else {
            toast.error(response.Stripe.data.message)
          }
          break;
        
        default:
          break;
        
        case 'razorpay':
          const responseRazorpay = await axios.post(backendUrl+'/api/order/razorpay', orderData, {headers:{token}})

          if (responseRazorpay) {
            console.log(responseRazorpay);
          }
          break;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to place order');
    }
  }

  return (
    <form onSubmit={onSubmitHandle} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/*  -- -- -- -- -- -- -left side- -- -- -- -- -- -- --  */}         
      <div className="flex flex-col w-full gap-4 sm:max-w-[480px] ">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input required
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "/>
          <input required
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
        </div>
        <input required
          name="email"
            value={formData.email}
            onChange={onChangeHandler}
          type="email"
          placeholder="Email address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
        />
        <input required
          name="street"
            value={formData.street}
            onChange={onChangeHandler}
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
        />
        <div className="flex gap-3">
          <input required
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
          <input required
            name="status"
            value={formData.status}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
        </div>
        <div className="flex gap-3">
          <input required
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
          <input required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
          />
        </div>
        <input required
          name="phone"
            value={formData.phone}
            onChange={onChangeHandler}
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full "
        />
      </div>
      {/* ----------right side------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ----------payment method selection---------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <img src={assets.stripe_logo} className="hhh-5 mx-4" alt="" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}
              ></p>
              <img src={assets.razorpay_logo} className="hhh-5 mx-4" alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Cash On Delivery
              </p>
            </div>
          </div>
          <div  className="w-full text-end mt-8">
            <button type='submit' className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
}
