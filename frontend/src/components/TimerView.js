import React, { useState, useEffect } from 'react';
import './TimerView.css';

const Timer = ({ duration }) => {
    console.log(duration)
    const [timeLeft, setTimeLeft] = useState(duration * 60 * 1000);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
  
    useEffect(() => {
      if (isRunning) {
        const id = setInterval(() => {
          setTimeLeft(timeLeft - 1000);
        }, 1000);
        setIntervalId(id);
      } else {
        clearInterval(intervalId);
      }
  
      return () => clearInterval(intervalId);
    }, [isRunning, timeLeft]);

    // Use a side effect to automatically update the diaplayed time in the timer
    // when the input parameter change.
    useEffect(() => {
      setTimeLeft(duration * 60 * 1000);
    }, [duration]);
    
  
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  
    return (
      <div className="countdown-timer">
        <p>Time remaining:</p>
        <p>
          {hours}:{minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </p>
        {isRunning ? (
          <button onClick={() => setIsRunning(false)}>Stop</button>
        ) : (
          <button onClick={() => setIsRunning(true)}>Start</button>
        )}
      </div>
    );
  };

export default Timer; 