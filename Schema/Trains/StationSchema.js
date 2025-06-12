import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    trains:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Train'
    }]
});

const Station = mongoose.model("Station", stationSchema);

export default Station;