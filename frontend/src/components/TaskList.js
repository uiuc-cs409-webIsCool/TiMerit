import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import "./TaskList.css";

function TaskList() {
    const navigate = useNavigate()
    const [name, setName] = useState('');
    const [tasks, setTasks] = useState([]);
    const [collections, setCollections] = useState([]);
    let me;
    let config = {
        headers: {'x-access-token': localStorage.getItem('token')}
    }

    useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt_decode(token)
            console.log(user.email)
			if (!user) {
				localStorage.removeItem('token')
				navigate.replace('/')
			} else {
				loadTasks()
                loadCollections()
			}
		}
	}, [])
    
    const loadTasks = async () => {
        try{
            const res = await axios.get('http://localhost:8080/api/task',config);
            setTasks(res.data.data);
            console.log('render tasks')
        } catch(err) {
            console.log(err);
        }
    }
    const loadCollections = async () => {
        try{
            const res = await axios.get('http://localhost:8080/api/collection',config);
            setCollections(res.data);
            console.log('render collections');
            console.log(res.data);
        } catch(err) {
            console.log(err);
        }
    }
    const addTask = async (e) => {
        e.preventDefault();
        try{
          const token = localStorage.getItem('token');
          const user = jwt_decode(token);
          const res = await axios.post('http://localhost:8080/api/task', {name: name, assignedUser: user.email},config);
          setTasks(prev => [...prev, res.data.data]);
          console.log(tasks);
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
    const getTask = async (id) => {
        try{
            const res = await axios.get(`http://localhost:8080/api/task/${id}`,config);
            console.log(res.data);
            return res.data;
        } catch(err) {
            console.log(err);
        }
    }
    const updateTask = async (id) => {
        const task = await getTask(id);
        console.log(task);
        try{
          const task = await getTask(id);
          console.log(task.completed);
          const res = await axios.put(`http://localhost:8080/api/task/${id}`,{ ...task, completed: !task.completed },config)
          const tasks = tasks.map(t =>
            (t._id === id)
            ? {...t, completed: !t.completed}
            : t
            )
          setTasks(tasks);
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
            <ul className="todo-listItems">
                {
                    Array.from(tasks).map(task => (
                    <li className="task" key={task._id}>
                        <span className="item-content" 
                        style={{
                            textDecoration: task.completed? 'line-through': 'none'
                        }}
                        onClick={()=>{updateTask(task._id)}}
                        >{task.name}</span>
                        <button className="delete-item" onClick={()=>{deleteTask(task._id)}}>X</button>
                    </li>
                    ))
                }
            </ul>

        </div>
    );
}

export default TaskList;