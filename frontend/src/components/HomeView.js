import { Button, Card, Nav, Col, Row, Container } from "react-bootstrap";
import "./HomeView.css";
import userPic from "./assets/defaultUser.png";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Block from "./Block";

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




  return (
	<div className="outer-container-div">
	<Container className="outer-container">
	<Row>
		{/*  xs={6} means that on a smartphone-sized screen, the component will occupy 6/12 of the container's width, 
		while md={4} means that on a tablet-sized screen, the component will occupy 4/12 of the container's width.*/}
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

		<Col xs={12} md={8}>
			{groupedBlocks.map((blockGroup, index) => (
				<div key={index} className="block-group">
					{blockGroup.map((block) => (
						<Block
						    draggable						
							id={block.id}
							content={block.content}
							onDragStart={handleDragStart}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						/>
					))}
				</div>
			))}
			{/* <div className="mainContent-div">
				<div className="testBlock-todelete">
					<p>test block 1</p>
					<p>test block 2</p>
				</div>

				<Container className="mainContent-container">
					<Row>
						<Col sm>
							<Card style={{ width: '18rem' }}>
								<Card.Body>
									<Card.Title>Card Title</Card.Title>
									<Card.Text>
									Some quick example text to build on the card title and make up the
									bulk of the card's content.
									</Card.Text>
									<Button variant="primary">Go somewhere</Button>
								</Card.Body>
							</Card>
						</Col>
						<Col sm>
							<Card style={{ width: '18rem' }}>
								<Card.Body>
									<Card.Title>Card Title</Card.Title>
									<Card.Text>
									Some quick example text to build on the card title and make up the
									bulk of the card's content.
									</Card.Text>
									<Button variant="primary">Go somewhere</Button>
								</Card.Body>
							</Card>
						</Col>
					</Row> 
				</Container>
			</div> */}
		</Col>
	</Row>
	</Container>
	</div>
  );
}

export default Home;