import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chat from './Chat'

function App() {
  // const [count, setCount] = useState(0)
  const [theme, setTheme] = useState('dark');
console.log("in app.jsx theme",theme);
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
console.log("in toggle theme NEW THEME",newTheme);
  };

  return (
    <>
      <div className='app'>
        <Chat theme={theme} toggleTheme={toggleTheme} />
      </div>
    </>
  )
}

export default App
