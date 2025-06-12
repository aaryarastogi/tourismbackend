import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    airline: { 
        type: String, 
        required: true 
    },
    flightNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    departureAirport: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Airport',
        required:true
    },
    arrivalAirport: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Airport',
        required:true
    },
    departureTime: { 
        type: Date, 
        required: true 
    },
    arrivalTime: { 
        type: Date, 
        required: true 
    }
});

const Flight = mongoose.model("Flight",flightSchema);

export default Flight;
