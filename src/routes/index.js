import express from "express"
import userRoutes from  "./user.routes.js"
import emailRoutes  from  "./email.routes.js"
import bookingRoutes from "./booking.routes.js"



const routes = express.Router();

routes.use('/user', userRoutes);
routes.use('/email',  emailRoutes);
routes.use('/booking', bookingRoutes);


export default routes;