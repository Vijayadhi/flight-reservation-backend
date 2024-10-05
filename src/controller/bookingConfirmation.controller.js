import bookingModel from '../models/bookingModel.js';
import userModel from '../models/userModel.js'; // Assuming you have a user model
import fs from 'fs'; // For reading the email template
import { sendEmail } from '../utils/helper.js'; // Assuming you have an email utility'

const newBooking = async (req, res) => {
    try {
        // Extract the user email from the request (assuming authentication is already handled)
        const userEmail = req.user.email;

        // Check if the user exists in the database
        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Proceed with creating the booking
        const { OrID, orderData, selectedSeats, paymentId } = req.body;

        // const user = userEmail

        // console.log(user._id);

        const flightData = JSON.parse(req.body.orderData);
        const departureAirport = flightData.data.flightOffers[0].itineraries[0].segments[0].departure.iataCode;
        const arrivalAirport = flightData.data.flightOffers[0].itineraries[0].segments[0].arrival.iataCode;
        const departureTime = flightData.data.flightOffers[0].itineraries[0].segments[0].departure.at;
        const arrivalTime = flightData.data.flightOffers[0].itineraries[0].segments[0].arrival.at;
        const travelDate = flightData.data.flightOffers[0].itineraries[0].segments[0].departure.at.split('T')[0];
        const seatNumber = selectedSeats[0].number;
        const numberOfPassengers = selectedSeats.length;
        const totalCost = flightData.data.flightOffers[0].price.total;
        const terminalNumber = flightData.data.flightOffers[0].itineraries[0].segments[0].arrival.terminal;
        const flightNumber = flightData.data.flightOffers[0].itineraries[0].segments[0].number;
        const airlineCode = flightData.data.flightOffers[0].itineraries[0].segments[0].carrierCode;
        const baggageAllowance = flightData.data.flightOffers[0].pricingOptions.includedCheckedBagsOnly;
        const checkInTime = flightData.data.flightOffers[0].itineraries[0].segments[0].departure.at.split('T')[0] + ' 08:00:00';

        const consolidateData = [{
            "flight_number": flightNumber,
            "flight_number": flightNumber,
            "departure_airport": departureAirport,
            "arrival_airport": arrivalAirport,
            "departure_time": departureTime,
            "arrival_time": arrivalTime,
            "travel_date": travelDate,
            "seat_number": seatNumber,
            "number_of_passengers": numberOfPassengers,
            "total_cost": totalCost,
            "terminal_number": terminalNumber,
            "airline_code": airlineCode,
            "baggage_allowance": baggageAllowance,
            "check_in_time": checkInTime

        }]

        // Create the booking record
        const newBooking = await bookingModel.create({
            OrID,
            orderData,
            selectedSeats,
            user, // Store the user's ID in the booking
            paymentId,
            consolidateData
        });

        // Read the ticket email template
        const emailTemplatePath = 'src/emailTemplates/ticket.html';
        const htmlTemplate = await fs.promises.readFile(emailTemplatePath, 'utf8');

        // Extract necessary details from the response


        // Use replace for all placeholders. If you use Node 15+, you can use replaceAll().
        const replacedHtml = htmlTemplate
            .replace('{{userName}}', user.name || '')
            .replace('{{orderID}}', OrID || '')
            .replace('{{flight_number}}', flightNumber || '')
            .replace('{{departure_airport}}', departureAirport || '')
            .replace('{{departure_time}}', departureTime || '')
            .replace('{{arrival_airport}}', arrivalAirport || '')
            .replace('{{arrival_time}}', arrivalTime || '')
            .replace('{{travel_date}}', travelDate || '')
            .replace('{{seat_number}}', seatNumber || '')
            .replace('{{number_of_passengers}}', numberOfPassengers || '')
            .replace('{{total_cost}}', totalCost || '')
            .replace('{{terminal_number}}', terminalNumber || '')
            .replace('{{airline_code}}', airlineCode || '')
            .replace('{{baggage_allowance}}', baggageAllowance ? 'Yes' : 'No')
            .replace('{{check_in_time}}', checkInTime || '');

        // Send the email
        const subject = 'Your Flight Ticket';
        await sendEmail(userEmail, subject, replacedHtml);

        // Send the response after booking creation
        res.status(201).send({ message: 'Booking saved successfully!', booking: newBooking });
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Internal Server Error',
        });
    }
};


const getBooking = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        const booking = await bookingModel.findOne({ user: user._id });

        if (!booking) {
            return res.status(404).send({ message: 'Booking not found' });
        }
        res.status(200).send(booking);
    }
    catch (err) {
        res.status(500).send({ message: err.message || 'Internal Server Error' });
    }

}

export default { newBooking, getBooking };