import express from "express";
import connectDB from "./config/db.js";
import cors from 'cors';
import session from "express-session";
import MongoStore from 'connect-mongo'
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/auth.js";
import { googleAuthenticateUser, handleSignIn, handleSignUp } from "./controllers/signin_up.js";
import { handleFlightBookGetData, handleFlightBookingDelete, handleFlightBookPostData } from "./controllers/flightBooking.js";
import { handleTrainBookGetData, handleTrainBookingDelete, handleTrainBookPostData } from "./controllers/trainbooking.js";
import { handleHotelBookGetData, handleHotelBookingDelete, handleHotelBookPostData } from "./controllers/hotelbooking.js";
import { handleCabBookDelete, handleCabBookGetData, handleCabBookPostData } from "./controllers/cabbooking.js";
import { handleUser } from "./controllers/user.js";
import { getCities , addCity } from "./controllers/cityController.js"
import {addHotel} from "./controllers/hotelController.js"
import { addAirport, getAirports } from "./controllers/airports.js";
import { addFlight, getFlights } from "./controllers/flights.js";
import { createTrain, getTrains } from "./controllers/trainController.js";
import { createStation, getStations } from "./controllers/stationController.js";
import User from './Schema/Login/LoginSchema.js'
import jwt from 'jsonwebtoken'
import { getAllPlaces, getParticularPlaceDetail, putPlace } from "./controllers/places.js";

const app= express();
app.use(express.json());
app.use(cookieParser());

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

app.get('/user', authenticateToken,handleUser)

//for signin
app.get("/signin",cors(),(req,res)=>{
    const sess=req.session.user;
    res.send('welcome'+sess)
})
app.post("/signin",handleSignIn)

//for signup
app.get("/signup",cors(),(req,res)=>{

})
app.post("/signup", handleSignUp)

app.post('/api/authenticate', googleAuthenticateUser);

//for flight booking
app.get("/flightbooking", authenticateToken, handleFlightBookGetData);
app.post("/flightbooking",handleFlightBookPostData);
app.delete("/flightbooking/:id", handleFlightBookingDelete);

//for train booking
app.post("/trainbooking",handleTrainBookPostData)
app.get("/trainbooking",authenticateToken,handleTrainBookGetData)
app.delete("/trainbooking/:id",handleTrainBookingDelete)

//for hotel booking
app.get("/hotelbooking",authenticateToken,handleHotelBookGetData)
app.post("/hotelbooking",handleHotelBookPostData)
app.delete("/hotelbooking/:id",handleHotelBookingDelete)

//for cab booking
app.get("/cabbooking",authenticateToken,handleCabBookGetData)
app.post("/cabbooking",handleCabBookPostData)
app.delete("/cabbooking/:id",handleCabBookDelete);

//api routes
app.get("/api/cities",getCities);
app.post("/api/cities",addCity);

app.post("/api/hotels",addHotel);

app.get("/api/airports",getAirports);
app.post("/api/airports",addAirport);

app.get("/api/flights",getFlights);
app.post("/api/flights",addFlight);

app.get("/api/trains",getTrains);
app.post("/api/trains",createTrain);

app.get("/api/stations",getStations);
app.post("/api/stations",createStation);

app.get("/api/places",getAllPlaces);
app.get("/api/places/:id",getParticularPlaceDetail);
app.post("/api/places",putPlace);

const PORT=process.env.PORT || 8000;
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));