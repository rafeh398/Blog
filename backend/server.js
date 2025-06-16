import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js";
import cookieParser from "cookie-parser";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// CORS Setup
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public")); // for static files like images (optional)

// API Endpoints
app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);



// Root Route
app.get("/", (req, res) => {
  res.send(" Blog API is working.");
});

// Connect DB and Start Server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!", err);
  });
