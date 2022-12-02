var mongoose = require('mongoose');
const {Schema} = mongoose;
const tasks = require('./task');

/**
 * collection schema
 * 'allTasks' - string[] - storing tasks ID string
 */

var CollectionSchema = new Schema({
    allTasks:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "tasks",
        dropDups: true,
    }
})

module.exports = mongoose.model('collection', CollectionSchema);