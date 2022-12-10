import React, { useState, useEffect } from 'react';
import './TimerView.css';
import axios from "axios";


var port = process.env.PORT || 8080;

const Timer = ({ duration, task, save_data }) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60 * 1000);
    const [isRunning, setIsRunning] = useState(false);
    // const [startTime, setStartTime] = useState(null);
    const [accumulatedTime, setAccumulatedTime] = useState(task.accumulatedTime);
    /**
     * When a tab is inactive, its JavaScript execution is typically paused in order to 
     * conserve system resources. This means that the setInterval function in the code will not be called as often, 
     * which causes the timer to run slower.
     */
    useEffect(() => {
      if (isRunning) {
        let animationFrameId;
        // The start time should be initialized in the useEffect function.
        const startTime = Date.now();

        const update = () => {
          const elapsedTime = Date.now() - startTime;
          /**
           * Since startTime is null, Date.now() will return a very large number, 
           * which when subtracted from duration * 60 * 1000 will result in a negative value. 
           * This is why timeLeft is being set to a negative value.
           */
          setTimeLeft(duration * 60 * 1000 - elapsedTime);
          animationFrameId = requestAnimationFrame(update);
        };

        // setStartTime(Date.now());
        animationFrameId = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animationFrameId);
      } else {
        setTimeLeft(0);
      }
    }, [isRunning, duration]);

    // Use a side effect to automatically update the diaplayed time in the timer
    // when the input parameter change.
    useEffect(() => {
      setTimeLeft(duration * 60 * 1000);
      setIsRunning(false);
    }, [duration]);
    
    // Stop counting if time left is 0.
    useEffect(() => {
      // Here timeLeft condition çan only be strictly smaller than 0, other wise it's calling twice
      if (timeLeft < 0) {
        stop()
      }
    }, [timeLeft]);

    function stop() {
      setIsRunning(false);
      const focus_time = duration - Math.ceil((timeLeft / 1000 / 60));
      console.log(focus_time);
      // const focus_time = 1;
      axios.put(
        "http://localhost:" + port + "/api/task/" + task._id,
        {accumulatedTime: accumulatedTime + focus_time}
      )
      .then(response => {
        save_data();
      })
      .catch(err => {
        console.log(err);
      })
    }
  
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  
    return (
      <div>
        <div className="countdown-timer">
          <p>Time remaining:</p>
          <p>
            {hours}:{minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </p>
          {isRunning ? (
            <button onClick={() => stop()}>Stop</button>
          ) : (
            <button onClick={() => {
              setIsRunning(true)
            }}>Start</button>
          )}
        </div>
        <div>
            <p>You have focused for {task.accumulatedTime} minutes.</p>
        </div>
      </div>

    );
  };

export default Timer; 