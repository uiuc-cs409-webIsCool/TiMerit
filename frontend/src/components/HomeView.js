import { Button, Card, Nav, Col, Row, Container, ListGroup, Form } from "react-bootstrap";
import { React, useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeView.css";
import axios from "axios";
import userPic from "./assets/defaultUser.png";
import Draggable, {DraggableCore} from 'react-draggable'; 
import jwt_decode from "jwt-decode";
import { json } from "react-router-dom";
import TaskModal from "./TaskModal";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';

var port = process.env.PORT || 8080;


function Home() {
	/** ================================================================================
	 * Hooks setup
	 *  ================================================================================
	 */
	let [currentTask, setCurrentTask] = useState(null);
	let [allCollection, setAllCollection] = useState([]);
	let [taskId_name, setTaskId_name] = useState(new Map()); //KEY: id, VALUE: name
	let [newCollection, setNewCollection] = useState("");
	let [collectionName, setCollectionName] = useState("");
	let [showModal, setShowModal] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(920);

	// Hardcoded values
	var cardheight=1000;
	const elementRef = useRef(null);  
	


	async function test() {
		// const req = await fetch("http://localhost:8080/api/test", {
		// 	headers: {
		// 		"x-access-token": localStorage.getItem("token")
		// 	},
		// })

		// const data = req.json();
		// console.log(data);
	}



	/** ================================================================================
	 *  Helper functions:
	 *  ================================================================================
	 */
	function logout() {
		// Delete the token
		localStorage.removeItem("token");
		// Redirect to welcome page
		window.location.href = "/";
	}



	/** ================================================================================
	 *  Side effects:
	 *  ================================================================================
	 */
	useEffect(() => {	
		const token = localStorage.getItem("token");
		if (token) {
			const user = jwt_decode(token);
		} else {
			window.location.href = "/";
		}

		var recvData;
		// get collection from db
		const loadCollection = async ()=>{
			await axios.get(
				"http://localhost:" + port + "/api/collection",
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(function (response) {
	
				if (response.data.data) {
					recvData = response.data.data;
					setAllCollection(recvData)
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
		};
	
		// get task from db for each collection
		const loadTask = async ()=>{
			for (const coll of recvData){
				for (const taskId of coll.allTasks){
					try{
						const response = await axios.get(
							"http://localhost:" + port + "/api/task/"+taskId,
							{ headers: { "Access-Control-Allow-Origin": "*" }, } )

						if(response){
							if (response.data.data) {
								const taskName = response.data.data.name;
								setTaskId_name(taskId_name.set(taskId, taskName));
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
		};

		loadCollection()
	}, [])

	// Only show the modal after the current task has been updated and is not null
	useEffect(() => {
		if (currentTask != null) {
			setShowModal(true);
		}
	  }, [currentTask]);
	
	// Add scroll event
	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// remap after new collection inserted
	useEffect(() => { 
		setAllCollection([...allCollection, newCollection]);
	}, [newCollection]);



	/** ================================================================================
	 *  Handler function to show modals
	 *  ================================================================================
	 */ 

	// Due to the asynchronous nature of the axios get call, if I update the current task
	// right within the function, it's not updated yet. Thus, it's null.
	function handleClick(task) {
		axios.get(`http://localhost:8080/api/task/${task}`,{ headers: { "Access-Control-Allow-Origin": "*" }, })
		.then(function(response) {
			setCurrentTask(response.data.data);
		})
    }

    function handleClose() {
        setShowModal(false);
    }

	// If a user click save button to close a TaskModal, need to call a post request to save data.
	function handleSave(task) {

	}

	// background height - dynamically change based on scroll position	
	const handleScroll = () => {
		const position = window.pageYOffset;
		setScrollPosition(position + 920);
	};

	const handleSubmit = (operation, e) => {
		if(operation==="newCollection"){
			axios.post(
				"http://localhost:" + port + "/api/collection",
				{ name: collectionName },
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(function (response) { 
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
		}; 
		if(e) e.preventDefault();
	};
	const onFormSubmit = (e) => e.preventDefault();  



	/** ================================================================================
	 *  Return
	 *  ================================================================================
	 */

return (
	<div className="outer-container-div">
	<Container className="outer-container">
	{showModal && (
                <TaskModal onClose={handleClose} task={currentTask}/>
	)}
	<Row>
{/* NAV BAR */}
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

{/* MAIN CONTENT */}
		<Col xs={12} md={8}> <form className="login-card" onSubmit={onFormSubmit}>
			<div className="mainContent-div" style={{height:scrollPosition}}> <Container className="mainContent-container">
{/* + sign to add new collection */}
			<Row sm>  
				<Card className="plus-addNewCollection" style={{ width: '40rem' }}>
					<Card.Body className="mainContent-plussign">  
						<Form.Control style={{ width: '20rem' }} name="collectionName" type="text" placeholder="Enter Your New Collectipn Name"
							onChange={(e) => setCollectionName(e.target.value)} />
						<Button className="mainContent-plussign" variant="primary" onClick={(e) => handleSubmit("newCollection", e)}>+</Button>
					</Card.Body>
				</Card>
			</Row>

			<Row lg={2} style={{height: cardheight}}>
			{
				// Check if allCollection is empty. If not iterate through the collection, and create <Col/> for each item.
				allCollection.length>0 && allCollection.map((aColl, idx) => (
					<Col lg className="mainContent-card" ref={elementRef}>
						<div className="box no-cursor">
							<Card style={{ width: '14rem' }}> 
								<Card.Title className="mainContent-card-title">{aColl['name']}</Card.Title>
								<ListGroup variant="flush" className="mainContent-taskList">
								<Scrollbars style={{ height: 300 }}>
								{
									aColl && aColl.allTasks && aColl.allTasks.map((taskId) => (
										<ListGroup.Item eventKey={taskId} onClick={() => {handleClick(taskId)}}>
											{taskId_name.get(taskId)}
										</ListGroup.Item>
									))
								}								
								</Scrollbars>
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