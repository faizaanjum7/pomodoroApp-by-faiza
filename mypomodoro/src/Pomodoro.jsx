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
  const audioRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/notification.wav');
    audioRef.current.load();
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Restore saved state from localStorage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("pomodoroState"));
    if (savedState) {
      setMode(savedState.mode);
      setIsRunning(savedState.isRunning);
      if (savedState.endTime && savedState.isRunning) {
        const remaining = Math.round((savedState.endTime - Date.now()) / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);
      } else {
        setTimeLeft(savedState.timeLeft || 25 * 60);
      }
    }
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Accurate + Persistent timer logic
  useEffect(() => {
    if (!isRunning) {
      localStorage.setItem("pomodoroState", JSON.stringify({ mode, timeLeft, isRunning }));
      return;
    }

    const endTime = Date.now() + timeLeft * 1000;
    localStorage.setItem("pomodoroState", JSON.stringify({ mode, timeLeft, isRunning, endTime }));

    const interval = setInterval(() => {
      const saved = JSON.parse(localStorage.getItem("pomodoroState"));
      const remaining = Math.round((saved.endTime - Date.now()) / 1000);

      if (remaining >= 0) {
        setTimeLeft(remaining);
      } else {
        clearInterval(interval);
        setTimeLeft(0);
        setIsRunning(false);

        const finishedMode = mode;

        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => console.log("Audio blocked:", err));
        }

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("⏰ Pomodoro Done!", {
            body: finishedMode === "focus"
              ? "Focus time over! Break started (5 min)"
              : "Break over! Focus started (25 min)",
            icon: "/icon.png"
          });
        }

        setPopupMessage(
          finishedMode === "focus"
            ? "Focus time is over! Time to take a break."
            : "Break is over! Back to focus."
        );
        setShowPopup(true);

        if (finishedMode === "focus") {
          setMode("break");
          setTimeLeft(5 * 60);
        } else {
          setMode("focus");
          setTimeLeft(25 * 60);
        }

        localStorage.setItem("pomodoroState", JSON.stringify({
          mode: finishedMode === "focus" ? "break" : "focus",
          timeLeft: finishedMode === "focus" ? 5 * 60 : 25 * 60,
          isRunning: false
        }));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    setIsRunning(false);
    localStorage.setItem("pomodoroState", JSON.stringify({
      mode: newMode,
      timeLeft: newMode === 'focus' ? 25 * 60 : 5 * 60,
      isRunning: false
    }));
  };

  const applyCustomTime = () => {
    const totalSeconds = hrs * 3600 + mins * 60 + secs;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(false);
      localStorage.setItem("pomodoroState", JSON.stringify({
        mode,
        timeLeft: totalSeconds,
        isRunning: false
      }));
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
