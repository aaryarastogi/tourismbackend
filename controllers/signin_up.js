import collection from "../Schema/Login/LoginSchema.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function handleSignIn(req,res){
    const {username,email,password,phoneNumber}=req.body
    try{
        const check=await collection.findOne({email:email}) //if user exists or not
        if(check){
            const isPwdMatch = await bcrypt.compare(password,check.password)
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
                res.send(req.session.user);
                console.log("hogyaaa");
            }
            else{
                console.log("pwd not match")
            }
        }
        else{
            // console.log("nhi hua");
            res.json("notexist")
        }
    }
    catch(e){
        console.log("tokenerror",e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handleSignUp(req,res){
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
}

export async function googleAuthenticateUser(req, res) {
    const { tokenId } = req.body;
    try {
        const decodedToken = jwt.decode(tokenId);
        const { email, name } = decodedToken;

        console.log(email, name);
        let user = await collection.findOne({ email: email });

        if (!user) { // if user doesn't exist
            user = new collection({
                username: name,
                email: email
            });
            await user.save();
        }

        // Generate JWT token
        const token = await user.generateAuthToken();

        res.status(200).json({
            success: true,
            token: token, // Send the token to the frontend
            user: {
                username: user.username,
                email: user.email
            },
        });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}