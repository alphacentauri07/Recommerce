// async error ke lie basicaly try and catch use hota h pr code repitation na ho iss liye alag se banaya
// agar name humne required rkha h aur hum input me name nhi de toh infinite loding and server crash

module.exports = thefunc => (req,res,next) => {

Promise.resolve(thefunc(req,res,next)).catch(next); // thefunc pe try kiya promise se aur catch kiya catch se, thefunc koi bhi bahar se func ayega 

};