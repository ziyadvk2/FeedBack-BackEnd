const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  googleId: String,
  email:String,
  name: String,
  payment_id:{type:Array,default:[]},
  credits:{type: Number,default: 0}
});

module.exports = mongoose.model('users', userSchema);
