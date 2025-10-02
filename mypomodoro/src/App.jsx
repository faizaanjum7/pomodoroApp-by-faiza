import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('focus'); // focus or break
  const [timeLeft, setTimeLeft] = useState(25 * 60); // default 25 min
  const [isRunning, setIsRunning] = useState(false);

  // Convert seconds to hh:mm:ss format
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
       const audio = new Audio(process.env.PUBLIC_URL + '/notification.mp4');
      audio.play();
      alert(mode === 'focus' ? 'Focus time over! Take a break.' : 'Break over! Back to focus.');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  // Reset timer when switching mode
  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25*60 : 5*60);
    setIsRunning(false);
  }

  // Customize timer manually
  const handleTimeChange = (e) => {
    const val = e.target.value.split(':').map(Number);
    let seconds = 0;
    if (val.length === 3) seconds = val[0]*3600 + val[1]*60 + val[2];
    else if (val.length === 2) seconds = val[0]*60 + val[1];
    else if (val.length === 1) seconds = val[0];
    setTimeLeft(seconds);
    setIsRunning(false);
  }

  return (
    <div className="appcontainer">
      <h1>Pomodoro Timer</h1>

      <div className="timer-card">
        <input 
          type="text" 
          value={formatTime(timeLeft)} 
          onChange={handleTimeChange} 
          className="timer-input"
        />
        <button onClick={()=>setIsRunning(!isRunning)} className="start-btn">
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>

      <div className="mode-buttons">
        <button 
          className={`mode-btn ${mode==='focus' ? 'active' : ''}`} 
          onClick={()=>switchMode('focus')}
        >
          Focus
        </button>
        <button 
          className={`mode-btn ${mode==='break' ? 'active' : ''}`} 
          onClick={()=>switchMode('break')}
        >
          Break
        </button>
      </div>
    </div>
  );
}

export default App;
