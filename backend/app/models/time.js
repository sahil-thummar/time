const { Schema, model } = require('mongoose');

const timeSchema = new Schema({
    in: { type: Number }, // In Minute
    out: { type: Number }, // In Minute
})

module.exports = model("time", timeSchema);