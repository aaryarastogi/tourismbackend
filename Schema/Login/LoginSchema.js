import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const LoginSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: false,
    },
    phoneNumber:{
        type:Number,
        required:false
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

LoginSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign(
            {
                user: {
                    _id: this._id,
                    username: this.username,
                    email: this.email
                }
            },
            "mynameisaaryarastogiiamamernstackdeveloper",
            { expiresIn: '7d' }
        );

        this.tokens = this.tokens || [];
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (e) {
        console.log("Generate auth token failed", e);
        throw e; // Rethrow the error to handle it in the calling function
    }
};


const collection=mongoose.model("collections",LoginSchema)

export default collection;