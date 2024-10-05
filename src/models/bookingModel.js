import mongoose from "./index.js";


const bookingSchema = new mongoose.Schema({
    OrID: {
        type: String,
        required: true,
        unique: true

    }, // Unique identifier for the order
    orderData: [{      // Detailed order data (nested object)
        type: Object,
        required: true,
    }],
    selectedSeat: [  // Array of seat objects with details
        {
            type: Object,
            required: true
        },
    ],
    paymentId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    consolidateData: [
        {
            type:Object
        }
    ],
    bookingDate: {
        type: Date,
        default: Date.now
    },
}, {
    collection: "reservations",
    versionKey: false
});

// Create a model
export default mongoose.model('reservations', bookingSchema);
