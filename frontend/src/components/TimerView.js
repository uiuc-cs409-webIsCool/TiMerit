import React, { useState, useEffect } from 'react';
import './TimerView.css'

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function stop() {
    setTime(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const seconds = time % 60;
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor((time / 60 / 60) % 24);

  return (
    <div className='timer-container'>
        <div className='innerCircle'>
            <div className='timer'>
            {hours > 9 ? hours : '0' + hours}:{minutes > 9 ? minutes : '0' + minutes}:{seconds > 9 ? seconds : '0' + seconds}
            </div>
        </div>
      <div className='buttonrow'>
        <button className={`Startbutton button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className='Stopbutton' onClick={stop}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default Timer; 