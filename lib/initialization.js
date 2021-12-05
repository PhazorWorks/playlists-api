const mongoose = require("mongoose");

exports.db = async () => {
    mongoose.connection.on("error", (err) => {
        console.error("Database Error: " + err);
        process.exit();
    });

    mongoose.connection.on("connected", () => {
        mongoose.connection.readyState === 1
            ? console.log("Connected to database")
            : console.error("Not connected to database");
    });
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
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
    if (!key) return res.status(403).json({success: false, message: "No API key was sent."})
    if (key !== process.env.API_KEY) return res.status(403).json({success: false, message: "API key is invalid."})
    next()
}
