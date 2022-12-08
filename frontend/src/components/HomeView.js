import { Button, Card, Nav, Col, Row, Container, ListGroup, Form, InputGroup } from "react-bootstrap";
import { React, useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeView.css";
import axios from "axios";
import userPic from "./assets/defaultUser.png";
import TaskModal from "./TaskModal";
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
		window.location.href = "/";
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
		if (token) {
			fetch("http://localhost:" + port + "/api/collection", {
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
		// get task from db for each collection
		const loadTask = async ()=>{
			console.log("===loadTask=== recvData len: "+recvData.length);
			for (const coll of recvData){
				for (const taskId of coll.allTasks){
					try{
						const response = await axios.get(
							"http://localhost:" + port + "/api/task/"+taskId,
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
	 *  Handler function: all interactions with backend 
	 *  ================================================================================
	 */  
	const handleSubmit = async (operation, e, input_id) => {
		if(operation==="newCollection"){
			if(e) e.preventDefault();

			console.log("handleSubmit: newCollection");
			axios.post(
				"http://localhost:" + port + "/api/collection",
				{ name: collectionName },
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
			const before = taskId_name.get(input_id).completed;
			const after = !before;
			console.log("handleSubmit: completeTask. before: "+before+". after: "+after);
			//1 change data in db
			axios.put(
				"http://localhost:" + port + "/api/task/"+input_id,
				{ completed: after.toString() },
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(function (response) {
				console.log("===Task completeTask success==="+JSON.stringify(response.data.data));
				
				//2 refresh local data
				taskId_name.get(input_id).completed = after
			})
			.catch(function (error) {
				console.log("===Task completeTask FAILED==="); 
				console.log(error); 
			})
		}
		else if(operation==="newTask"){
			setSubmitDone(false)
			const taskName = currInputFieldVal;
			const token = localStorage.getItem('token');
			const user_raw = jwt_decode(token);
			const taskUser = user_raw.email;
			console.log("handleSubmit: newTask. taskName: "+taskName+". taskUser: "+taskUser);
			//1 change data in db
			await axios.post(
				"http://localhost:" + port + "/api/task",
				{ 
					name: taskName,
					assignedUser: taskUser,
					assignedCollection: input_id
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
					"http://localhost:" + port + "/api/collection/"+input_id,
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
		axios.get(`http://localhost:8080/api/task/${task}`,{ headers: { "Access-Control-Allow-Origin": "*" }, })
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
		<TaskModal onClose={handleClose} task={currentTask}/>
	)}
	<Row>
{/* NAV BAR right */}
		<Col xs={6} md={4} className="col-leftside-container">
			<Row className="to-center" id="row-leftside-container">
				<div className="userPic-container">
					<img src={userPic} id="userPic" alt=""></img>
				</div>
			</Row>
			
			<Row className="to-center"> 
				<div className="sideBar-container"> 
					<Nav fill variant="pills" defaultActiveKey="/home" className="flex-column" id="sideBar">
						<Nav.Item>
							<Nav.Link href="/home">Home</Nav.Link>
							{/* <Nav.Link>Home</Nav.Link> */}
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="link-1" onClick={() => {logout()}}>Logout</Nav.Link>
						</Nav.Item> 
					</Nav> 
				</div>
			</Row>
		</Col>

{/* MAIN CONTENT left   onSubmit={onFormSubmit}*/}
		<Col xs={12} md={8}> <form className="login-card" >
			<div className="mainContent-div" style={{height:scrollPosition}}> <Container className="mainContent-container">
{/* + sign to add new collection */}
			<Row sm>  
				<Card className="plus-addNewCollection" style={{ width: '40rem' }}>
					<Card.Body className="mainContent-plussign">  
						<Form.Control style={{ width: '20rem' }} name="collectionName" type="text" placeholder="Enter Your New Collectipn Name"
							onChange={(e) => setCollectionName(e.target.value)} />
						<Button className="mainContent-plussign" variant="primary" onClick={(e) => handleSubmit("newCollection", e, 0)}>+</Button>
					</Card.Body>
				</Card>
			</Row>

			<Row lg={2} style={{height: cardheight}}>
			{ //Array.from({ length: 0 }) submitDone===true &&
				allCollection.length>0 && allCollection.map((aColl) => (
					<Col lg className="mainContent-card" ref={elementRef} >
						<div className="box no-cursor">
							<Card style={{ width: '14rem' }} > 
								<Card.Title className="mainContent-card-title">{aColl['name']}</Card.Title> 
								<ListGroup variant="flush" className="mainContent-taskList" >
								<Scrollbars style={{ height: 260 }} className="mainContent-scrollbar">
								{
									 aColl && aColl.allTasks && aColl.allTasks.map((taskId) => (
											<div key={taskId}> 
												<ListGroup.Item eventKey={taskId} >
													<div className="item-content" >  
														<Container><Row>
															<Col xs lg="2">
																<Form.Check.Input 
																	type='checkbox' 
																	defaultChecked = {taskId_name.get(taskId).completed}
																	onClick={(e) => handleSubmit("completeTask", e, taskId)}/>
															</Col>
															<Col>
																<div inline onClick={() => {handleClick(taskId)}}>
																	{taskId_name.get(taskId).name}
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
										onClick={(e) => handleSubmit("newTask", e, aColl['_id'])}
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