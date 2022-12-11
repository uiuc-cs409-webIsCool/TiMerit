import { React, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import {Form, Row} from 'react-bootstrap'
import styles from "./Signup.module.css";


function Signup(event) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function register() {
        const res = await fetch("https://timerit.onrender.com/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        })

        const data = await res.json();
        console.log(data);
        if (data.data) {
            // window.location.href = "/";
            navigate("/");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.signupForm}>
                <Row className={styles.title}>
                    <div>
                        <Link to="/" >
                            <span>&times;</span>
                        </Link>
                        <h3>Sign up for better experiences</h3>
                    </div>
                </Row>
                <Row className={styles.name_row}>
                    <Form.Control 
                    type="text" placeholder="First name" className={styles.name_input}
                    value={firstName} onChange={(e) => setFirstName(e.target.value)} 
                    />
                    <Form.Control 
                    type="text" placeholder="Last name" className={styles.name_input}
                    value={lastName} onChange={(e) => setLastName(e.target.value)}
                    />
                </Row>

                <Row>
                    <Form.Control 
                    type="text" placeholder="Email address" className={styles.email_input}
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                </Row>

                <Row>
                    <Form.Control 
                    type="password" placeholder="Password" className={styles.email_input}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                </Row>

                <Row>
                    <button className={styles.signup_btn} type="submit" onClick={(e) => {register()}}>Register</button>
                </Row>

            </div>
        </div>
    )
}

export default Signup;