var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

require('../models/collection'); 
require('../models/task');
var taskModel = mongoose.model('task');
var collectionModel = mongoose.model('collection'); 

var uncategorizedCollection_id;

const privateMethods = {
    isUncategorizedExist: async()=>{
        return (await findUncategorizedId()) ? true : false;
    },

    createUncategorizedAndFindId: async()=>{
        const newCollection = mongoose.model('Uncategorized', collectionModel); 
        console.log(newCollection)
    },

    findUncategorizedId: async()=>{
        let doc = await collectionModel.findOne(
            {"name": "Uncategorized"}
        )
        console.log("! findUncategorizedId return id: "+doc._id);
        return doc._id;
    }
}

const collectionController = {
    /**
     * find collection from collID, remove task of taskID from alltask[]
     */
    deleteTask: async(collID, taskID)=>{
        console.log(`! collID is ${collID}. taskID is ${taskID}`); 

        let doc = await collectionModel.updateOne(
            {"_id": collID},
            { "$pull": {"allTasks": taskID}},
            { "new": true}
        )
        console.log(`after deleteTask doc: ${doc}`);
        return doc;
    },
 

    /**
     * update the pendingTasks[] by inserting one task 
     * @param collectionId The collection ID that is the object to update
     * @param taskID The task ID that will be pushed to coll's allTasks[]
     */
     addTask: async (collectionId, taskID) => {
        var taskIDObj = mongoose.Types.ObjectId(taskID); 
        console.log(`! collectionId is ${collectionId}. taskID is ${taskID}. taskIDObj is ${taskIDObj}`);

        let doc = await collectionModel.findOneAndUpdate(
            {"_id": collectionId},
            {"$addToSet": {"allTasks": taskIDObj}},
            {"new": true}
        )
        console.log(`! after addTask doc: ${doc}`);
        return doc;
    },

    isIDExist: async (id) =>{
        let doc = await collectionModel.findOne(
            {"_id": id}
        )
        return doc ? true:false;
    },


    getUncategorizedId: async()=> {
        // if(!uncategorizedCollection_id){
        //     if(!(await privateMethods.isUncategorizedExist))
        //         await privateMethods.createUncategorizedAndFindId;
        //     else
        //         await privateMethods.findUncategorizedId;
        // }

        //check if exist
        let doc = await collectionModel.findOne(
            {"name": "Uncategorized"}
        )
        if(doc) {
            console.log("! findUncategorizedId return id: "+doc._id);

            uncategorizedCollection_id=doc._id;
            return doc._id;
        }
        else {
            //if not exsit create new one.
            const newCollection = await collectionModel.create({ name: 'Uncategorized' });

            console.log("Uncategorized does not exist. create new one: "+ newCollection);

            uncategorizedCollection_id = newCollection._id;
            return newCollection._id;
        }

    },
}

module.exports = collectionController;
