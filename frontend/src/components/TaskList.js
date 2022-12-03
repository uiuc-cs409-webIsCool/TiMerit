import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';

function TaskList() {
    const [name, setName] = useState('');
    const [tasks, setTasks] = useState([]);
    
    useEffect(()=>{
        const loadTasks = async () => {
        try{
            const res = await axios.get('http://localhost:8080/api/task')
            setTasks(res.data);
            console.log('render')
        }catch(err){
            console.log(err);
        }
        }
        loadTasks()
    },[]);
    const addTask = async (e) => {
        e.preventDefault();
        try{
          const res = await axios.post('http://localhost:8080/api/task', {name: name})
          setTasks(prev => [...prev, res.data]);
          setName('');
        }catch(err){
          console.log(err);
        }
    }
    const deleteTask = async (id) => {
        try{
          const res = await axios.delete(`http://localhost:8080/api/task/${id}`)
          const newTasks = tasks.filter(task=> task._id !== id);
          setTasks(newTasks);
        }catch(err){
          console.log(err);
        }
    }
    return (
        <div className='TaskList'>
            <h1>Task List</h1>
            <form className="task_form" onSubmit={e => addTask(e)}>
                <input type="text" placeholder='Add Your New Task' onChange={e => {setName(e.target.value)} } value={name} />
                <button type="submit">+</button>
            </form>
            <div className="todo-listItems">
                {
                    Array.from(tasks).map(task => (
                    <div className="task">
                        <p className="item-content">{task.name}</p>
                        <button className="delete-item" onClick={()=>{deleteTask(task._id)}}>X</button>
                    </div>
                    ))
                }
            </div>

        </div>
    );
}

export default TaskList;