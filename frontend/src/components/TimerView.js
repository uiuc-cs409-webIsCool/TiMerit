import React, { useState, useEffect } from 'react';
import './TimerView.css';


const Timer = ({ duration }) => {
    console.log(duration)
    const [timeLeft, setTimeLeft] = useState(duration * 60 * 1000);
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    /**
     * When a tab is inactive, its JavaScript execution is typically paused in order to 
     * conserve system resources. This means that the setInterval function in the code will not be called as often, 
     * which causes the timer to run slower.
     */
    useEffect(() => {
      if (isRunning) {
        let animationFrameId;

        const update = () => {
          const elapsedTime = Date.now() - startTime;
          setTimeLeft(duration * 60 * 1000 - elapsedTime);
          animationFrameId = requestAnimationFrame(update);
        };

        setStartTime(Date.now());
        animationFrameId = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animationFrameId);
      } else {
        setTimeLeft(0);
      }
    }, [isRunning, startTime, duration]);

    // Use a side effect to automatically update the diaplayed time in the timer
    // when the input parameter change.
    useEffect(() => {
      setTimeLeft(duration * 60 * 1000);
      setIsRunning(false);
    }, [duration]);
    
    // Stop counting if time left is 0.
    useEffect(() => {
      if (timeLeft <= 0) {
        setIsRunning(false);
      }
    }, [timeLeft]);

    
  
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