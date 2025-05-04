const express=require('express');
const router=express.Router();
const {signup,verifyOtp,login,}=require('../controllers/userController')



router.post('/signup',signup);
router.post('/verifyotp',verifyOtp)
router.post('/login',login)




module.exports=router;
