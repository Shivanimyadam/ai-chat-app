import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chat from './Chat'
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import { useEffect } from 'react'

function App() {

  // const [theme, setTheme] = useState('dark');

    const [theme, setTheme] = useState(()=>{
      return localStorage.getItem('theme') || 'dark';
    });


  const [user, setUser] = useState(()=>{
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token ? {token, username} : null;
  });

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme',theme);
  },[]);

  console.log("in app.jsx theme", theme);
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme',newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    console.log("in toggle theme NEW THEME", newTheme);
  };

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({token,username});
  };
  
   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <>
      <div className='app'>
        <Routes>
          <Route 
            path='/'
            element={
              user ? (
                <Chat 
                  theme={theme} 
                  toggleTheme={toggleTheme}
                  user={user}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to='/auth' />
              )
            }
          />
          <Route
            path='/auth'
            element={
              user ? (
                <Navigate to='/' />
              ):(
                <Auth onLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </div>
    </>
  )
}

export default App
