import { sendEmail } from "../utils/helper.js";
import fs from 'fs';


const paymentSuccess = async (req, res) => {
    try {
        let orderDetails = req.body;
        // console.log("data",orderDetails);

        if (!orderDetails) {
            return res.status(400).send({ message: "Invalid request or missing data" });
        }

        let email = orderDetails.email;
        // console.log("Sending email to:", email);  // Log to verify email is passed correctly

        let userName = orderDetails.userName;
        let orderNumber = orderDetails.orderNumber;

        const emailTemplatePath = 'src/emailTemplates/paymentConfirm.html';
        const htmlTemplate = await fs.promises.readFile(emailTemplatePath, 'utf8');
        const subject = 'Payment Confirmation Receipt';
        const replacedHtml = htmlTemplate
            .replace('{{userName}}', userName)
            .replace('{{paymentId}}', orderNumber);

        await sendEmail(email, subject, replacedHtml);  // Pass email, subject, and HTML as arguments

        res.status(200).send({ message: "Email sent successfully" });
    }
    catch (err) {
        res.status(501).send({
            message: err.message || "Internal server error"
        });
        // console.log(err);
    }
};
export default {
    paymentSuccess
}