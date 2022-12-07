## schema 2 way reference relationships
|collection |   task  |   tag   |
|---|---|---|
|[taskID1, ID2] <-->   |<--> _id| |
|            |    _id <-->|<--> [taskID1, ID2]|

## Tag API
1. GET - get all tags
2. DELETE by ID - input an ID, delete it if found
3. POST - create new tag
4. PUT - modify name field

## Task API
1. GET - get all tasks
2. DELETE by ID - input an ID, delete it if found. Note: will also delete this task from corresponding Tag allTasks[] and Collection allTasks[]
3. POST - create new task
4. PUT - modify any field

## Collection API
1. GET - get all collection
2. DELETE by ID - input an ID, delete it if found
3. POST - create new collection
4. PUT - modify name field

## TODO
- [x] default PLUS sign to add new collection
- [x] display all exisitng collection
- [ ] move TASK code inside of collection
- [ ] comment out loadData() before push



// coll && coll.allTasks && coll.allTasks.map(async (taskId)=>(
					
					// await axios.get(
					// 	"http://localhost:" + port + "/api/task/"+taskId,
					// 	{ headers: { "Access-Control-Allow-Origin": "*" }, } )
					// .then(function (response) {
					// 	console.log("===Task Get success===taskId: "+taskId); 
					// 	if (response.data.data) {
					// 		const taskName = response.data.data.name;
					// 		setTaskId_name(taskId_name.set(taskId, taskName));
					// 	}
					// 	else {
					// 		console.log("===Task get FAILED==="); 
					// 	}
					// })
					// .catch(function (error) {
					// 	console.log("===Task get FAILED==="); 
					// 	console.log(error); 
					// })
				// ))
			}
			// recvData.map((coll) => (
				
			// ))