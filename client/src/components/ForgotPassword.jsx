import { useState } from 'react';
import { useNavigate } from 'react-router';
import { HomeButton } from './HomeButton';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://localhost:3001', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage(`${data.message}, Re-directing to home page`);
        setTimeout(() => {
        navigate('/login');
        }, 3000);
      } else {
        setMessage('Password reset request failed.');
      }
    } catch (error) {
      console.error('Error sending password reset request:', error);
      setMessage('An error occurred while sending the request.');
    }
  };

  return (
    <div>
      <HomeButton />
      <h2 id='forgot-hdr'>Forgot Password</h2>
      <p id='email-txt'>Enter your email address to reset your password.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button id='reset-btn' onClick={handleResetPassword}>Reset Password</button>
      {<p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;