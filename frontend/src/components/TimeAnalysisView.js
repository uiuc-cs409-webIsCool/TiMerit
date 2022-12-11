import { Button, Card, Nav, Col, Row, Container, ListGroup, Form, InputGroup } from "react-bootstrap";
import { React, useState, useRef, useEffect, PureComponent } from "react";
import DatePicker from 'react-date-picker'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeView.css";
import "./TimeAnalysisView.css";
import axios from "axios";
import userPic from "./assets/defaultUser.png";
import NavBar from "./NavBar";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';

var port = process.env.PORT || 8080;
console.log("port: " + port);

const TimeAnalysis = () => {
	/** ================================================================================
     *  Helper functions on Nav Bar:
     *  ================================================================================
     */
    const navigate = useNavigate();
    function logout() {
        // Delete the token
        localStorage.removeItem("token");
        // Redirect to welcome page
        // window.location.href = "/";
        navigate("/");
    }

    /** ================================================================================
    *  useEffect 
    *  background height - dynamically change based on scroll position
    *  ================================================================================
    */
    const [scrollPosition, setScrollPosition] = useState(820);
    // const handleScroll = () => {
    //     const position = window.pageYOffset;
    //     setScrollPosition(position + 920);
    // };
    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll, { passive: true });
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);



	/** ================================================================================
	*  useEffect
	*  fetch data at boot up:
	*  ================================================================================
	*/
    let [allCollection, setAllCollection] = useState([]);
    console.log(allCollection)
    let [success, setSuccess] = useState(false);
	let [taskId_name, setTaskId_name] = useState(new Map()); //KEY: id, VALUE: name
    console.log(taskId_name)

    
    useEffect(() => {
        var recvData;
		const token = localStorage.getItem("token");
		if (token) {
			fetch("https://timerit.onrender.com/api/collection", {
				method: "GET",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"x-access-token": token
				  }
				}
			)
            .then(response => {
				return response.json();
			})
			.then(data => {
				console.log("===Collection Get success===");
				if (data) {
					recvData = (data.data); 
                    for (var i = 0; i < recvData.length; i++){
                        const iStr = i.toString() 
                        recvData[iStr]["isSelect"] = false; 
                    } 
					setAllCollection(recvData)

                    loadTask()
                }
				else {
					console.log("===Collection get FAILED. not found response.data.data._id==="); 
				}
            })
			.catch(function (error) {
				console.log("===Collection GET FAILED (at intermediate steps of .then)==="); 
				console.log(error); 
			})
		} 
        else {
			logout();
		}


        // get task from db for each collection
		const loadTask = async ()=>{
			console.log("===loadTask=== recvData len: "+recvData.length);
		    for (const coll of recvData){
				for (const taskId of coll.allTasks){
					try{
						const response = await axios.get(
							"https://timerit.onrender.com/api/task/"+taskId,
							{ headers: { "Access-Control-Allow-Origin": "*" }, } )

						if(response){
							if (response.data.data) {
								console.log("===Task Get success===taskId: "+taskId); 
								// const taskName = response.data.data.name;
								const taskInfo = {	name: response.data.data.name, 
													assignedUser: response.data.data.assignedUser, 
													completed: response.data.data.completed,
                                                    duration: response.data.data.duration,
                                                    date: response.data.data.date
                                                }
								setTaskId_name(taskId_name.set(taskId, taskInfo));
							}
							else {
								console.log("===Task get FAILED==="); 
							}
						}
					} catch(error){
						console.log("===Task get FAILED==="); 
						console.log(error); 
					}
				}
			}
			setSuccess(true)
			console.log("===!!!!Task get FINISHED!!!!==="); 
		};
    },[])

    /** ================================================================================
	*  changing date filter : date picker
	*  ================================================================================
	*/
    var today = new Date();
    const [date1, setDate1] = useState();
    const [date2, setDate2] = useState();
    console.log("date1: "+date1+". date2: "+date2)


    /** ================================================================================
	*  changing collection filter : a menu to select from all collections
	*  ================================================================================
	*/
    const handleCollectionChange = (collId, checkVal) => {
        allCollection.map(coll=>{
            coll._id==collId ? coll.isSelect = checkVal : console.log('');
        })
    }


    /** ================================================================================
	*  changing duration filter : input field for entering number
	*  ================================================================================
	*/
    let [durationLow, setDurationLow] = useState(0);
    let [durationHigh, setDurationHigh] = useState(0);
    
    /** ================================================================================
	*  Graphing functions
	*  ================================================================================
	*/
    let [pieChart, setPieChart] = useState([]);
    let [newpieChart, setnewPieChart] = useState([]);
    let [pieChartSwitch, setPieChartSwitch] = useState(false);
    useEffect(() => {
        setPieChart(newpieChart)
    }, [newpieChart])
    const pieChart_durationPercentageOfAllCollections = (isOpen) => { //KEY: collectionName, VALUE: durationPercentage
        setPieChartSwitch(isOpen)
        var totalDuration = 0;
        var coll_duration_obj = [];

        allCollection.map(coll => {
            const key = coll.name.toString();
            var collDuration = 0;

            coll.allTasks.map(taskId => {
                totalDuration += taskId_name.get(taskId).duration;
                collDuration += taskId_name.get(taskId).duration;

            })

            coll_duration_obj.push({key, collDuration})
        })

        // //calculate percentage
        // for (const coll of Object.values(coll_duration_obj)){ 
        //     coll.collDuration = (coll.collDuration / totalDuration *100); 
        // }

        // console.log(coll_duration_obj)
        setnewPieChart(coll_duration_obj)
    }

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };


    if (success === false) {
        return <>Still loading...</>;
    }
    return (
        <div className="outer-container-div"> 	<Container className="outer-container"> <Row>
            <NavBar defaultPage={"/analysis"}/>
            <Col xs={12} md={9}> <form className="login-card" > <div className="mainContent-div" style={{height:scrollPosition}}> 
            <Container className="mainContent-container timeAnalysis-container h-100">
                <Row className="h-40">
                    <h4>Select Date Range</h4>
                    <div className="timeAnalysis-datepicker">
                        <div>Start <DatePicker onChange={setDate1} value={date1} /></div>
                        <div>End <DatePicker onChange={setDate2} value={date2} /></div>
                    </div> 
                    
                    <h4>Select Duration Range</h4>
                    <div className="timeAnalysis-duration">
                        <Form.Group className="timeAnalysis-duration-inputfield" controlId="exampleForm.ControlInput1">
                            <Form.Label>Duration Lowerbound</Form.Label>
                            <Form.Control type="number" placeholder="Enter a number > 0" min={0} onChange={(e)=>setDurationLow(e.target.value)} /> 
                        </Form.Group>
                        <Form.Group className="timeAnalysis-duration-inputfield" controlId="exampleForm.ControlInput1">
                            <Form.Label>Duration Upperbound</Form.Label>
                            <Form.Control type="number" placeholder="Enter a number > 0" min={0} onChange={(e)=>setDurationHigh(e.target.value)} />
                        </Form.Group>
                    </div>
                    <div className="timeAnalysis-collectionCheckbox">
                        <h4>Select Collection(s)</h4>
                        {
                            allCollection && allCollection.map((coll, idx) => (
                                <Form.Check
                                    inline
                                    label={coll.name}
                                    name={coll.name}
                                    type='checkbox'
                                    id={`inline-checkbox-1`}
                                    onChange={(e)=>handleCollectionChange(coll._id, e.target.checked)}
                                />
                            ))
                        }
                    </div> 
                </Row>
                <hr />
                <Row className="h-60">
                    <div>
                        PS: Displaying graph with no filter applied for now
                    </div> 
                    <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Show default graph"
                        onChange={(e)=>{ pieChart_durationPercentageOfAllCollections(e.target.checked) }}
                    />
                    { pieChartSwitch && 
                    <div>
                        <h3>Tasks duration distribution per collection</h3>
                        <h5>Hover on chart to see details</h5>
                        <PieChart width={730} height={250}>
                            <Pie 
                                data={pieChart} dataKey="collDuration" nameKey="key" 
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                />
                            <Tooltip />
                        </PieChart>
                    </div>
                    }
                </Row>
                
            </Container>
            </div></form></Col>
        </Row></Container></div>
    )
    
}

export default TimeAnalysis;