import React, { useState } from "react";

import styles from "./Welcome.module.css";
import "bootstrap/dist/css/bootstrap.min.css"
import {Form, Row, Col, Carousel} from 'react-bootstrap'
import { Link } from "react-router-dom";
import TaskModal from "./TaskModal";


import logo from "./assets/logo.png"
import carousel1 from "./assets/carousel1.png"
import carousel2 from "./assets/carousel2.png"
import carousel3 from "./assets/carousel3.png"



function Welcome() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);

    /**
     * In frontend, create states to store value of input email and input password.
     * Send a post request with email and password. Backend will return a boolean variable
     * to indicate whether they're matched.
     */
    async function login() {
        // button's type has been set as button to prevent submiting the form.
        const res = await fetch("https://timerit.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        
        // Extract json data from the response.
        const data = await res.json();
        
        /**
         * TODO: If password incorrect, throw a prompt to notice user.
         */
        if (data.user) {
            alert("Log in!");
            // store token in local storage because we gonna be redrected to the homepage.
            localStorage.setItem("token", data.user);

            // Redirect user to the home page
            window.location.href = "/home";
        } else {
            alert("Email or password is incorrect!");
            console.log("User name or password is incorrect.")
        }
    }

    function handleClick() {
        setShowModal(true);
    }

    function handleClose() {
        setShowModal(false);
    }

    return (
        <div className={styles.container}>
            {showModal && (
                <TaskModal title={"This is a modal"} onClose={handleClose}/>
            )}
            
            <div className={styles.login}>
                <img src={logo} alt="logo" className={styles.logo}/>
                <Form className={styles.login_form}>
                    <Row>
                        <Col>
                        <Form.Control
                        type="text" placeholder="Email" style={{width:200}}
                        onChange={(e) => {setEmail(e.target.value)}}/>
                        </Col>
                        <Col><Form.Control 
                        type="passowrd" placeholder="Password" style={{width:200}}
                        onChange={(e) => {setPassword(e.target.value)}}/>
                        </Col>
                        <Col><button type="button" className={styles.login_button} onClick={(e) => {login()}}>Log In</button></Col>
                    </Row>
                </Form>
            </div>

            <div className={styles.introduction}>
                <div className={styles.text_intro}>
                    <div className={styles.intro_card}>
                        <div className="card-body">
                        <h1 className="intro-card-title">Timerit</h1>
                        <p className="intro-card-text">
                        Are you tired of feeling overwhelmed and unproductive? Timerit is an innovative time management tool that helps you stay focused, 
                        track the time you spend on tasks and achieve your goals. Try Timerit today and take back control of your time!
                        </p>
                    </div>
                </div>

                </div>

                <div className={styles.create_account}>
                    <h1>Manage your meaningful time!</h1>
                    <Link to="/signup">
                        <button className={styles.create_account_btn} >Create an account</button>
                    </Link>
                </div>
            </div>

            <div className={styles.slide_images}>
                <Carousel>
                    <Carousel.Item>
                        <img className={styles.carousel_image} src={carousel1} alt="first slide" />
                    </Carousel.Item>

                    <Carousel.Item>
                        <img className={styles.carousel_image} src={carousel2} alt="first slide" />
                    </Carousel.Item>

                    <Carousel.Item>
                        <img className={styles.carousel_image} src={carousel3} alt="first slide" />
                    </Carousel.Item>

                </Carousel>
            </div>  
        </div>
    )
}

export default Welcome;