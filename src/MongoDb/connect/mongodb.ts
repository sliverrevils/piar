import mongoose from "mongoose";

const mongoUrl = process.env.MONGODB_URL as string;

//console.log("CONNECT TO DB: ", mongoUrl);

let cached = global.mongooseShop;

if (!cached) {
    cached = global.mongooseShop = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const options = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(mongoUrl, options).then((mongoose) => {
            console.log("MONGO CONNECT ✅ ", mongoUrl);
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export { connectDB };
