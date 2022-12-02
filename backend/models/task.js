var mongoose = require('mongoose');
const {Schema} = mongoose;
const collection = require('./collection');
const tag = require('./tag');

/**
 * task schema
 * 'name' - string - REQUIRED
 * 'tag' - string 
 * 'duration' - number of minutes - default to 0
 * 'description' - string
 * 'date' - Date of creation - default to today's date
 * 'assignedCollection' - string - the _id field of its collection - default to ""
 */

var TaskSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    description: String,
    tag: {
        type: Schema.Types.ObjectId,
        default: "", 
        ref: "tag"
    },
    duration: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    assignedCollection:{
        type: Schema.Types.ObjectId,
        default: "", 
        ref: "collection",
        required: true
    }
})

module.exports = mongoose.model('task', TaskSchema);