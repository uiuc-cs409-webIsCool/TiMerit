import { React, useState, useEffect } from "react";
import ReactDOM from'react-dom';
import styles from "./TaskModal.module.css";
import axios from "axios";


function TaskModal({onClose, task_id})  {
    const [task, setTask] = useState(null);
    const [error, setError] = useState(null);
    const [taskId, setTaskId] = useState(task_id);


    return (
        <div className={styles.modal}>
            <div className={styles.modal_header} style={{ textAlign: 'center' }}>
                <span className={styles.close_button} onClick={onClose} >
                    &times;
                </span>
                <h2>dd</h2>
            </div>
            <div className="modal-body">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed lacus felis, fringilla vitae est non, vulputate imperdiet odio. 
                    Ut ultrices tristique nulla, a varius erat condimentum in. Etiam quis viverra elit.
                    {task_id}
                    </p>
            </div>
        </div>
    )
}

export default TaskModal;