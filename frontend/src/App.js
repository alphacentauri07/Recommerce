import './App.css';
import Header from "./component/Layout/Header/Header";
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import WebFont from "webfontloader"
import { useEffect,useState } from 'react';
import Footer from './component/Layout/Footer/Footer';
import Home from "./component/Home/Home.js"
import ProductDetails from './component/Product/ProductDetails.js';
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp.js';
import store from "./store.js"
import { loadUser } from './actions/userAction.js';
import UserOptions from "./component/Layout/Header/UserOptions.js"
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import ProtectedRoute from './component/Route/ProtectedRoute.js';
import UpdateProfile from "./component/User/UpdateProfile.js"
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import axios from 'axios';
import Payment from "./component/Cart/Payment.js"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from './component/Cart/OrderSuccess.js'
import MyOrders from "./component/Order/MyOrder.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/admin/Dashboard.js"
import ProductList from "./component/admin/ProductList.js"
import NewProduct from './component/admin/NewProduct.js';
import UpdateProduct from './component/admin/UpdateProduct.js';
import OrderList from './component/admin/OrderList.js';
import ProcessOrder from './component/admin/ProcessOrder.js';
import UsersList from './component/admin/UsersList.js';
import UpdateUser from "./component/admin/UpdateUser.js"
import ProductReviews from "./component/admin/ProductReviews.js"
import Contact from './component/Layout/Contact/Contact.js';
import About from './component/Layout/About/About.js';
import NotFound from "./component/Layout/Not Found/NotFound.js";


function App() {

const { isAuthenticated,user} = useSelector((state)=>state.user)

const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }



  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
      
     store.dispatch(loadUser());

     getStripeApiKey();
  }, []);


  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/password/forgot" element={<ForgotPassword/>}/>
        <Route path="/password/reset/:token" element={<ResetPassword/>}/>
        







        /* Protected Route */
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile/>}/>
          <Route path="/password/update" element={<UpdatePassword/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/shipping" element={<Shipping/>}/>
          <Route path="/order/confirm" element={<ConfirmOrder/>}/>

          <Route path="/success" element={<OrderSuccess/>}/>
          <Route path="/orders" element={<MyOrders/>}/>
          <Route path="/order/:id" element={<OrderDetails/>}/>
        </Route>

        /* Admin Routes */
        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList/>} />
          <Route path="/admin/product" element={<NewProduct/>} />
          <Route path="/admin/product/:id" element={<UpdateProduct/>} />
          <Route path="/admin/orders" element={<OrderList/>} />
          <Route path="/admin/order/:id" element={<ProcessOrder/>} />
          <Route path="/admin/users" element={<UsersList/>} />
          <Route path="/admin/user/:id" element={<UpdateUser/>} />
          <Route path="/admin/reviews" element={<ProductReviews/>} />

        </Route>

        {stripeApiKey && ( <Route path="/process/payment" element={<Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements>}/>)}

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
  
}

export default App;
