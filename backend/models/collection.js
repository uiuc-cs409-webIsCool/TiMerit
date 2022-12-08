var mongoose = require('mongoose');
const {Schema} = mongoose;
const tasks = require('./task');

/**
 * collection schema
 * 'name' - string - REQUIRED
 * 'allTasks' - string[] - storing tasks ID string
 */

var CollectionSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    allTasks:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "tasks",
        dropDups: true,
    },
    assignedUser:{
        type: String,
        // required:true
    }
})

module.exports = mongoose.model('collection', CollectionSchema);