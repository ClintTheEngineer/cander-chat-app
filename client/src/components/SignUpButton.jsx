import { useNavigate } from 'react-router-dom';

const SignUpButton = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <button id="sign-up-btn" onClick={handleSignUpClick} title='Create an account'>
      Sign Up
    </button>
  );
};

export default SignUpButton;