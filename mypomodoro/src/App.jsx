import React, { useState, useEffect } from 'react';
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
  User,
  Volume2,
  Bell
} from 'lucide-react';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [armyMode, setArmyMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro');
  const [pomodoroName, setPomodoroName] = useState('Focus Session');
  const [showSettings, setShowSettings] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      if (mode === 'pomodoro') {
        setCompletedPomodoros(prev => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('pomodoro');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getTimerColor = () => {
    return mode === 'break' ? 'text-green-400' : 'text-red-400';
  };

  const getButtonColor = () => {
    return mode === 'break' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? armyMode 
          ? 'bg-gradient-to-br from-gray-900 via-red-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-900 to-gray-800'
        : armyMode
          ? 'bg-gradient-to-br from-red-100 via-pink-100 to-orange-100'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              Pomodoro Focus
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setArmyMode(!armyMode)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  armyMode 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                    : darkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-white text-gray-700 shadow-md'
                }`}
              >
                {armyMode ? '💜 ARMY Mode' : 'Normal Mode'}
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-full transition-all duration-300 ${
                  darkMode 
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                    : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-all duration-300 shadow-md">
                <Music size={20} />
              </button>

              <button className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-all duration-300 shadow-md">
                <BarChart3 size={20} />
              </button>

              <button className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-all duration-300 shadow-md">
                <HelpCircle size={20} />
              </button>

              <button 
                onClick={() => setShowSettings(true)}
                className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-all duration-300 shadow-md"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((25 * 60 - timeLeft) / (25 * 60)) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Timer Section - Center */}
          <div className="lg:col-span-2">
            <div className={`rounded-3xl p-8 backdrop-blur-lg border ${
              darkMode 
                ? 'bg-gray-800/40 border-gray-700' 
                : 'bg-white/40 border-white/50'
            } shadow-2xl`}>
              
              {/* Session Name */}
              <input
                type="text"
                value={pomodoroName}
                onChange={(e) => setPomodoroName(e.target.value)}
                className={`w-full text-3xl font-bold text-center bg-transparent border-none outline-none mb-6 placeholder-gray-400 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}
                placeholder="Name your session..."
              />

              {/* Timer Display */}
              <div className={`text-9xl font-mono font-bold text-center mb-8 transition-all duration-300 ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </div>

              {/* Mode Indicators */}
              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    mode === 'pomodoro' 
                      ? 'text-red-500 scale-110' 
                      : darkMode ? 'text-gray-400' : 'text-gray-600'
                  } transition-transform duration-300`}>
                    Focus
                  </div>
                  <div className="text-sm opacity-75">25:00</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    mode === 'break' 
                      ? 'text-green-500 scale-110' 
                      : darkMode ? 'text-gray-400' : 'text-gray-600'
                  } transition-transform duration-300`}>
                    Break
                  </div>
                  <div className="text-sm opacity-75">5:00</div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`p-6 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg ${getButtonColor()}`}
                >
                  <div className="flex items-center space-x-2">
                    {isRunning ? <Pause size={28} /> : <Play size={28} />}
                    <span className="text-lg">{isRunning ? 'Pause' : 'Start'}</span>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTimeLeft(mode === 'pomodoro' ? 25 * 60 : 5 * 60);
                  }}
                  className="p-6 rounded-full bg-gray-500 text-white font-semibold transition-all duration-300 transform hover:scale-110 hover:bg-gray-600 shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <SkipForward size={28} />
                    <span className="text-lg">Skip</span>
                  </div>
                </button>
              </div>

              {/* Completed Pomodoros */}
              <div className="text-center mt-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20">
                  <span className="text-sm font-semibold">Completed Today:</span>
                  <span className="text-lg font-bold text-red-500">{completedPomodoros}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Todo List Section - Right Side */}
          <div className={`rounded-3xl p-6 backdrop-blur-lg border h-fit ${
            darkMode 
              ? 'bg-gray-800/40 border-gray-700' 
              : 'bg-white/40 border-white/50'
          } shadow-2xl`}>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle className="mr-3 text-green-500" size={24} />
              Task List
            </h2>
            
            {/* Add Todo */}
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="What needs to be done?"
                className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 focus:border-red-400 focus:scale-105 ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/80 border-gray-200 text-gray-800 placeholder-gray-500'
                }`}
              />
              <button
                onClick={addTodo}
                className="p-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus size={24} />
              </button>
            </div>

            {/* Todo List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {todos.map(todo => (
                <div 
                  key={todo.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-102 ${
                    darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700/70' 
                      : 'bg-white/80 hover:bg-white'
                  } ${todo.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        todo.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-400 hover:bg-green-200 hover:text-green-500'
                      }`}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              {todos.length === 0 && (
                <div className={`text-center py-8 rounded-2xl ${
                  darkMode ? 'bg-gray-700/30' : 'bg-white/50'
                }`}>
                  <div className="text-gray-400 mb-2">No tasks yet</div>
                  <div className="text-sm text-gray-500">Add your first task above!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className={`rounded-3xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Settings className="mr-3" size={24} />
                Settings
              </h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-3 font-semibold text-lg">Focus Time</label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value="25"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-gray-600 mt-1">25 minutes</div>
              </div>
              
              <div>
                <label className="block mb-3 font-semibold text-lg">Break Time</label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value="5"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-gray-600 mt-1">5 minutes</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Bell size={20} />
                    <span className="font-medium">Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Volume2 size={20} />
                    <span className="font-medium">Background Sounds</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;