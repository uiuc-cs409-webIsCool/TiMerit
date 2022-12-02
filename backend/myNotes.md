## schema 2 way reference relationships
|collection |   task  |   tag   |
|---|---|---|
|[taskID1, ID2] -->   |--> _id| |
|            |    _id <--|<-- [taskID1, ID2]|

## Task API
1. GET - get all tasks
2. DELETE by ID - input an ID, delete it if found
3. POST - create new task
