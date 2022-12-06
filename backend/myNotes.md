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
- [ ] default PLUS sign to add new collection
- [ ] display all exisitng collection
- [ ] have a PLUS sign inside collection to add new task
- [ ] display all existing tasks of a collection
