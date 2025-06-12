import cabBookCollection from "../Schema/Cabs/CabBookSchema.js";
import nodemailer from "nodemailer";

export async function handleCabBookGetData(req,res){
    try {
        const cabData = await cabBookCollection.find({ email: req.user.user.email });

        console.log('data', cabData);

        if (cabData && cabData.length > 0) {
            return res.status(200).json({ success: true, cabs:cabData });
        } else {
            console.log('No cab data found for the user');
            return res.status(404).json({ success: false, message: 'No cab data found for the user' });
        }
    } catch (e) {
        console.log('/cabbooking not working', e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function handleCabBookPostData(req,res){
    const {email,category,fromCity,destination,departureDate,returnDate,pickupTime}=req.body;
    const data={
        email:email,
        category:category,
        fromCity:fromCity,
        destination:destination,
        departureDate:departureDate,
        returnDate:returnDate,
        pickupTime:pickupTime
    }

    try{
        await cabBookCollection.insertMany([data])
        const allData=await cabBookCollection.find({})

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
            subject: 'Cab Booking Confirmation',
            text: `Your cab has been booked successfully! Details: ${JSON.stringify(data)}`,
        })
        console.log("Message sent to...",info.messageId);

        return res.status(200).json({ success: true, data:data });
    }
    catch(e){
        console.log('/cabbooking not working', e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function handleCabBookDelete(req,res){
    try{
        const cabId = req.params.id;
        const cab = await cabBookCollection.findByIdAndDelete(cabId);
        if(!cab){
            return res.status(404).json({success: false , message: "cab not found..."})
        }
        res.status(200).json({success: true , message: "Cab deleted successfully..."})
    }
    catch(e){
        res.status(500).json({success:false, message:"server error..."})
    }
}