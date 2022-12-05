import React from'react';
import ReactDOM from'react-dom';
import styles from "./TaskModal.module.css";


function TaskModal({title, onClose})  {
    return (
        <div className={styles.modal}>
            <div className={styles.modal_header} style={{ textAlign: 'center' }}>
                <span className={styles.close_button} onClick={onClose} >
                    &times;
                </span>
                <h2>{title}</h2>
            </div>
            <div className="modal-body">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed lacus felis, fringilla vitae est non, vulputate imperdiet odio. 
                    Ut ultrices tristique nulla, a varius erat condimentum in. Etiam quis viverra elit.</p>
            </div>
        </div>
    )
}

export default TaskModal;