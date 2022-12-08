import { React, useState, useEffect } from "react";
import ReactDOM from'react-dom';
import styles from "./TaskModal.module.css";
import axios from "axios";

import { Button, Col, Row, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


function TaskModal({onClose, task, update_name})  {
    const [currentTask, setCurrentTast] = useState(null);
    const [sessionDuration, setSessionDuration] = useState(25);
    const [description, setDescription] = useState(null);
    const [tag, setTag] = useState(null);


    console.log(task);
    return (
        <div className={styles.modal}>
            <div className={styles.modal_header} style={{ textAlign: 'center' }}>
                <span className={styles.close_button} onClick={onClose} >
                    &times;
                </span>
                <h1 className={styles.title}>{task.name}</h1>
                <span className={styles.save_button} onClick={onClose} >
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
                    <p>You have focused {} minutes for this task.</p>
                    <Button className={styles.start_focus}>Start</Button>
                </Col>

            </Row>
        </div>
    )
}

export default TaskModal;