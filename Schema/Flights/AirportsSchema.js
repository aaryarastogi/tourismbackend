import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
    flights:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Flight' 
    }]
});

const Airport = mongoose.model("Airport",airportSchema);

export default Airport;