import Airport from "../Schema/Flights/AirportsSchema.js";

export async function getAirports(req, res){
  try {
    const airports = await Airport.find().populate('flights');
    return res.status(200).json({ success: true, data: airports });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addAirport(req, res){
    try {
      const { name, code, city, country } = req.body;
      const airport = new Airport({ name, code, city, country });
      await airport.save();
      res.status(201).json({ success: true, data: airport });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
}