import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'; 
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import PrivateRoutes from './components/PrivateRoutes';
import Chat from './components/Chat';


function App() {
  const [token, setToken] = useState('');

  return (
    <div className="App">    
    <Router basename='/'>
    <Routes>
    <Route path="/register" element={<Register />} />    
    <Route path="*" element={<Navigate to="/login" />} /> 
    <Route path="/login" exact element={<Login setToken={setToken} />} />    
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/validate-password" component={token} element={<ResetPassword />} />
    <Route path='/' element={<PrivateRoutes />}>
    <Route path='/home' exact element={<Home />} component={Home} />
    <Route path='/chat' element={<Chat />} />
    </Route>
    </Routes>
    </Router>
    </div>
  );
}


export default App;