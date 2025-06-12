import mongoose from 'mongoose'

const citySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  hotels: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel' 
  }],
});

const City=mongoose.model("City",citySchema);
export default City;