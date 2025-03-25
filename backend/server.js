import express from "express";
import auth from "./routes/authRoutes.js";
import connectDB from "./config/dbconnect.js";
import autho from "./middleware/authoMiddleware.js";
import user from "./routes/userRoutes.js";
import passport from "passport";
import "./config/passport.js"
import session from "express-session";
import corsMiddleware from "./middleware/corsMiddleware.js";
import mail from "./routes/mailRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"
import productRoutes from "./routes/productRoutes.js"
const app = express();
connectDB();


app.use(express.json());

// Sessions
app.use(
    session({
        secret:'key',
        resave:false,
        saveUninitialized:false,
    })
)
passport.initialize();
// cors middleware
corsMiddleware(app);

//@desc server uploads
app.use("/uploads", express.static("uploads"));

//@desc Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//@desc authantication
app.use('/api/auth',auth);
app.use('/api/user',autho,user);

//@desc cart and orders
app.use("/api/cart",autho, cartRoutes);
app.use("/api/orders",autho, orderRoutes);

//@desc mail list
app.use('/api/mail',mail);

//@desc products
app.use('/api/products',productRoutes)








app.listen(8000,()=>{
    console.log("server is running on port 8000");
});
