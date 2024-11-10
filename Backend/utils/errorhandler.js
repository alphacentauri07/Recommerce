class ErrorHandler extends Error{   // By extending the Error class, you can add custom properties or methods to your custom error.
                                     // ki ye status code rha toh ye error dena pr usko use krne ke liye ek middleware bnao error.js

constructor(message,statusCode){
    super(message);
    this.statusCode=statusCode;
    Error.captureStackTrace(this,this.constructor); // (optional)
    //you're telling Node.js to start capturing the stack trace from the point where the ErrorHandler class is instantiated,
    // rather than from where the Error object is created.
}
}
module.exports = ErrorHandler;