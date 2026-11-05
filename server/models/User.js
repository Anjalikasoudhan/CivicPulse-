import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            minlength:6,
            select:false
        },
        role:{
            type:String,
            enum:["citizen","admin"],
            default:"citizen"
        }
    },
    {timestamps:true}
);

//Hash Password before saving to the database
userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10);

});

//compare the entered password with hashed password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

const User=mongoose.model("User",userSchema);

export default User;
