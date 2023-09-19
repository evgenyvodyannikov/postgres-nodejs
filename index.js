import express from "express";
import cors from 'cors';
import roomRouter from "./routes/room.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/rooms', roomRouter)

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log("Server error: ", err);
    }
    console.log("Server OK");
});