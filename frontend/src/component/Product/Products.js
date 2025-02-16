import React, { Fragment,useEffect,useState } from 'react'
import "./Products.css"
import { useSelector,useDispatch } from 'react-redux'
import { clearErrors,getProduct } from '../../actions/productAction'
import Loader from '../Layout/Loader/Loader'
import ProductCard from "../Home/ProductCard"
import { useParams } from 'react-router-dom';
import Pagination from "react-js-pagination"
import { Typography, Slider } from "@mui/material"
import { useAlert } from "react-alert";
import MetaData from '../Layout/MetaData'


const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
  "batter",
  "allrounder",
  "mobile",
  "taken",
];


const Products = () => {
  
   const dispatch = useDispatch();
   const alert = useAlert();
   const { keyword } = useParams();
 


   const [currentPage, setcurrentPage] = useState(1);
   const [price,setPrice] = useState([0,5000]);
   const [category,setCategory] = useState("");
   const [ratings,setRatings] = useState(0);

   const { products,loading,error,productsCount,resultPerPage} = useSelector(
    (state)=> state.products);

   //const keyword = match.params.keyword;
  
  const setCurrentPageNo = (e)=>{
    setcurrentPage(e);
  };

  const priceHandler = (event,newPrice)=>{
   setPrice(newPrice);
  };

    useEffect(() => {

      if (error) {
       alert.error(error);
        dispatch(clearErrors()); // Clear errors if any
      }

      dispatch(getProduct(keyword,currentPage,price,category,ratings));
    }, [dispatch,keyword,currentPage,price,category,ratings,alert,error]);
    

  return (
    <Fragment>
     {loading?(<Loader/>) : (<Fragment>

      <MetaData title="PRODUCTS -- ECOMMERCE"/>
        
        <h2 className="productsHeading">Products</h2>

        <div className="products" >
            {products &&
            products.map((product) =>(
                <ProductCard key = {product._id} product={product}  />)
            )}
        </div>

         
        <div className="filterBox">
          <Typography>Price</Typography>
          <Slider
          value={price}
          onChange={priceHandler}
          valueLabelDisplay='auto'
          aria-labelledby='range-slider'
          min={0}
          max={5000}
          />
            
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

           <fieldset>
           <Typography component="legend">Rating Above</Typography>
           <Slider
            value={ratings}
            onChange={(e, newRating)=>{
              setRatings(newRating);
            }}
           aria-labelledby="continous-slide"
           min={0}
           max={5}
           />
           </fieldset>
          </div> 



            <div className="paginationBox">
            <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive" 
            />  
        </div>

        </Fragment>
        )}
    </Fragment>
  );
};

export default Products;