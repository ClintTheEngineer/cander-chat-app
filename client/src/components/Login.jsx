import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import '../../src/App.css';
import SignUpButton from './SignUpButton';
import { HomeButton } from './HomeButton';
import PropTypes from 'prop-types';


const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();
  const appName = 'Cander Chat App';

  useEffect(() => {
    const token = localStorage.getItem('token')
   if(token){
    navigate('/home')
   }
   }, [navigate])

  const HandleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.status === 200) {
        const token = data.token;
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        navigate('/home');
      } else if(response.status === 400){
        setErrorMessage('Login failed')
        console.error('Login failed:', response.status)
      } else if(response.status === 401){
        setErrorMessage('Incorrect username/password.')
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      HandleLogin()
    }
  };



  return (
    <div>
      <HomeButton />
      <SignUpButton />
      <h2 id='login-hdr' className='app-name'>{appName}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyUp={handleKeyPress}
      />
      <button id='login-btn' onClick={HandleLogin} onKeyUp={handleKeyPress}>Login</button>
      <Link id='reset-pswd' title='Click here to reset your password' to="/forgot-password">Forgot Password</Link>
      <p>{errorMessage}</p>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login;