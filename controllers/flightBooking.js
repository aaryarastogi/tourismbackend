import flightBookCollection from "../Schema/Flights/FlightsBookSchema.js";
import nodemailer from "nodemailer"

export async function handleFlightBookGetData(req, res){
    try {
        const flightData = await flightBookCollection.find({ email: req.user.user.email });

        console.log('data', flightData);

        if (flightData && flightData.length > 0) {
            return res.status(200).json({ success: true, flights: flightData });
        } else {
            console.log('No flight data found for the user');
            return res.status(404).json({ success: false, message: 'No flight data found for the user' });
        }
    } catch (e) {
        console.log('/flightbooking not working', e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
  
export async function handleFlightBookPostData(req, res) {
    const { email, category, fromCity, fromCity1, destination, destination1, flight, departureDate, returnDate } = req.body;
  
    const data = {
      email: email,
      category: category,
      fromCity: fromCity,
      fromCity1: fromCity1,
      destination: destination,
      destination1: destination1,
      flight: flight,
      departureDate: departureDate,
      returnDate: returnDate,
    };
    
    try {
      await flightBookCollection.insertMany([data]);
      const allData = await flightBookCollection.find({});

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'aarya.rastogi.0110@gmail.com',
            pass: 'jqei ijre qfhc iqph'
        }
      });
      let info = await transporter.sendMail({
        from: 'aarya.rastogi.0110@gmail.com',
        to: email,
        subject: 'Flight Booking Confirmation',
        text: `Your flight has been booked successfully! Details: ${JSON.stringify(data)}`,
      })
      console.log("Message sent to...",info.messageId);
      
      return res.status(200).json({success: true , message: "Flight is booked..." , content: info})
    } catch (e) {
      console.log('/flight booking not working', e.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function handleFlightBookingDelete(req, res) {
    try {
        const flightId = req.params.id;
        const flight = await flightBookCollection.findByIdAndDelete(flightId);
        
        if (!flight) {
            return res.status(404).json({ success: false, message: 'Flight not found' });
        }

        res.status(200).json({ success: true, message: 'Flight deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting flight', error: error.message });
    }
}