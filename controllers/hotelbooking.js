import hotelBookCollection from "../Schema/Hotel/HotelBookSchema.js";
import nodemailer from "nodemailer";

export async function handleHotelBookGetData(req,res){
    try {
        const hotelData = await hotelBookCollection.find({ email: req.user.user.email });

        console.log('data', hotelData);

        if (hotelData && hotelData.length > 0) {
            return res.status(200).json({ success: true, hotels:hotelData });
        } else {
            console.log('No flight data found for the user');
            return res.status(404).json({ success: false, message: 'No hotel data found for the user' });
        }
    } catch (e) {
        console.log('/hotelbooking not working', e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function handleHotelBookPostData(req,res){
    const {email,category,location,checkinDate,checkoutDate,rooms,price}=req.body;
 
    const data={
         email:email,
         category:category,
         location:location,
         checkinDate:checkinDate,
         checkoutDate:checkoutDate,
         rooms:rooms,
         price:price
    }
 
    try{
        await hotelBookCollection.insertMany([data])
        const allData=await hotelBookCollection.find({})

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
            subject: 'Hotel Booking Confirmation',
            text: `Your hotel has been booked successfully! Details: ${JSON.stringify(data)}`,
        })
        console.log("Message sent to...",info.messageId);

        return res.status(200).json({ success: true, data:data});
    }
    catch(e){
        console.log('/hotelboooking nor working',e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
 }

 export async function handleHotelBookingDelete(req,res){
    try{
        const hotelId = req.params.id;
        const hotel = await hotelBookCollection.findByIdAndDelete(hotelId);
        if(!hotel){
            return res.status(404).json({success: false , message:"Hotel not found..."});
        }

        return res.status(200).json({success: true , message:"Hotel deleted successfully..."})
    }
    catch(e){
        return res.status(404).json({success: false , message:"Hotel not found..."})
    }
 }