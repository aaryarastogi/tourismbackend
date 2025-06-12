import Station from "../Schema/Trains/StationSchema.js";

export async function createStation(req, res){
    try {
      const { name, location, code} = req.body;
      const station = new Station({ name, location, code});
      await station.save();
      console.log(station);
      res.status(201).json(station);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
export async function getStations(req, res){
    try {
      const stations = await Station.find().populate('trains');
      return res.status(200).json({success: true , data: stations});
    } catch (err) {
      return res.status(400).json({ success: false , error: err.message });
    }
};