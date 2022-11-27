import mongoose from "mongoose";

const Schema = mongoose.Schema;

const user = new Schema({
    name: { type: String },
    totalPoints: { type: Number, default: 0 }
});

const settings = new Schema({
    songsAmount: { type: Number, default: 10, min: 0, max: 120 },
    songPlayingTime: { type: Number, default: 10, min: 0, max: 120 }
});

const Lobby = new Schema({
    admin: { type: String, required: true },
    users: [user],
    settings: settings,
}, {
    collection: "Lobby",
    _id: true,
    versionKey: false,
});

export default mongoose.model("Lobby", Lobby);