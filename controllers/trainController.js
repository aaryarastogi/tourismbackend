import Station from "../Schema/Trains/StationSchema.js";
import Train from "../Schema/Trains/TrainSchema.js";

export async function createTrain(req, res){
    const { name, number , stations} = req.body;
    try {
      const station = await Station.findById(stations);
        if(!station) return res.status(404).json({success: false , message: "Station not found..."})
      
      const train = new Train({ name, number , stations});
      const newTrain = await train.save();
        console.log(station);
      station.trains.push(newTrain._id);
      await station.save();

      res.status(201).json({success: true , data: train});
    } catch (err) {
      res.status(400).json({ success: false , error: err.message });
    }
};
  
export async function getTrains(req, res){
    try {
      const trains = await Train.find().populate('stations');
      return res.status(200).json({success: true , data: trains});
    } catch (err) {
      return res.status(400).json({ success: false , error: err.message });
    }
};