import trainBookCollection from "../Schema/Trains/TrainBookSchema.js";
import nodemailer from "nodemailer";

export async function handleTrainBookPostData(req,res){
    const {email,category,fromCity,destination,travelDate,trainNumber,seatingClass}=req.body;
    const data={
        email:email,
        category:category,
        fromCity:fromCity,
        destination:destination,
        travelDate:travelDate,
        trainNumber:trainNumber,
        seatingClass:seatingClass
    }

    try{
        await trainBookCollection.insertMany([data])
        const allData=await trainBookCollection.find({})

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
            subject: 'Train Booking Confirmation',
            text: `Your train has been booked successfully! Details: ${JSON.stringify(data)}`,
        })
        console.log("Message sent to...",info.messageId);
        
        return res.status(200).json({ success: true, data: data});
    }
    catch(e){
        console.log('/trainboooking nor working',e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function handleTrainBookGetData(req,res){
    try {
        const trainData = await trainBookCollection.find({ email: req.user.user.email });

        console.log('data', trainData);

        if (trainData && trainData.length > 0) {
            return res.status(200).json({ success: true, trains:trainData });
        } else {
            console.log('No flight data found for the user');
            return res.status(404).json({ success: false, message: 'No flight data found for the user' });
        }
    } catch (e) {
        console.log('/trainbooking not working', e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function handleTrainBookingDelete(req,res){
    try {
        const trainId = req.params.id;
        const train = await trainBookCollection.findByIdAndDelete(trainId);
        
        if (!train) {
            return res.status(404).json({ success: false, message: 'train not found' });
        }

        res.status(200).json({ success: true, message: 'train deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting train', error: error.message });
    }
}