var mongoose = require('mongoose');
const {Schema} = mongoose;
const collection = require('./collection');
const tag = require('./tag');
const user = require('./user');

/**
 * task schema
 * 'name' - string - REQUIRED
 * 'assignedUser' - string - the _id field of its user
 * 'duration' - number of minutes - default to 0
 * 'description' - string
 * 'date' - Date of creation - default to today's date
 * 'assignedCollection' - string - the _id field of its collection - default to "uncategorized"
 * 'completed' - boolean - default to false
 */

var TaskSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    assignedUser: {
        // type: Schema.Types.ObjectId,
        type: String,
        default: "", 
        ref: "user",
        required: true
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
    },
    completed:{
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('task', TaskSchema);