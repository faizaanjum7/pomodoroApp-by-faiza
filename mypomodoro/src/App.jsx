import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('focus'); 
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const [showPicker, setShowPicker] = useState(false); 
  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      const audio = new Audio(process.env.PUBLIC_URL + '/notfication.mp4');
      audio.play();
      alert(mode === 'focus' ? 'Focus time over! Take a break.' : 'Break over! Back to focus.');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25*60 : 5*60);
    setIsRunning(false);
  };

  const applyCustomTime = () => {
    const totalSeconds = hrs*3600 + mins*60 + secs;
    setTimeLeft(totalSeconds);
    setIsRunning(false);
    setShowPicker(false);
  };

  return (
    <div className="appcontainer">
      <h1>Pomodoro Timer</h1>

      <div className="timer-card">
        <div className="timer-display">
          <span className="timer-text">{formatTime(timeLeft)}</span>
          <button onClick={() => setShowPicker(!showPicker)} className="edit-btn">⏱</button>
        </div>

        {showPicker && (
          <div className="time-picker">
            <input type="number" min="0" value={hrs} onChange={(e)=>setHrs(Number(e.target.value))}/> hrs
            <input type="number" min="0" value={mins} onChange={(e)=>setMins(Number(e.target.value))}/> min
            <input type="number" min="0" value={secs} onChange={(e)=>setSecs(Number(e.target.value))}/> sec
            <button onClick={applyCustomTime}>Set</button>
          </div>
        )}

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
