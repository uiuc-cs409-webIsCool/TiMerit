# Schema Definition

### Collection schema
1. 'name' - string - REQUIRED
2. 'allTasks' - objectID[] - storing tasks ID string

###  Tag schema
1. 'name' - string - REQUIRED
2. ‘allTasks' - objectID[] - default to []

###  Task schema
1. 'name' - string - REQUIRED
2. 'tag' - objectID - the _id field of its tag - default to "" 
3. 'duration' - number of minutes - default to 0 - unchangeable
4. 'description' - string
5. 'date' - Date of creation - default to today's date - unchangeable
6. 'assignedCollection' - objectID - the _id field of its collection - default to "" - REQUIRED

---

# Supported API Calls
## schema 2 way reference relationships
|collection |   task  |   tag   |
|---|---|---|
|[taskID1, ID2] <-->   |<--> _id| |
|            |    _id <-->|<--> [taskID1, ID2]|

### Tag API
1. GET - get all tags
2. DELETE by ID - input an ID, delete it if found
3. POST - create new tag
4. PUT - modify name field

### Task API
1. GET - get all tasks
2. GET by ID - input an ID, GET it if found. 
3. DELETE by ID - input an ID, delete it if found. Note: will also delete this task from corresponding Tag allTasks[] and Collection allTasks[]
4. POST - create new task
5. PUT - modify any field

### Collection API
1. GET - get all collection
2. DELETE by ID - input an ID, delete it if found
3. POST - create new collection
4. PUT - modify name field

---

# File Structure and Environment Setup

Please read this [post](https://stackoverflow.com/questions/51126472/how-to-organise-file-structure-of-backend-and-frontend-in-mern) for an introduction of the file structure of a MERN stack project. One thing to notice is that I have added `node_modules` directory into the .gitignore file so that installed packages won't be pushed to the remote. It seems as long as package json file is pushed, it will automatically synchronize the environment.

# User Authentication

The idea is that when users switch to the different Route (page), frontend should remember them, so that server can still fetch related data for that specific user. Thus, a token is saved at the localStorage. And it can be decoded to a unique identifier for that user (in this case the email).

[中文解析](https://www.infoq.cn/article/xeirmzbscwxjoyc3hflv)

## An example of log in process

1. In the frontend, when user clicks login button, login() sends a post request to the route api/login.
2. In the backend, after find the valid email in the database, jwt will encrypt the email address and send it to the front end.
3. In login(), check if the data sent from backend is not empty, it stores the token in the localStorage. Then it navigates to the homepage.
4. In the homepage(frontend), when making request, pass token through headers.
5. When the backend deals with the request from home page, it first decodes the token to get the email and knows from which user this request comes.

# TODOs

- [x] Define database model
  - [x] User
  - [x] Collection
  - [x] Task
- [ ] Frontend layout
  - [x] Signup layout
  - [x] Welcome page layout
  - [ ] Homepage layout

- [ ] Homepage design
- [ ] Details of Signup function
  - [ ] Throw error prompt to user if email is registered
  - [ ] Use regex to inspect whether the password is valid. (length>8, contains at least 1 capital letter, etc.)
  - [ ] Email authentication

- [ ] Details of Login function
  - [ ] Throw error prompt to user if email and password are not matched.
  - [ ] Provide forget password option





# Requirement of the project
1. Need to implement user authentication.

2. Understand the heat map of components distribution. (Slide 16 page 49)

3. Font type should not be too much. Body paragraph should be easy to read.

4. How is in experience level, your app will be different or improved from the current solutions. Looking for the motivation of design decision.

5. Do not have to use real data. We could manually enter data.

6. App competition is separated from grading.

   

# Reference
1. A very good video to help start the project. [MERN Stack Full Tutorial](https://www.youtube.com/watch?v=CvCiNeLnZ00) from Dave.
2. Another introduction video of [MERN stack project](https://www.youtube.com/watch?v=VsUzmlZfYNg). (easier)
3. Signup and login are implemented by reference of: [User authentication, JWT, Node.js, MongoDB, React and more](https://www.youtube.com/watch?v=Ejg7es3ba2k)
4. DRAGGABLE package: https://www.npmjs.com/package/react-draggable 
5. Use Authentication: [The best explanation of JWT on YouTube](https://www.youtube.com/watch?v=soGRyl9ztjI)
