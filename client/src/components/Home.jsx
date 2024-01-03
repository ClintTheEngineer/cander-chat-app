import { LogoutButton } from "./LogoutButton";
import PropTypes from 'prop-types';

const Home = ({username}) => {
    username = localStorage.getItem('username');
  return (
    <>
    <div>Home</div>
    <div className="user-info">
                <p>Hello, {username ? username.toUpperCase() : 'x'}</p>
            </div>
            <span>Chat App Details</span>
            <br></br>
    <LogoutButton />
    </>
  )
}

Home.propTypes= {
    token: PropTypes.string,
    username: PropTypes.string
}

export default Home;