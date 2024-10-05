import express from "express";
import emailController from  "../controller/sendEmail.controller.js";


const route = express.Router();

route.post('/bookingConfiramtion', emailController.paymentSuccess)

export default route;