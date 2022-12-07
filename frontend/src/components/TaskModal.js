import { React, useState, useEffect } from "react";
import ReactDOM from'react-dom';
import styles from "./TaskModal.module.css";
import axios from "axios";


function TaskModal({onClose, task})  {
    const [currentTask, setCurrentTast] = useState(null);

    console.log(task);
    return (
        <div className={styles.modal}>
            <div className={styles.modal_header} style={{ textAlign: 'center' }}>
                <span className={styles.close_button} onClick={onClose} >
                    &times;
                </span>
                <h2>{task.name}</h2>
            </div>
            <div className="modal-body">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed lacus felis, fringilla vitae est non, vulputate imperdiet odio. 
                    Ut ultrices tristique nulla, a varius erat condimentum in. Etiam quis viverra elit.
                    {/* {task._id} */}
                </p>
            </div>
        </div>
    )
}

export default TaskModal;