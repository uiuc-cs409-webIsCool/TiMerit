import { React, useState, useEffect } from "react";
import ReactDOM from'react-dom';
import styles from "./TaskModal.module.css";
import axios from "axios";

import { Button, Col, Row, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { json } from "react-router-dom";

import Timer from "./TimerView.js"


var port = process.env.PORT || 8080;

function TaskModal({onClose, task, update_name})  {
    const [name, setName] = useState(task.name);
    const [sessionDuration, setSessionDuration] = useState(task.duration);
    const [description, setDescription] = useState(task.description);
    const [tag, setTag] = useState(task.tag);


    async function onSave() {
        fetch("http://localhost:" + port + "/api/task/" + task._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
              },
            body: JSON.stringify({
                name: name,
                duration: sessionDuration,
                description: description,
                tag: tag,
                // Need to pass assigned Collection id to the backend, because if does not 
                // explicitly update it, it will be assigned to the default value.
                assignedCollection: task.assignedCollection
            })
        })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log("ERROR")
            console.log(error);
        })
        update_name(task._id, name);
        onClose();
    }

    function updateSession() {

    }

    return (
        <div className={styles.modal}>
            <div className={styles.modal_header} style={{ textAlign: 'center' }}>
                <span className={styles.close_button} onClick={onClose} >
                    &times;
                </span>
                <Form.Control 
                value={name == null ? "" : name}
                onChange={(e) => {setName(e.target.value)}}
                className={styles.title}/>
                <span className={styles.save_button} onClick={() => {onSave(true)}} >
                    &#10004;
                </span>
            </div>

            <Row className={styles.body}>
                <Col>
                    <Form.Group style={{"display": "flex"}}>
                        <Form.Label>Tag:</Form.Label>
                        <Form.Control
                        value={tag == null ? "" : tag}
                        onChange={(e) => {setTag(e.target.value)}}
                        className={styles.tag}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                        value={description == null ? "" : description}
                        onChange={(e) => {setDescription(e.target.value)}}
                        className={styles.description}
                        />
                    </Form.Group>
                    <p>Date created: {task.date}</p>
                    <Form.Group className={styles.session}>
                        <Form.Label>Session Duration:</Form.Label>
                        <Form.Control
                        value={sessionDuration== null ? "" : sessionDuration}
                        onChange={(e) => {setSessionDuration(e.target.value)}}
                        className={styles.duration}
                        />
                    </Form.Group>
                    
                </Col>

                <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Row>
                    <Timer duration={sessionDuration} task={task} save_data={onSave}></Timer>
                    </Row>
                </Col>

            </Row>
        </div>
    )
}

export default TaskModal;