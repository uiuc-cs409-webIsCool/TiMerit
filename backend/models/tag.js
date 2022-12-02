var mongoose = require('mongoose');
const {Schema} = mongoose;
const task = require('./task');

/**
 * tag schema
 * 'name' - string - REQUIRED
 * ‘allTasks' - string[] - default to []
 */

var TagSchema = new Schema({
    name:{
        type: String,
        default: "",
        required: true,
        unique: true,
    },
    allTasks:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "task",
        dropDups: true,
    }
})

module.exports = mongoose.model('tag', TagSchema);