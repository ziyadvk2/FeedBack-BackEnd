const passport = require("passport");
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("users");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
User.findById(id).then(user =>{
    done(null, user)
})
});
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          //Already there is record in our database
          // console.log( "profile:---",profile);
          return done(null, existingUser);
        } else {
          //we don't have any record of this googleId
          
          const user = await new User({ googleId: profile.id, name:profile.displayName,email:profile.emails[0].value}).save();
          done(null, user)
        }
    }
  )
);
