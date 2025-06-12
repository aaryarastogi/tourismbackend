import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    famousPlaces: { 
        type: [String], 
        required: true 
    }
});

const Place = mongoose.model("Place",PlaceSchema);

export default Place;