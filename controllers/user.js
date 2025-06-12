import collection from "../Schema/Login/LoginSchema.js";

export async function handleUser(req, res){
    console.log('body',req.user);
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
}