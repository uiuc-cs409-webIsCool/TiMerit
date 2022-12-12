import { Button, Card, Nav, Col, Row, Container, ListGroup, Form, InputGroup } from "react-bootstrap";
import { React, useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeView.css";
import axios from "axios";
import userPic from "./assets/defaultUser.png";
import trashPic from "./assets/trash-can-icon.png";
import TaskModal from "./TaskModal";
import NavBar from "./NavBar";
// import Draggable, {DraggableCore} from 'react-draggable'; 
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';

var port = process.env.PORT || 8080;
console.log("port: " + port);


function Home() {

	/** ================================================================================
	 * Hooks setup + value initialization
	 *  ================================================================================
	 */
	let [allCollection, setAllCollection] = useState([]);
	let [taskId_name, setTaskId_name] = useState(new Map()); //KEY: id, VALUE: name
	let [newCollection, setNewCollection] = useState("");
	let [newTaskId, setNewTaskId] = useState("");
	let [newTaskInfo, setNewTaskInfo] = useState("");
	let [collectionName, setCollectionName] = useState("");
	let [success, setSuccess] = useState(false);
	let [currentTask, setCurrentTask] = useState(null);
	let [showModal, setShowModal] = useState(false);
	let [submitDone, setSubmitDone] = useState(true);
	let [currInputFieldVal, setCurrInputFieldVal] = useState("");

	const navigate = useNavigate(); 
	var cardheight=1000;
	const elementRef = useRef(null);  
	
	// console.log(allCollection);
	// console.log(taskId_name);


	/** ================================================================================
	 *  Helper functions on Nav Bar:
	 *  ================================================================================
	 */
	function logout() {
		// Delete the token
		localStorage.removeItem("token");
		// Redirect to welcome page
		// window.location.href = "/";
		navigate("/");
	}


	/** ================================================================================
	 *  useEffect
	 *  fetch data at boot up:
	 *  ================================================================================
	 */

	// TODO: Pass header in get request.
	useEffect(() => {
		var recvData;
		const token = localStorage.getItem("token");
		console.log("Get 1");
		if (token) {
			fetch("https://timerit.onrender.com/api/collection", {
				method: "GET",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"x-access-token": token
				  }
				}
			).then(response => {
				return response.json();
			})
			.then(data => {
				console.log("===Collection Get success===");
				if (data) {
					recvData = data.data;
					setAllCollection(recvData)
					var found = false;

					//if didn't find uncategorized collection, create one.
					recvData.map(coll =>{
						if(coll.name === "Uncategorized") 
							found = true;
					})

					//create new collection named Uncategorized
					if(!found){
						handleSubmit("newCollection", null, ["Uncategorized"]);
					}
					console.log(recvData);
					console.log(allCollection); 
	
					loadTask()
				}
				else {
					console.log("===Collection get FAILED. not found response.data.data._id==="); 
				}
			})
			.catch(function (error) {
				console.log("===Collection get FAILED==="); 
				console.log(error); 
			})
		} else {
			logout();
		}
		console.log("Get 2");
		// get task from db for each collection
		const loadTask = async ()=>{
			console.log("===loadTask=== recvData len: "+recvData.length);
			for (const coll of recvData){
				for (const taskId of coll.allTasks){
					try{
						const response = await axios.get(
							"https://timerit.onrender.com/api/task/"+taskId,
							{ headers: { "Access-Control-Allow-Origin": "*" }, } )

						if(response){
							if (response.data.data) {
								console.log("===Task Get success===taskId: "+taskId); 
								// const taskName = response.data.data.name;
								const taskInfo = {	name: response.data.data.name, 
													assignedUser: response.data.data.assignedUser, 
													completed: response.data.data.completed}
								setTaskId_name(taskId_name.set(taskId, taskInfo));
							}
							else {
								console.log("===Task get FAILED==="); 
							}
						}
					} catch(error){
						console.log("===Task get FAILED==="); 
						console.log(error); 
					}
				}
			}
			setSuccess(true)
			console.log("===!!!!Task get FINISHED!!!!==="); 
		};
		console.log("Finish gets");
	}, [])

	/** ================================================================================
	 *  useEffect 
	 *  background height - dynamically change based on scroll position
	 *  ================================================================================
	 */
	const [scrollPosition, setScrollPosition] = useState(920);
	const handleScroll = () => {
		const position = window.pageYOffset;
		setScrollPosition(position + 920);
	};
	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	/** ================================================================================
	 *  useEffect 
	 *  remap after new collection/task inserted
	 *  ================================================================================
	 */
	useEffect(() => { 
		setAllCollection([...allCollection, newCollection]);
	}, [newCollection]);
	useEffect(() => { 
	}, [allCollection]);
	useEffect(() => { 
		setTaskId_name(taskId_name.set(newTaskId, newTaskInfo));
	}, [newTaskInfo]);

	/** ================================================================================
	 *  useEffect 
	 *  Update local data after modal is closed
	 *  ================================================================================
	 */
	const updateTaskName = (taskId, newTaskName) => {
		var oldTaskInfo = taskId_name.get(taskId)
		oldTaskInfo.name = newTaskName
		setNewTaskId(taskId)
		setNewTaskInfo(oldTaskInfo)
	}


	
	/** ================================================================================
	 *  Handler function: all interactions with backend 
	 *  ================================================================================
	 */  
	const handleSubmit = async (operation, e, input_id) => {
		if(operation==="newCollection"){
			if(e) e.preventDefault();

			const collName = (input_id.length>0 && input_id[0]==="Uncategorized") ? "Uncategorized" : collectionName;

			console.log("handleSubmit: newCollection");
			axios.post(
				"https://timerit.onrender.com/api/collection",
				{ name: collName },
				{ headers: { "Access-Control-Allow-Origin": "*" , "x-access-token": localStorage.getItem("token")}, } )
			.then(function (response) {
				console.log("===Collection create success==="+JSON.stringify(response.data.data)); 
				if (response.data.data._id) {
					setNewCollection(response.data.data); 
				}
				else {
					console.log("===Collection create FAILED. not found response.data.data._id==="); 
				}
			})
			.catch(function (error) {
				console.log("===Collection create FAILED==="); 
				console.log(error); 
			})
		}
		else if(operation==="completeTask"){
			const completedTaskId = input_id[0]
			const before = taskId_name.get(input_id[0]).completed;
			const after = !before;
			console.log("handleSubmit: completeTask. before: "+before+". after: "+after);
			//1 change data in db
			axios.put(
				"https://timerit.onrender.com/api/task/"+completedTaskId,
				{ completed: after.toString() },
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(function (response) {
				console.log("===Task completeTask success==="+JSON.stringify(response.data.data));
				
				//2 refresh local data
				taskId_name.get(completedTaskId).completed = after
			})
			.catch(function (error) {
				console.log("===Task completeTask FAILED==="); 
				console.log(error); 
			})
		}
		else if(operation==="updateCollName"){
			const toUpdateCollId = input_id[0] 
			const toUpdateCollName = input_id[1] 
			console.log("handleSubmit: updateCollName. toUpdateCollId: "+toUpdateCollId+". toUpdateCollName: "+toUpdateCollName);

			//1 change data in db
			axios.put(
				"https://timerit.onrender.com/api/collection/"+toUpdateCollId,
				{ name: toUpdateCollName },
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(function (response) {
				console.log("===Collection updateCollName success==="+JSON.stringify(response.data.data));
				
				//2 update local data
				// setAllCollection(allCollection.filter(aColl => aColl._id !== toUpdateCollId))
				// setNewCollection(response.data.data)
				Object.values(allCollection).map(aColl => {
					if(aColl._id === toUpdateCollId)
						aColl.name = toUpdateCollName
				})
				console.log(allCollection)

			})
			.catch(function (error) {
				console.log("===Collection updateCollName FAILED==="); 
				console.log(error); 
			})
		}
		else if(operation==="newTask"){
			setSubmitDone(false)
			const assignedCollectionId = input_id[0]
			const taskName = currInputFieldVal;
			const token = localStorage.getItem('token');
			const user_raw = jwt_decode(token);
			const taskUser = user_raw.email;
			console.log("handleSubmit: newTask. taskName: "+taskName+". taskUser: "+taskUser+". assignedCollectionId: "+assignedCollectionId );
			//1 change data in db
			await axios.post(
				"https://timerit.onrender.com/api/task",
				{ 
					name: taskName,
					assignedUser: taskUser,
					assignedCollection: assignedCollectionId
				},
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(async function (response) {
				console.log("===Task create success==="+JSON.stringify(response.data.data));
				
				const taskId = response.data.data._id;

				//2 refresh local data
				const taskInfo = {	
					name: response.data.data.name, 
					assignedUser: response.data.data.assignedUser, 
					completed: response.data.data.completed
				};
				// setTaskId_name(taskId_name.set(taskId, taskInfo))
				setNewTaskId(taskId);
				setNewTaskInfo(taskInfo);

				//3 insert new task to collection local data
				await axios.get(
					"https://timerit.onrender.com/api/collection/"+assignedCollectionId,
					{ headers: { "Access-Control-Allow-Origin": "*" }, } )
					.then(function (response) {
			
						if (response.data.data) {
							const recvData = response.data.data; 
							for(let i=0; i<allCollection.length; i++){
								if(allCollection[i]._id==assignedCollectionId){
									allCollection[i] = recvData
									console.log("===Collection:id Get success=== recvData"+JSON.stringify(recvData));
									console.log(allCollection)
									break
								}
							}
							
						}
						else {
							console.log("===Collection:id get FAILED. not found response.data.data._id==="); 
						}
					})
					.catch(function (error) {
						console.log("===Collection:id get FAILED==="); 
						console.log(error); 
					})

					setSubmitDone(true)
			})
			.catch(function (error) {
				console.log("===Task create FAILED==="); 
				console.log(error); 
				setSubmitDone(true)

			})
		}
		else if(operation==="deleteTask"){
			setSubmitDone(false) 
			const toDeleteTaskID = input_id[0]
			const toDeleteTaskID_collId = input_id[1]
			console.log("handleSubmit: deleteTask. taskId: "+toDeleteTaskID);

			//1 change data in db
			await axios.delete(
				"https://timerit.onrender.com/api/task/"+toDeleteTaskID,
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(async function (response) {
				console.log("===Task delete success==="+JSON.stringify(response.data.data));
				
				//2 refresh local data
				if(!taskId_name.delete(toDeleteTaskID)) console.log("Task delete FAILED in map struct")

				//3 insert new task to collection local data
				await axios.get(
					"https://timerit.onrender.com/api/collection/"+toDeleteTaskID_collId,
					{ headers: { "Access-Control-Allow-Origin": "*" }, } )
					.then(function (response) {
			
						if (response.data.data) {
							const recvData = response.data.data; 
							for(let i=0; i<allCollection.length; i++){
								if(allCollection[i]._id==input_id){
									allCollection[i] = recvData
									console.log("===Collection:id Get success=== recvData"+JSON.stringify(recvData));
									console.log(allCollection)
									break
								}
							}
							
						}
						else {
							console.log("===Collection:id get FAILED. not found response.data.data._id==="); 
						}
					})
					.catch(function (error) {
						console.log("===Collection:id get FAILED==="); 
						console.log(error); 
					})

					setSubmitDone(true)
			})
			.catch(function (error) {
				console.log("===Task create FAILED==="); 
				console.log(error); 
				setSubmitDone(true)

			})
		}
		else if(operation==="deleteCollection"){
			setSubmitDone(false) 
			const toDeleteCollID = input_id[0]
			console.log("handleSubmit: deleteCollection. collId: "+toDeleteCollID);

			//1 change data in db
			await axios.delete(
				"https://timerit.onrender.com/api/collection/"+toDeleteCollID,
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(async function (response) {
				console.log("===deleteCollection success==="+JSON.stringify(response.data.data));
				
				//2 refresh local data
				setAllCollection((allCollection)=>allCollection.filter(aColl => aColl._id !== toDeleteCollID ))
				
				setSubmitDone(true)
			})
			.catch(function (error) {
				console.log("===deleteCollection FAILED==="); 
				console.log(error); 
				setSubmitDone(true)

			})
		}
	};
	const onFormSubmit = (e) => e.preventDefault();  





	/** ================================================================================
	 *  Handler function to show modals
	 *  ================================================================================
	 */ 

	// Due to the asynchronous nature of the axios get call, if I update the current task
	// right within the function, it's not updated yet. Thus, it's null.
	function handleClick(task) {
		console.log("===in handleClick===")
		axios.get(`https://timerit.onrender.com/api/task/${task}`,{ headers: { "Access-Control-Allow-Origin": "*" }, })
		.then(function(response) {
			setCurrentTask(response.data.data);
			console.log("===get task modal info success!==="+JSON.stringify(response.data.data))
		})
    }
	function handleClose() {
        setShowModal(false);
    }
	// If a user click save button to close a TaskModal, need to call a post request to save data.
	function handleSave(task) {
	}
	// Only show the modal after the current task has been updated and is not null
	useEffect(() => {
		if (currentTask != null) {
			setShowModal(true);
		}
	  }, [currentTask]);


	/** ================================================================================
	 *  Return
	 *  ================================================================================
	 */
if (success === false) {
    return <>Still loading...</>;
}
return (
	<div className="outer-container-div">
	<Container className="outer-container">
	{showModal && (
		<TaskModal onClose={handleClose} task={currentTask} update_name={updateTaskName}/>
	)}
	<Row>
{/* NAV BAR left */}
		<NavBar/>

{/* MAIN CONTENT right   onSubmit={onFormSubmit}*/}
		<Col xs={12} md={9}> <form className="login-card" >
			<div className="mainContent-div" style={{height:scrollPosition}}> <Container className="mainContent-container">
{/* + sign to add new collection */}
			<Row sm className="mainContent-row">  
				<Card className="plus-addNewCollection" style={{ width: '35rem' }}>
					<Card.Body className="mainContent-plussign">  
						<Form.Control style={{ width: '20rem' }} name="collectionName" type="text" placeholder="Enter Your New Collection Name"
							onChange={(e) => setCollectionName(e.target.value)} />
						<Button className="mainContent-plussign" variant="primary" onClick={(e) => handleSubmit("newCollection", e, [0])}>+</Button>
					</Card.Body>
				</Card>
			</Row>

			<Row lg={2} style={{height: cardheight}}>
			{ //Array.from({ length: 0 }) submitDone===true &&
				allCollection.length>0 && allCollection.map((aColl) => (
					<Col lg className="mainContent-card" ref={elementRef} >
						<div className="box">
							<Card style={{ width: '20rem' }} > 
								<Card.Title className="mainContent-card-title">
									<Container> <Row style={{ width: '310px' }}>
									{
										aColl.name !== "Uncategorized" 
										&& 
											<Col md={{ span: 8, offset: 1 }}> 
												<div > 
													<input className="mainContent-collNameInput" type="text" id="name" name="name" 
														defaultValue={aColl['name']}  
														onChange ={(e) => {}}
														onKeyPress={(e) => (e.key == "Enter"&&handleSubmit("updateCollName", e, [aColl._id, e.target.value]))}
													/>
												</div>
											</Col> 
										|| 
											<Col>
												<div> {aColl['name']} </div>
											</Col> 
									}
									{
										aColl.name !== "Uncategorized" && 
										<Col md={{ span: 1, offset: 1 }}>
											<div onClick={(e)=>{handleSubmit("deleteCollection", e, [aColl._id])}}>
												<img src={trashPic} alt="" style={{width:'15px'}}/>
											</div>
										</Col>
									}
									
									</Row></Container>
								</Card.Title> 
								<ListGroup variant="flush" className="mainContent-taskList" >
								<Scrollbars style={{ height: 260 }} className="mainContent-scrollbar">
								{
									 aColl && aColl.allTasks && aColl.allTasks.map((taskId) => (
										taskId_name.get(taskId) && 
											<div key={taskId}> 
												<ListGroup.Item eventKey={taskId} >
													<div className="item-content" >  
														<Container><Row>
															<Col xs lg="2">
																<Form.Check.Input 
																	type='checkbox' 
																	defaultChecked = {taskId_name.get(taskId).completed}
																	onClick={(e) => handleSubmit("completeTask", e, [taskId])}/>
															</Col>
															<Col>
																<div onClick={() => {handleClick(taskId)}}>
																	{taskId_name.get(taskId).name}
																</div>
															</Col>
															<Col xs lg="2">
																<div onClick={(e)=>{handleSubmit("deleteTask", e, [taskId, aColl._id])}}>
																	<img src={trashPic} alt="" style={{width:'15px'}}/>
																</div>
															</Col>
														</Row></Container> 
													</div>
												</ListGroup.Item> 
											</div>	
									))
								}				
								</Scrollbars> 
								<InputGroup className="mainContent-addNewTask-inputGroup">
									<Form.Control
										placeholder="Enter a task..." 
										onChange={(e) => setCurrInputFieldVal(e.target.value)} 
									/>
									<Button 
										onClick={(e) => handleSubmit("newTask", e, [aColl['_id']])}
										variant="outline-secondary" 
										id="button-addon2"> 
											Add 
									</Button>
								</InputGroup>	
								</ListGroup>
							</Card>
						</div>
					</Col>
				))
			}


			</Row> 
			</Container>  </div>
		</form></Col>
		
	</Row>
	</Container>
	</div>
  );
}

export default Home;
