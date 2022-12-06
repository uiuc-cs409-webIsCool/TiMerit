import { Button, Card, Nav, Col, Row, Container, ListGroup, Form } from "react-bootstrap";
import { React, useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeView.css";
import axios from "axios";
import userPic from "./assets/defaultUser.png";
import Draggable, {DraggableCore} from 'react-draggable';
import ReactDOM from 'react-dom'; 
import jwt_decode from "jwt-decode";
import { json } from "react-router-dom";
var port = process.env.PORT || 8080;
console.log("port: " + port);


function Home() {
	async function test() {
		// const req = await fetch("http://localhost:8080/api/test", {
		// 	headers: {
		// 		"x-access-token": localStorage.getItem("token")
		// 	},
		// })

		// const data = req.json();
		// console.log(data);
	}

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

	// const main_ref = useRef();
	// let collection_div = main_ref.current;
	// console.log(collection_div.getBoundingClientRect());
	// let x = collection_div.getBoundingClientRect().x;
	// let y = collection_div.getBoundingClientRect().y;
	// let left = collection_div.getBoundingClientRect().left;
	// let right = collection_div.getBoundingClientRect().right;
	// let top = collection_div.getBoundingClientRect().top;
	// let bottom = collection_div.getBoundingClientRect().bottom;
	


	

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
			<div className="mainContent-div" /*ref={main_ref}*/ style={{height:scrollPosition}}> <Container className="mainContent-container">
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
						<Draggable grid={[100, 100]} handle="strong" /*bounds={{left: left-x, top:top-y, right: right-x, bottom: bottom-y}}*/>
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