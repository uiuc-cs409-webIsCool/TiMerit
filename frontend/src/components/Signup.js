import React from "react";

import "bootstrap/dist/css/bootstrap.min.css"
import {Button, Form, Row, Col} from 'react-bootstrap'
import styles from "./Signup.module.css";


function Signup() {
    return (
        <div className={styles.container}>
            <div className={styles.signupForm}>
                <Row><h3>Sign up for better experiences</h3></Row>

                <Row>
                    <Col>
                        <Form.Control type="text" placeholder="First name" ></Form.Control>
                    </Col>
                    <Col>
                        <Form.Control type="text" placeholder="Last name" ></Form.Control>
                    </Col>
                </Row>

                <Row>
                    <Form.Control type="text" placeholder="Email address"></Form.Control>
                </Row>

                <Row>
                <Form.Control type="password" placeholder="Password"></Form.Control>
                </Row>

                <Row>
                    <button>Register</button>
                </Row>

            </div>
        </div>
    )
}

export default Signup;