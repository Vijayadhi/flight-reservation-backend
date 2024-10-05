import express from "express";
import bookingController from  "../controller/bookingConfirmation.controller.js";
import verify from '../middleware/verify.js';


const routes = express.Router();

routes.post('/newBooking',verify,bookingController.newBooking );
routes.get('/getBooking',verify,bookingController.getBooking );

export default routes