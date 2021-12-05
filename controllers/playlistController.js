const Playlist = require("../lib/models/Playlist");
const {decode} = require("@lavalink/encoding");

exports.create = async (req, res) => {
    try {
        const {user_id, name, tracks} = req.body;
        if (!user_id) return res.status(400).json({success: false, message: "No user id was sent."})
        if (!tracks) return res.status(400).json({success: false, message: "No tracks was sent."})
        if (!name) return res.status(400).json({success: false, message: "No name was sent."})
        const query = await Playlist.findOne({name: name, user_id: user_id})
        if (query) return res.status(409).json({
            success: false,
            message: `Playlist with name ${name} already exists, please delete the old playlist to make a new one!`
        })
        const playlist = new Playlist({
            user_id: user_id,
            tracks: tracks,
            name: name,
        })
        await playlist.save()

        return res.status(200).json({
            success: true,
            message: `Playlist ${name} with ${tracks.length} has been created.`
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({success: false, message: "Unknown error."})
    }
}

exports.get = async (req, res) => {
    try {
        const {user_id, name} = req.query;
        if (!user_id) return res.status(400).json({success: false, message: "No user id was sent."})
        if (!name) return res.status(400).json({success: false, message: "No name was sent."})

        const query = await Playlist.findOne({user_id: user_id, name: name});
        if (!query) return res.status(404).json({success: false, message: `playlist with name ${name} was not found.`})

        return res.status(200).json(query)
    } catch (e) {
        console.error(e)
        res.status(500).json({success: false, message: "Unknown error."})
    }
}

exports.list = async (req, res) => {
    try {
        const {user_id} = req.query;
        if (!user_id) return res.status(400).json({success: false, message: "No user id was sent."})

        const query = await Playlist.find({user_id: user_id});
        if (!query) return res.status(404).json({success: false, message: `No playlists was found.`})

        return res.status(200).json(query)
    } catch (e) {
        console.error(e)
        res.status(500).json({success: false, message: "Unknown error."})
    }
}

exports.update = async (req, res) => {
    try {
        const {user_id, tracks, name} = req.body;
        if (!user_id) return res.status(400).json({success: false, message: "No user id was sent."})
        if (!tracks) return res.status(400).json({success: false, message: "No tracks was sent."})
        if (!name) return res.status(400).json({success: false, message: "No name was sent."})

        const query = await Playlist.findOne({user_id: user_id, name: name});
        if (!query) return res.status(404).json({success: false, message: `playlist with name ${name} was not found.`})

        query.tracks = query.tracks.concat(tracks)
        query.save();

        return res.status(200).json({
            success: true,
            message: `Updated playlist ${name} now containing ${query.tracks.length} songs.`
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({success: false, message: "Unknown error."})
    }
}

exports.delete = async (req, res) => {
    try {

        const {user_id, name} = req.body;
        if (!user_id) return res.status(400).json({success: false, message: "No user id was sent."})
        if (!name) return res.status(400).json({success: false, message: "No name was sent."})

        const query = await Playlist.findOne({user_id: user_id, name: name});
        if (!query) return res.status(404).json({success: false, message: `playlist with name ${name} was not found.`})

        await Playlist.deleteOne({_id: query._id})

        return res.status(200).json({success: true, message: `playlist with name ${name} was deleted.`})
    } catch (e) {
        console.error(e)
        res.status(500).json({success: false, message: "Unknown error."})
    }
}


exports.share = async (req, res) => {
    const {raw} = req.query;
    if (raw) {
        const {id} = req.params;
        if (!id) return res.status(400).json({success: false, message: "No id was sent."})

        const query = await Playlist.findOne({_id: id});
        if (!query) return res.status(404).json({success: false, message: `playlist with id ${id} was not found.`})

        return res.status(200).json(query)
    } else {
        const {decode} = require("@lavalink/encoding")
        const {id} = req.params;

        if (!id) return res.status(404).send("<h1>No playlist sent!</h1>")

        const query = await Playlist.findOne({_id: id});
        if (!query) return res.status(404).send("<h1>No playlist Found</h1>")

        const tracks = query.tracks;

        return res.render("index.ejs", {tracks: tracks.map(x => decode(x)), name: query.name})
    }
}

