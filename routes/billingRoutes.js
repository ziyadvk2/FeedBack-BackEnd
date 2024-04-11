const keys = require("../config/keys");
const Razorpay = require("razorpay");
const crypto = require('crypto');
const requireLogin = require("../middlewares/requireLogin")

module.exports = (app) => {
  const razorpay = new Razorpay({
    key_id: keys.razorpayId,
    key_secret: keys.razorpayKey,
  });

  app.post("/api/razorpay",requireLogin, async (req, res) => {
    const payment_capture = 1;
    const amount = 10;
    const currency = "INR";

    const options = {
      amount: (amount * 100).toString(),
      currency: currency,
      receipt: crypto.randomBytes(10).toString("hex"),
      payment_capture,
    };
    try {
      const response = await razorpay.orders.create(options);
        if(!response){
          return res.status(500).json({message:"Something Went Wrong!"});
        }
      res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({message:"Internal Server Error"});
    }
  });

  app.post("/api/verification", async (req, res) => {
    
    try {
      const {razorpayOrderId,razorpayPaymentId,razorpaySignature}=req.body;
      const sign = razorpayOrderId+"|"+razorpayPaymentId;
      const shasum = crypto.createHmac("sha256", keys.razorpayKey);
      shasum.update(sign.toString());
      const digest = shasum.digest("hex");
      if (digest === req.body.razorpaySignature) {
        req.user.credits += 5;
        req.user.save();
        console.log("request is legit");
        res.status(200).json({ status:true,message:"Razorpay Payment Verification SuccessFull"});
      } else {
        console.log("request is fail");
        res.status(400).json({status:false, message:"Invalid Signature sent!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({message:"Internal Server Error"});
    }
  });
};
