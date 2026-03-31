import { createContext,useEffect,useState } from "react";
// import { products } from "";
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"
import axios from "axios";
export const ShopContext = createContext();

const ShopContextProvider = ({children}) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');


    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
            cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }
    
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers:{token}} );
            } catch (error) {
                
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;

            for (const item in cartItems[items]) {
                const quantity = cartItems[items][item];
                if (quantity > 0) {
                    totalAmount += itemInfo.price * quantity;
                }
            }
        }
        return totalAmount;
    }

    const getProductData = async () => {
        try {
            if (!backendUrl) {
                toast.error('Backend URL is not configured');
                return;
            }
            const response = await axios.get(`${backendUrl}/api/product/list`)
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
            console.log(response.data);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch products');
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData);
    
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch products');
        }
    }

    useEffect(() => {
        getProductData()
    },[])

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    },[])

    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token])

    const value = {
        products,
        currency,
        delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, addToCart, getCartCount, updateQuantity,getCartAmount,navigate, backendUrl,setToken,token,setCartItems
    }
    return <ShopContext.Provider value={value}>
        {children}
        </ShopContext.Provider>
}

export default ShopContextProvider