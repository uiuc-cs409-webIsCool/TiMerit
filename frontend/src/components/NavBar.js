import { Button, Card, Nav, Col, Row, Container, ListGroup, Form, InputGroup } from "react-bootstrap";
import { React, useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeView.css";
import userPic from "./assets/defaultUser.png";
import { useNavigate } from "react-router-dom";

const NavBar = ({defaultPage}) => {

	const navigate = useNavigate();

    /** ================================================================================
	 *  Helper functions on Nav Bar:
	 *  ================================================================================
	 */
	function logout() {
		// Delete the token
		localStorage.removeItem("token");
		// Redirect to welcome page
		// window.location.href = "/";
		navigate("/")
		
	}



    return (
        <Col xs={6} md={3} className="col-leftside-container">
			<Row className="to-center" id="row-leftside-container">
				<div className="userPic-container">
					<img src={userPic} id="userPic" alt=""></img>
				</div>
			</Row>
			
			<Row className="to-center"> 
				<div className="sideBar-container"> 
					<Nav fill variant="pills" defaultActiveKey={defaultPage} className="flex-column" id="sideBar">
						<Nav.Item>
							<Nav.Link href="/home">Home</Nav.Link> 
						</Nav.Item>
						<Nav.Item>
							<Nav.Link href="/analysis">Time Analysis</Nav.Link> 
						</Nav.Item> 
						<Nav.Item>
							<Nav.Link> </Nav.Link> 
						</Nav.Item> 
						<Nav.Item>
							<Nav.Link eventKey="link-1" onClick={() => {logout()}}>Logout</Nav.Link>
						</Nav.Item> 
					</Nav> 
				</div>
			</Row>
		</Col>
        
    )
    
}

export default NavBar;