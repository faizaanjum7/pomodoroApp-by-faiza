import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Settings, 
  Sun, 
  Moon, 
  HelpCircle,
  Music,
  BarChart3,
  CheckCircle,
  X,
  Plus,
  Trash2,
  LogIn,
  User
} from 'lucide-react';
import './App.css';

// Mock user authentication
const mockAuth = {
  isAuthenticated: false,
  user: null,
  login: () => {
    mockAuth.isAuthenticated = true;
    mockAuth.user = { name: 'User', email: 'user@example.com' };
  },
  logout: () => {
    mockAuth.isAuthenticated = false;
    mockAuth.user = null;
  }
};

function App() {
  // Theme and mode states
  const [darkMode, setDarkMode] = useState(false);
  const [armyMode, setArmyMode] = useState(false);
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' or 'break'
  const [pomodoroName, setPomodoroName] = useState('Focus Session');
  
  // Settings states
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  // Todo list states
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  
  // Reminders states
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  
  // Settings
  const [settings, setSettings] = useState({
    pomodoroTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    notifications: true,
    backgroundMusic: false
  });

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      if (settings.notifications) {
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3').play();
      }
      
      if (mode === 'pomodoro') {
        setMode('break');
        setTimeLeft(settings.breakTime * 60);
        if (settings.autoStartBreaks) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      } else {
        setMode('pomodoro');
        setTimeLeft(settings.pomodoroTime * 60);
        if (settings.autoStartPomodoros) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, settings]);

  // Background based on mode
  const getBackgroundStyle = () => {
    if (armyMode) {
      return {
        backgroundImage: darkMode 
          ? `url(${import.meta.env.BASE_URL}assets/bangtanarmy_darkmode.png)`
          : `url(${import.meta.env.BASE_URL}assets/bangtanarmy_lightmode_bg.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    return darkMode 
      ? { backgroundColor: '#1f2937' }
      : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
  };

  // Add todo
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Add reminder
  const addReminder = () => {
    if (newReminder.trim() && reminderTime) {
      setReminders([...reminders, {
        id: Date.now(),
        text: newReminder,
        time: reminderTime,
        completed: false
      }]);
      setNewReminder('');
      setReminderTime('');
    }
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? 'dark text-white' : 'text-gray-800'
      }`}
      style={getBackgroundStyle()}
    >
      {/* Header */}
      <header className="p-6 backdrop-blur-md bg-black/20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pomodoro</h1>
          
          <div className="flex items-center space-x-4">
            {/* Army/Normal Mode Toggle */}
            <button
              onClick={() => setArmyMode(!armyMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                armyMode 
                  ? 'bg-red-500 text-white' 
                  : darkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-800'
              }`}
            >
              {armyMode ? 'ARMY Mode' : 'Normal Mode'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Playlist Button */}
            <button
              onClick={() => window.open('https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS', '_blank')}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              title="Focus Playlist"
            >
              <Music size={20} />
            </button>

            {/* Report Button */}
            <button
              onClick={() => setShowReport(true)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              title="Progress Report"
            >
              <BarChart3 size={20} />
            </button>

            {/* Help Button */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              title="Help"
            >
              <HelpCircle size={20} />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {/* Auth Button */}
            <button
              onClick={() => mockAuth.isAuthenticated ? mockAuth.logout() : setShowAuth(true)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              title={mockAuth.isAuthenticated ? 'Logout' : 'Login'}
            >
              {mockAuth.isAuthenticated ? <User size={20} /> : <LogIn size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Timer Section */}
          <div className="space-y-6">
            {/* Pomodoro Name */}
            <input
              type="text"
              value={pomodoroName}
              onChange={(e) => setPomodoroName(e.target.value)}
              className={`w-full text-2xl font-bold text-center bg-transparent border-none outline-none ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
            />

            {/* Timer Display */}
            <div className={`rounded-2xl p-8 text-center backdrop-blur-md ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            }`}>
              <div className={`text-8xl font-mono font-bold mb-8 timer-pulse ${
                mode === 'break' ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatTime(timeLeft)}
              </div>

              {/* Mode Buttons */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => {
                    setMode('pomodoro');
                    setTimeLeft(settings.pomodoroTime * 60);
                    setIsRunning(false);
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    mode === 'pomodoro'
                      ? 'bg-red-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  Pomodoro
                </button>
                <button
                  onClick={() => {
                    setMode('break');
                    setTimeLeft(settings.breakTime * 60);
                    setIsRunning(false);
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    mode === 'break'
                      ? 'bg-green-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  Break
                </button>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`p-4 rounded-full text-white font-medium transition-transform hover:scale-105 ${
                    mode === 'break' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {isRunning ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTimeLeft(mode === 'pomodoro' ? settings.pomodoroTime * 60 : settings.breakTime * 60);
                  }}
                  className="p-4 rounded-full bg-gray-500 text-white transition-transform hover:scale-105"
                >
                  <SkipForward size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Todo List Section */}
          <div className={`rounded-2xl p-6 backdrop-blur-md h-fit ${
            darkMode ? 'bg-gray-800/50' : 'bg-white/50'
          }`}>
            <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
            
            {/* Add Todo */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Add a task..."
                className={`flex-1 p-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
              <button
                onClick={addTodo}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Todo List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todos.map(todo => (
                <div key={todo.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`p-1 rounded-full ${
                        todo.completed ? 'text-green-500' : 'text-gray-400'
                      }`}
                    >
                      <CheckCircle size={20} />
                    </button>
                    <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Reminders */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Quick Reminders</h3>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  placeholder="Reminder..."
                  className={`flex-1 p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className={`p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                <button
                  onClick={addReminder}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              {/* Reminders List */}
              <div className="space-y-2">
                {reminders.map(reminder => (
                  <div key={reminder.id} className={`flex justify-between items-center p-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <span>{reminder.text} - {reminder.time}</span>
                    <button
                      onClick={() => setReminders(reminders.filter(r => r.id !== reminder.id))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showSettings && (
        <SettingsModal 
          settings={settings} 
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
        />
      )}

      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} darkMode={darkMode} />
      )}

      {showReport && (
        <ReportModal onClose={() => setShowReport(false)} darkMode={darkMode} />
      )}

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onLogin={mockAuth.login}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// Settings Modal Component
function SettingsModal({ settings, setSettings, onClose, darkMode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`rounded-2xl p-6 max-w-md w-full mx-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Pomodoro Time (minutes)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={settings.pomodoroTime}
              onChange={(e) => setSettings({...settings, pomodoroTime: parseInt(e.target.value) || 1})}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Break Time (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.breakTime}
              onChange={(e) => setSettings({...settings, breakTime: parseInt(e.target.value) || 1})}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="font-medium">Notifications</label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
              className="w-4 h-4"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="font-medium">Background Music</label>
            <input
              type="checkbox"
              checked={settings.backgroundMusic}
              onChange={(e) => setSettings({...settings, backgroundMusic: e.target.checked})}
              className="w-4 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Help Modal Component
function HelpModal({ onClose, darkMode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`rounded-2xl p-6 max-w-2xl w-full mx-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Help & Instructions</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">What is Pomodoro Technique?</h3>
            <p>The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2">How to Use</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Set your Pomodoro time (default 25 minutes)</li>
              <li>Click play to start the timer</li>
              <li>Work focused until the timer rings</li>
              <li>Take a short break (5 minutes)</li>
              <li>After 4 pomodoros, take a longer break (15-30 minutes)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Report Modal Component
function ReportModal({ onClose, darkMode }) {
  // Mock data for demonstration
  const reportData = {
    totalPomodoros: 127,
    weeklyCompletion: [5, 7, 6, 8, 4, 9, 6],
    productivityScore: 85
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`rounded-2xl p-6 max-w-2xl w-full mx-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Progress Report</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg text-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className="text-3xl font-bold text-red-500">{reportData.totalPomodoros}</div>
            <div>Total Pomodoros</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className="text-3xl font-bold text-green-500">{reportData.weeklyCompletion.reduce((a, b) => a + b, 0)}</div>
            <div>This Week</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className="text-3xl font-bold text-blue-500">{reportData.productivityScore}%</div>
            <div>Productivity</div>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-3">Weekly Progress</h3>
          <div className="flex items-end space-x-1 h-32">
            {reportData.weeklyCompletion.map((count, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-red-500 rounded-t transition-all"
                  style={{ height: `${(count / 10) * 100}%` }}
                ></div>
                <div className="text-xs mt-1">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Auth Modal Component
function AuthModal({ onClose, onLogin, darkMode }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`rounded-2xl p-6 max-w-md w-full mx-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 rounded border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          />
          
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 rounded border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          />
          
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full p-3 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          )}
          
          <button
            onClick={() => {
              onLogin();
              onClose();
            }}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-blue-500 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;