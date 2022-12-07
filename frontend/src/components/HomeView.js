import { Button, Card, Nav, Col, Row, Container, ListGroup, Form } from "react-bootstrap";
import { React, useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeView.css";
import axios from "axios";
import userPic from "./assets/defaultUser.png";
import Draggable, {DraggableCore} from 'react-draggable'; 
import jwt_decode from "jwt-decode";
import { json } from "react-router-dom";
var port = process.env.PORT || 8080;
console.log("port: " + port);


function Home() {
	// Define Hooks:
	const [blocks, setBlocks] = useState([
		{id: 1, content: "Block 1"},
		{id: 2, content: "Block 2"},
		{id: 3, content: "Block 3"},
		{id: 4, content: "Block 4"}
	]);


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
			console.log(token);
			const user = jwt_decode(token);
			console.log(user);

			if (!user) {
				localStorage.removeItem("token");
				window.location.href = "/";
			} else {
				test();
			}
		}
	}, [])



	/**
	 * Handler functions:
	 * */ 
	// To handle the start of a drag operation
	const handleDragStart = (event, id) => {
		event.dataTransfer.setData("id", id);
	}

	// To handle the drag operation as the mouse moves
	const handleDragOver = (event, id) => {
		// Prevent default behavior to allow the element to be dropped
		event.preventDefault();
	}

	// To handle the drop event when it occurs
	const handleDrop = (event, targetId) => {
		// When dragging finished, and store the updated blocks.
		const updatedBlocks = blocks.map((block1) => {
			// TODO: the following is difficult, need to find the closestBlock to change the position when mouse drop down the block
			if (block1.id === targetId) {
            // Get the x and y coordinates of the mouse when the drag operation finished
            // const x = event.clientX;
            // const y = event.clientY;
			// let closestBlock;
            // let minDistance = Number.MAX_SAFE_INTEGER;

			// blocks.forEach((block2) => {
			// 	// Get the bounding rect of the block
			// 	const rect = block2.getBoundingClientRect();

			// 	// Calculate the distance between the block and the mouse coordinates
			// 	const distance = Math.sqrt(
			// 		Math.pow(rect.x - x, 2) +
			// 		Math.pow(rect.y - y, 2)
			// 	);

			// 	// If the distance is smaller than the current minimum distance, update closestBlock and minDistance
			// 	if (distance < minDistance) {
			// 		closestBlock = block2;
			// 		minDistance = distance;
			// 	}
			// });
			// const index = blocks.indexOf(closestBlock);
            // blocks.splice(index, 0, block1);
		}
		return block1;
        });
        setBlocks(updatedBlocks);
	}




	// Let blocks be the params of Array.from() and return every the same block from it.
	// Thus, it generates a new Array as the copy of the blocks. 
	const groupedBlocks = Array.from(blocks, (block) => 
	block).reduce((result, value, index, array) => { // result is the current array, index is the index of the current block
		// array is the same as blocks.
		if (index % 2 === 0) {
			result.push(array.slice(index, index + 2));
		}

		return result;
	}, []);
	// groupedBlocks is an array of arrays. [[Block1, Block2], [[Block3, Block4]].


	let [allCollection, setAllCollection] = useState([]);
	let [newCollection, setNewCollection] = useState("");
	let [collectionName, setCollectionName] = useState("");
	let [success, setSuccess] = useState(false);
	let [fail, setFail] = useState(false);
	
	
	// get collection from db
	useEffect(()=>{
		axios.get(
			"http://localhost:" + port + "/api/collection",
			{ headers: { "Access-Control-Allow-Origin": "*" }, } )
		.then(function (response) {
			console.log("===Collection Get success===");

			if (response.data.data) {
				const recvData = response.data.data;
				setAllCollection(recvData)

				console.log(recvData);
				console.log(allCollection);

				setSuccess(true);
				setTimeout(() => {
					setSuccess(false);
				}, 3000);
			}
			else {
				console.log("===Collection get FAILED. not found response.data.data._id==="); 
			}
		})
		.catch(function (error) {
			console.log("===Collection get FAILED==="); 
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


// Card height - dynamically change based on maximum height card
	const [cardheight, setCardHeight] = useState(0);
	const elementRef = useRef(null); 
	useEffect(() => {
		if(elementRef.current) 
			setCardHeight(elementRef.current.clientHeight);
	}, []); 
	console.log("scrollPosition "+scrollPosition+". allCollection.length="+allCollection.length);


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
				console.log("===Collection create success==="+JSON.stringify(response.data.data)); 
				if (response.data.data._id) {
					setNewCollection(response.data.data);
					// setAllCollection(allCollection=>[...allCollection, response.data.data._id]);

					setSuccess(true);
					setTimeout(() => {
						setSuccess(false);
					}, 3000);
				}
				else {
					console.log("===Collection create FAILED. not found response.data.data._id==="); 
				}
			})
			.catch(function (error) {
				console.log("===Collection create FAILED==="); 
				console.log(error);
				setFail(true);
				setTimeout(() => {
					setFail(false);
				}, 3000);
			})
		}; 
		if(e) e.preventDefault();
	};
	const onFormSubmit = (e) => e.preventDefault();  


	

return (
	<div className="outer-container-div">
	<Container className="outer-container">
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
							<Nav.Link eventKey="link-1">Logout</Nav.Link>
						</Nav.Item> 
					</Nav> 
				</div>
			</Row>
		</Col>

{/* MAIN CONTENT left */}
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
			{ //Array.from({ length: 0 })
				allCollection.length>0 && allCollection.map((aColl, idx) => (
					<Col lg className="mainContent-card" ref={elementRef}>
						<Draggable grid={[100, 100]} handle="strong">
						<div className="box no-cursor">
							<Card style={{ width: '14rem' }}> 
								<Card.Header> <strong className="cursor"><div>Drag here</div></strong> </Card.Header>
								<Card.Title className="mainContent-card-title">{aColl['name']}</Card.Title>
								<ListGroup variant="flush">
								{
									aColl && aColl.allTasks && aColl.allTasks.map((task) => (
										<ListGroup.Item eventKey={task}>task id is: {task}</ListGroup.Item>
									))
								}
								</ListGroup>
							</Card>
						</div>
						</Draggable>
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