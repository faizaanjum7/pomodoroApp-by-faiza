import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function Pomodoro() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);
  const audioRef=useRef(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    // preload audio
    audioRef.current = new Audio('/notification.wav');
    audioRef.current.load();
  }, []);

  useEffect(() => {
    // Ask for notification permission once
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);

      const finishedMode = mode;

      // 🔊 Play sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log("Audio blocked:", err));
      }

      // 🔔 Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("⏰ Pomodoro Done!", {
          body: finishedMode === "focus"
            ? "Focus time over! Break started (5 min)"
            : "Break over! Focus started (25 min)",
          icon: "/icon.png"
        });
      }

       // 🔹 Show in-app popup
    setPopupMessage(
      finishedMode === "focus"
        ? "Focus time is over! Time to take a break."
        : "Break is over! Back to focus."
    );
    setShowPopup(true);

      // Auto-switch mode
      if (finishedMode === "focus") {
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("focus");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);


  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  const applyCustomTime = () => {
    const totalSeconds = hrs * 3600 + mins * 60 + secs;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(false);
    }
    setShowPicker(false);
  };

  return (
    <div className="appcontainer">
      <h1>Pomodoro Timer</h1>

      <div className="timer-card">
        <span className="timer-text">{formatTime(timeLeft)}</span>

        <div className="timer-controls">
          <button onClick={() => setIsRunning(!isRunning)} className="start-btn">
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={() => setShowPicker(true)} className="set-btn">
            Set Time
          </button>
        </div>
      </div>

      {showPicker && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Set Custom Time</h3>
            <div className="time-inputs">
              <input type="number" min="0" value={hrs} onChange={(e) => setHrs(Number(e.target.value))} /> hrs
              <input type="number" min="0" value={mins} onChange={(e) => setMins(Number(e.target.value))} /> min
              <input type="number" min="0" value={secs} onChange={(e) => setSecs(Number(e.target.value))} /> sec
            </div>
            <div className="modal-buttons">
              <button onClick={applyCustomTime}>Apply</button>
              <button onClick={() => setShowPicker(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="mode-buttons">
        <button
          className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => switchMode('focus')}
        >
          Focus
        </button>
        <button
          className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
          onClick={() => switchMode('break')}
        >
          Break
        </button>
      </div>




      {/* In-app popup */}
    {showPopup && (
      <div className="popup-overlay">
        <div className="popup">
          <p>{popupMessage}</p>
          <button onClick={() => setShowPopup(false)}>OK</button>
        </div>
      </div>
    )}

    </div>
  );
}

export default Pomodoro;
