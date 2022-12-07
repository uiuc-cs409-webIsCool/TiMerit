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
// console.log("port: " + port);


function Home() {
	let [currentTask, setCurrentTask] = useState(null);
	let [allCollection, setAllCollection] = useState([]);
	let [taskId_name, setTaskId_name] = useState(new Map()); //KEY: id, VALUE: name
	let [newCollection, setNewCollection] = useState("");
	let [collectionName, setCollectionName] = useState("");
	let [showModal, setShowModal] = useState(false);
	const navigate = useNavigate() 
	let [success, setSuccess] = useState(false);
	let [fail, setFail] = useState(false);
	


	async function test() {
		// const req = await fetch("http://localhost:8080/api/test", {
		// 	headers: {
		// 		"x-access-token": localStorage.getItem("token")
		// 	},
		// })

		// const data = req.json();
		// console.log(data);
	}

	// Side effects:
	useEffect(() => {	
		const token = localStorage.getItem("token");
		if (token) {
			// console.log(token);
			const user = jwt_decode(token);
			// console.log(user);

			if (!user) {
				localStorage.removeItem('token')
				navigate.replace('/')
			} else {
                // loadCollection()
			} 
		}

		var recvData;
		// get collection from db
		const loadCollection = async ()=>{
			await axios.get(
				"http://localhost:" + port + "/api/collection",
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(function (response) {
				console.log("===Collection Get success===");
	
				if (response.data.data) {
					recvData = response.data.data;
					setAllCollection(recvData)
					// recvData.length>0 && recvData.map((coll)=>(
					// 	setAllCollection(allCollection => [...allCollection, coll])
					// ))
	
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
		};
	
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
			setSuccess(true)
			console.log("===!!!!Task get FINISHED!!!!==="); 
		};

		loadCollection()
	}, [])

	/**
	 * Handler function to show modals
	 */

	// Due to the asynchronous nature of the axios get call, if I update the current task
	// right within the function, it's not updated yet. Thus, it's null.
	function handleClick(task) {
		axios.get(`http://localhost:8080/api/task/${task}`,{ headers: { "Access-Control-Allow-Origin": "*" }, })
		.then(function(response) {
			setCurrentTask(response.data.data);
		})
    }
	// Only show the modal after the current task has been updated and is not null
	useEffect(() => {
		if (currentTask != null) {
			setShowModal(true);
		}
	  }, [currentTask]);

    function handleClose() {
        setShowModal(false);
    }

	// If a user click save button to close a TaskModal, need to call a post request to save data.
	function handleSave(task) {

	}



	// get collection from db
	useEffect(()=>{
		axios.get(
			"http://localhost:" + port + "/api/collection",
			{ headers: { "Access-Control-Allow-Origin": "*" }, } )
		.then(function (response) {
			if (response) {
			// console.log("===Collection Get success===");
				// console.log(recvData);
				// console.log(allCollection);
				setSuccess(true);
				setTimeout(() => {
					setSuccess(false);
				}, 3000);
			} else {
				console.log("===Collection get FAILED. not found response.data.data._id==="); 
			}
		})
		.catch(function (error) {
			// console.log("===Collection get FAILED==="); 
			console.log(error);
			setFail(true);
			setTimeout(() => {
				setFail(false);
			}, 3000);
		})
	} ,[]);

// background height - dynamically change based on scroll position
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

 
	var cardheight=1000;
	const elementRef = useRef(null);  
	// console.log("scrollPosition "+scrollPosition);


// remap after new collection inserted
	useEffect(() => { 
		setAllCollection([...allCollection, newCollection]);
	}, [newCollection]);


	const handleSubmit = (operation, e) => {
		if(operation==="newCollection"){
			console.log("handleSubmit: newCollection");
			axios.post(
				"http://localhost:" + port + "/api/collection",
				{ name: collectionName },
				{ headers: { "Access-Control-Allow-Origin": "*" }, } )
			.then(function (response) {
				// console.log("===Collection create success==="+JSON.stringify(response.data.data)); 
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
							<Nav.Link eventKey="link-1">Logout</Nav.Link>
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