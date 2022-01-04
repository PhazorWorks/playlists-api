const mongoose = require("mongoose");
let mongoose_db;
exports.db = async () => {
    mongoose.connection.on("error", (err) => {
        console.error("[Playlists API] Database Error: " + err);
        process.exit();
    });

    mongoose.connection.on("connected", () => {
        mongoose.connection.readyState === 1
            ? console.log("[Playlists API] Connected to database")
            : console.error("[Playlists API] Not connected to database");
    });
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return (mongoose_db = mongoose);
};

exports.getDB = () => {
    return mongoose_db;
};

exports.checks = () => {
    // check if we have database string
    if (!process.env.MONGODB_CONNECTION_URL)
        console.warn("[Playlists API] MONGODB_CONNECTION_URL is not set.");
    if (!process.env.API_KEY) console.warn("[Playlists API] API_KEY is not set.");
    if (!process.env.API_KEY || !process.env.MONGODB_CONNECTION_URL)
        process.exit();
};

exports.jsonParseHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        console.error(err);
        return res
            .status(400)
            .json({message: err.message, error: "INVALID_JSON_SENT"});
    }
    next();
};

exports.checkAuth = (req, res, next) => {
    const {key} = req.query;
    if (!key)
        return res
            .status(403)
            .json({success: false, message: "No API key was sent."});
    if (key !== process.env.API_KEY)
        return res
            .status(403)
            .json({success: false, message: "API key is invalid."});
    next();
};
