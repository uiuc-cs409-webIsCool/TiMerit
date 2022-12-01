import React from "react";

import "bootstrap/dist/css/bootstrap.min.css"
import {Form, Row, Col} from 'react-bootstrap'
import styles from "./Signup.module.css";


function Signup() {
    return (
        <div className={styles.container}>
            <div className={styles.signupForm}>
                <Row className={styles.title}><h3>Sign up for better experiences</h3></Row>

                <Row className={styles.name_row}>
                    <Form.Control type="text" placeholder="First name" className={styles.name_input}></Form.Control>
                    <Form.Control type="text" placeholder="Last name" className={styles.name_input}></Form.Control>
                </Row>

                <Row>
                    <Form.Control type="text" placeholder="Email address" className={styles.email_input}></Form.Control>
                </Row>

                <Row>
                <Form.Control type="password" placeholder="Password" className={styles.email_input}></Form.Control>
                </Row>

                <Row>
                    <button className={styles.signup_btn}>Register</button>
                </Row>

            </div>
        </div>
    )
}

export default Signup;