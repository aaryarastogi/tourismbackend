import express from "express";
import connectDB from "./config/db.js";
import cors from 'cors';
import collection from "./Schema/Login/LoginSchema.js"
import flightBookCollection from './Schema/Flights/FlightsBookSchema.js'
import trainBookCollection from "./Schema/Trains/TrainBookSchema.js";
import hotelBookCollection from "./Schema/Hotel/HotelBookSchema.js";
import cabBookCollection from "./Schema/Cabs/CabBookSchema.js";
import bcrypt from 'bcrypt'
import session from "express-session";
import MongoStore from 'connect-mongo'
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/auth.js";

const app= express();
app.use(express.json());
app.use(cookieParser());

//middle ware
// app.use(cors({
//     origin: function (origin, callback) {
//         // Check if the request origin is in the allowedOrigins array
//         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//           callback(null, true);
//         } else {
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//     methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
//     credentials: true,
// }));

//creating sesion
app.use(session({
    store:MongoStore.create({
        mongoUrl: 'mongodb+srv://esehi:react@cluster0.lfyoq9r.mongodb.net/',
        collectionName:'user sessions',
      }),
    secret:"youraresecretkeytomyserveronlydontdiscloseyourselfsamjhi",
    saveUninitialized:false,
    resave:false,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:1000*60*30,
        sameSite:'none'
    }
}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
  
    next();
});

connectDB(process.env.USERNAME , process.env.PASSWORD);

app.get("/",cors(),(req,res)=>{
    // cookie access krni h getcookie krke
})

app.post("/",(req,res)=>{
   
})

app.get('/user', authenticateToken, async(req, res) => {
    // console.log('body',req.user);
    // console.log('body' , req.user);
    try{
        const userData=await collection.findOne({_id:req.user.user._id});
        // console.log('data',userData);
        if(userData){
            return res.status(200).json({success:true,user:userData})
        }else{
            console.log('userdata failed');
        }
    }catch(e){
        console.log('/user not working',e.message);
        return res.status(400).json({success:false})
    }
})

//for login backend 
app.get("/signin",cors(),(req,res)=>{
    const sess=req.session.user;
    res.send('welcome'+sess)
})

app.post("/signin",async(req,res)=>{
    // console.log(req.body);
    const {username,email,password,phoneNumber}=req.body
    try{
        const check=await collection.findOne({email:email}) //if user exists or not
        if(check){
            const isPwdMatch=bcrypt.compare(password,check.password)
            if(isPwdMatch){
                req.session.user=check
                req.session.loggedIn=true

                const token= await check.generateAuthToken(); //creating token
                
                //now ham cookie create kr rhe hai jo ki person ka session ka data store krega browser pr dikhane ke liye
                res.cookie('jwtAuth', token, {
                expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    // secure: false, //secure: process.env.NODE_ENV === 'production'
                    // sameSite: 'none',
                });
                res.send(req.session.user)
            }
            else{
                console.log("pwd not match")
            }
        }
        else{
            res.json("not exist")
        }
    }
    catch(e){
        console.log("tokenerror",e);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//for sigup backend
app.get("/signup",cors(),(req,res)=>{

})

app.post("/signup",async(req,res)=>{
    console.log(req.body)
    const { username,email , password ,phoneNumber}=req.body
    try{
        const hashedPassword=await bcrypt.hash(password,10);
        const data={
            username:username,
            email:email,
            password:hashedPassword,
            phoneNumber:phoneNumber
        }
        const check=await collection.findOne({email:email})

        if(check){
            // alert("User already exists....")
            res.json("exist")
        }
        else{
            res.json("notexist")
            await collection.insertMany([data])
        }
    }
    catch(e){
        console.log(e);
    }
})

app.get("/flightbooking", authenticateToken, async (req, res) => {
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
});

app.post("/flightbooking",async(req,res)=>{
    // console.log(req.body);

    const {email,category,fromCity,fromCity1,destination,destination1,flight,departureDate,returnDate}=req.body;

    const data={
        email:email,
        category:category,
        fromCity:fromCity,
        fromCity1:fromCity1,
        destination:destination,
        destination1:destination1,
        flight:flight,
        departureDate:departureDate,
        returnDate:returnDate
    }

    try{
        await flightBookCollection.insertMany([data])
        const allData=await flightBookCollection.find({})
        return res.status(200).json({ success: true, data:allData});
    }
    catch(e){
        console.log('/flight booking not working',e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})


//for train booking
app.post("/trainbooking",async(req,res)=>{
    console.log(req.body);

    const {email,category,fromCity,destination,travelDate,trainNumber,seatingClass}=req.body;
    console.log(req.body)
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
        return res.status(200).json({ success: true, data:allData});
    }
    catch(e){
        console.log('/trainboooking nor working',e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.get("/trainbooking",authenticateToken,async(req,res)=>{
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
})

//for hotel booking
app.get("/hotelbooking",authenticateToken,async(req,res)=>{
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
})

app.post("/hotelbooking",async(req,res)=>{
   console.log(req.body);

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
        return res.status(200).json({ success: true, data:allData});
    }
    catch(e){
        console.log('/hotelboooking nor working',e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

//for cab booking
app.get("/cabbooking",authenticateToken,async(req,res)=>{
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
})

app.post("/cabbooking",async(req,res)=>{
//    console.log(req.body);

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
        console.log('cabDataInserted',data);
        const allData=await flightBookCollection.find({})
        return res.status(200).json({ success: true, cabs:allData });
    }
    catch(e){
        console.log('/cabbooking not working', e.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

  
  
const PORT=process.env.PORT || 8000;

app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));