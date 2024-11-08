class ApiFeature{

   constructor(query,queryStr){   //ek Apifeaature ki class for query and query ki find() and querystr for word need to find
       
     this.query=query;
     this.queryStr=queryStr;
   }

   search(){
    const keyword = this.queryStr.keyword  ? {  // check if their is any querystring
  
     name:{ $regex: this.queryStr.keyword,       // we need to search name so we use mongodb operator "regex" which helps in pattern searching like samosa & samosamosa 
           $options: "i",                         // case insensetive
       
    },
    } : {};  
      
    this.query = this.query.find({...keyword});  // we have made the same Product.find() but instead we have make keyword using regex and then find it
     return this;               // and now we return the query and will call the function in controller
   }

   filter(){
    
    const queryCopy = {...this.queryStr} // used spread operator so that we can make a copy of querystr and not get origanl value by refrence
    
    //removing some fields for category

    const removeFields = ["keyword", "page", "limit"]
    
    removeFields.forEach(key=>delete queryCopy[key]); // we will be removing from arraay

//filter for price and rating 

let queryStr = JSON.stringify(queryCopy);  // queryCopy is object which contains all info of price etc, we convert it to string and then modify
queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=> `$${key}`); // greater than less than

this.query = this.query.find(JSON.parse(queryStr));  // vapis object bna diya
return this;

}

pagination(resultPerPage){
    
    const currentPage = Number(this.queryStr.page) || 1; //queryStr is string we need to convert it to number or bydefault 1 
    
    const skip = resultPerPage * (currentPage - 1);    // we have 50 product we want 5 product/page  so on first page how many will skip none, but on 2nd first 5 will skip we need to math
    
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
}



} 

module.exports = ApiFeature;