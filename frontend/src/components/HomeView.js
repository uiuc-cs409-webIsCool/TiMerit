import { Button, Card, Nav, Col, Row, Container } from "react-bootstrap";
import "./HomeView.css";
import userPic from "./assets/defaultUser.png";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";

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






  return (
	<div className="outer-container-div">
	<Container className="outer-container">
	<Row>
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
			<div className="mainContent-div">
				{/* <div className="testBlock-todelete">
					<p>test block 1</p>
					<p>test block 2</p>
				</div> */}

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
			</div>
		</Col>
	</Row>
	</Container>
	</div>
  );
}

export default Home;