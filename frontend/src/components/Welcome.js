import React from "react";

import styles from "./Welcome.module.css";
import "bootstrap/dist/css/bootstrap.min.css"
import {Button, Form, Row, Col, Carousel} from 'react-bootstrap'

import logo from "./assets/test.png"
import carousel_image from "./assets/test1.jpg"


function Welcome() {
    return (
        <div className={styles.container}>
            <div className={styles.login}>
                <img src={logo} alt="logo" className={styles.logo}/>
                <Form className={styles.login_form}>
                    <Row>
                        <Col><Form.Control type="text" placeholder="Email" style={{width:200}}></Form.Control></Col>
                        <Col><Form.Control type="passowrd" placeholder="Password" style={{width:200}}></Form.Control></Col>
                        <Col><Button variant="success" type="submit" className={styles.login_button}>Log In</Button></Col>
                    </Row>
                </Form>
            </div>

            <div className={styles.introduction}>
                <div className={styles.text_intro}>
                    <div className={styles.intro_card}>
                        <div class="card-body">
                        <h1 class="intro-card-title">Timerit</h1>
                        <p class="intro-card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Sed lacus felis, fringilla vitae est non, vulputate imperdiet odio. 
                        Ut ultrices tristique nulla, a varius erat condimentum in. Etiam quis viverra elit.
                        </p>
                    </div>
                </div>

                </div>

                <div className={styles.create_account}>
                    <h1>Manage your meaningful time!</h1>
                    <Button className={styles.create_account_btn}>Create an account</Button>
                </div>
            </div>

            <div className={styles.slide_images}>
                <Carousel>
                    <Carousel.Item>
                        <img className={styles.carousel_image} src={carousel_image} alt="first slide" />
                    </Carousel.Item>

                    <Carousel.Item>
                        <img className={styles.carousel_image} src={carousel_image} alt="first slide" />
                    </Carousel.Item>

                    <Carousel.Item>
                        <img className={styles.carousel_image} src={carousel_image} alt="first slide" />
                    </Carousel.Item>

                </Carousel>
            </div>  
        </div>
    )
}

export default Welcome;