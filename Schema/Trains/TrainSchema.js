import mongoose, { mongo } from "mongoose";

const trainSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    number: { 
        type: String, 
        required: true, 
        unique: true 
    },
    stations:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Station'
    }]
});

const Train = mongoose.model("Train", trainSchema);

export default Train;