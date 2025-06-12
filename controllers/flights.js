import Airport from "../Schema/Flights/AirportsSchema.js";
import Flight from "../Schema/Flights/FlightSchema.js";

export async function getFlights(req, res){
    try {
      const flights = await Flight.find().populate('departureAirport arrivalAirport');
      return res.status(200).json({ success: true, data: flights });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
}

export async function addFlight(req, res) {
  const { airline, flightNumber, departureAirport, arrivalAirport, departureTime, arrivalTime } = req.body;
  
  try {
      const departureAirportDoc = await Airport.findById(departureAirport);
      const arrivalAirportDoc = await Airport.findById(arrivalAirport);

      if (!departureAirportDoc || !arrivalAirportDoc) {
          return res.status(404).json({ success: false, message: "Airport not found..." });
      }

      const flight = new Flight({ airline, flightNumber, departureAirport, arrivalAirport, departureTime, arrivalTime });
      const newFlight = await flight.save();

      departureAirportDoc.flights.push(newFlight._id);
      await departureAirportDoc.save();

      arrivalAirportDoc.flights.push(newFlight._id);
      await arrivalAirportDoc.save();

      res.status(201).json({ success: true, data: newFlight });
  } catch (err) {
      res.status(400).json({ success: false, message: err.message });
  }
}