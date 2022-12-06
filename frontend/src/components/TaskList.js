import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'


function TaskList() {
    const navigate = useNavigate()
    const [name, setName] = useState('');
    const [tasks, setTasks] = useState([]);
    let config = {
        headers: {'x-access-token': localStorage.getItem('token')}
    }

    useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt_decode(token)
			if (!user) {
				localStorage.removeItem('token')
				navigate.replace('/')
			} else {
				loadTasks()
			}
		}
	}, [])
    
    const loadTasks = async () => {
        try{
            const res = await axios.get('http://localhost:8080/api/task',config);
            setTasks(res.data);
            console.log('render tasks')
        } catch(err) {
            console.log(err);
        }
    }
    const addTask = async (e) => {
        e.preventDefault();
        try{
          const res = await axios.post('http://localhost:8080/api/task', {name: name},config)
          setTasks(prev => [...prev, res.data]);
          setName('');
        }catch(err){
          console.log(err);
        }
    }
    const deleteTask = async (id) => {
        try{
          const res = await axios.delete(`http://localhost:8080/api/task/${id}`,config)
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