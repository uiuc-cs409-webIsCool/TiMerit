import React from "react";

import  "./Welcome.css";
import "bootstrap/dist/css/bootstrap.min.css"
import {Button, Form, Row, Col} from 'react-bootstrap'

import logo from "./assets/test.png"
import carousel_image from "./assets/test1.jpg"

function Welcome() {
    return (
        <div className="container">
            <div className="login">
                <img src={logo} alt="logo" id="logo"/>
                <Form className="login_form">
                    <Row>
                        <Col><Form.Control type="text" placeholder="Email" style={{width:200}}></Form.Control></Col>
                        <Col><Form.Control type="passowrd" placeholder="Password" style={{width:200}}></Form.Control></Col>
                        <Col><Button variant="success" type="submit" id="login_button">Log In</Button></Col>
                    </Row>
                </Form>
            </div>

            <div className="introduction">
                <div className="text_intro">
                    <div class="card" id="intro_card" style={{width: 550}}>
                        <div class="card-body">
                        <h1 class="intro-card-title">Timerit</h1>
                        <p class="intro-card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed lacus felis, fringilla vitae est non, vulputate imperdiet odio. 
                        Ut ultrices tristique nulla, a varius erat condimentum in. Etiam quis viverra elit.
                        </p>
                    </div>
                </div>

                </div>

                <div className="create_account">
                    <h1>Manage your meaningful time!</h1>
                    <button class="create_account_btn">Create an account</button>
                </div>
            </div>

            <div className="slide_images">
                <div id="welcome_carousel" class="carousel slide" data-bs-ride="true">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>

                    <div class="carousel-inner">
                        <div class="carousel-item active">
                        <img src={carousel_image} class="d-block w-100" alt="image1"/>
                        </div>
                        <div class="carousel-item">
                        <img src={carousel_image} class="d-block w-100" alt="image2"/>
                        </div>
                        <div class="carousel-item">
                        <img src={carousel_image} class="d-block w-100" alt="image3"/>
                        </div>
                    </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                </div>
            </div>  
        </div>
    )
}

export default Welcome;