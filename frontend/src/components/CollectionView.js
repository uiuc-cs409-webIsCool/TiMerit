// import "bootstrap/dist/css/bootstrap.min.css";
// // import "./LoginPageView.css";

// import axios from "axios";
// import React, { useState } from "react";
// import { Button, Form } from "react-bootstrap";

// var port = process.env.PORT || 8080;
// console.log("port: " + port);
// const TaskView = () => { 
// 	let [collectionId, setCollectionId] = useState("");
// 	let [collectionName, setCollectionName] = useState("");
// 	let [success, setSuccess] = useState(false);
// 	let [fail, setFail] = useState(false);

// 	const handleSubmit = (operation, e) => {
// 		axios.post(
// 			"http://localhost:" + port + "/api/collection",
// 			{
// 				name: collectionName
// 			},
// 			{
// 				headers: { "Access-Control-Allow-Origin": "*" },
// 			}
// 			)
// 			.then(function (response) {
// 				console.log("===Collection create success==="); 
// 				if (response) {
// 					setSuccess(true);
// 					setTimeout(() => {
// 						setSuccess(false);
// 					}, 3000);
// 				}
// 			})
// 			.catch(function (error) {
// 				console.log("===Collection create FAILED==="); 
// 				console.log(error);
// 				setFail(true);
// 				setTimeout(() => {
// 					setFail(false);
// 				}, 3000);
// 			}); 
// 		if(e) e.preventDefault();
// 	};

// 	const onFormSubmit = (e) => e.preventDefault();  
		

// 	return (
// 	<div className="outer-container">
// 		<form className="login-card" onSubmit={onFormSubmit}>
// 		<div className="login-card content">
// 			<h3>New Collection</h3>
// 			<Form.Group className="mb-3" controlId="formBasicEmail">
// 			<Form.Label>Collection Name</Form.Label>
// 			<Form.Control
// 				name="email"
// 				type="text"
// 				placeholder="Enter collection name"
// 				onChange={(e) => setCollectionName(e.target.value)}
// 			/> 
// 			</Form.Group>

// 			<Button
// 				variant="primary"
// 				type="submit"
// 				onClick={(e) => { handleSubmit(e);  }} >
// 				Submit
// 			</Button>
			

// 			{(success && (
// 			<div className="popup-window">
// 				<Form.Control plaintext readOnly value={`Collection Create Success!`} />
// 			</div>
// 			))||
// 			(fail && (
// 			<div className="popup-window">
// 				<Form.Control plaintext readOnly value={`Collection Create Failed!`} />
// 			</div>
// 			))
// 			}


// 		</div>
// 		</form>
// 	</div>
// 	); 
// };

// export default TaskView;