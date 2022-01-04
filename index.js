const express = require("express");
const app = express();
const port = process.env.PORT || 3030;
const init = require("./lib/initialization");
const playlistController = require("./controllers/playlistController");

app.use(express.json());
app.use(init.jsonParseHandler);
app.get("/status", playlistController.status);
app.get("/share/:id", playlistController.share);

app.use(init.checkAuth);

app.post("/create", playlistController.create);
app.post("/add", playlistController.add)
app.post("/update", playlistController.update);
app.post("/delete", playlistController.delete);

app.get("/get", playlistController.get);
app.get("/list", playlistController.list);

app.listen(port, () => {
    console.log(`[Playlists API] Listening to http://0.0.0.0:${port}`);
    init.checks();
    init.db();
});
