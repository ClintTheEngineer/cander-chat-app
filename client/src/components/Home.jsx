import { LogoutButton } from "./LogoutButton";
import PropTypes from 'prop-types';
import Chat from "./Chat";

const Home = ({username}) => {
    username = localStorage.getItem('username');
  return (
    <>
    <div>Home</div>
    <div className="user-info">
                <p>Hello, {username ? username.toUpperCase() : 'x'}</p>
            </div>
            <span>Chat App Details</span>
            <Chat/>
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