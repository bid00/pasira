import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../config.js";
import { google_client_id,google_client_secret } from "../config.js";
import User from "../models/userModel.js";

passport.use(
    new GoogleStrategy(
      {
        clientID: google_client_id,
        clientSecret: google_client_secret,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        
            try {
                let user = await User.findOne({ googleId: profile.id });
                    if (!user) {
                        user = await User.create({
                            googleId: profile.id,
                            fullName: profile.displayName,
                            email: profile.emails[0].value,
                  });
                 }
                 const token = jwt.sign({userId:user._id.toString()},accessTokenSecret)
                 return done(null, {user,token});
                 } catch (error) {
                 return done(error, null);
                 }
      }
    )
  );

export default passport;

