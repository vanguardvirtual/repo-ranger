import io from 'socket.io-client';
import Header from '@components/header/Header';
import Wrapper from '@components/HOC/Wrapper';
import { useEffect, useState } from 'preact/hooks';
import { API_URL } from '@config/endpoints';
import ScorePopup from '@components/scorePopup/scorePopup';
import { IUser } from '../types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Details from '@components/details/Details';
import Scoreboard from '@components/scoreboard/Scoreboard';

const Homepage = () => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  const toggleNotification = () => {
    setHasNotification(!hasNotification);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (hasNotification) {
      const socket = io(API_URL, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        console.log('Connected to sockets');
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      socket.on('user_notification', (notification: IUser) => {
        console.log('Received user notification:', notification);
        toast(<ScorePopup user={notification} onClickHandler={() => setSelectedUser(notification)} />, {});
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isMobile, hasNotification]);

  return (
    <>
      <Wrapper>
        <Header />
        <div className="mb-4 flex items-center mt-4">
          <label htmlFor="notificationToggle" className="mr-2 text-sm font-medium cursor-pointer">
            Notifications:
          </label>
          <input
            type="checkbox"
            id="notificationToggle"
            className="toggle toggle-primary"
            checked={hasNotification}
            onChange={toggleNotification}
          />
          <span className="ml-2 text-sm font-medium">{hasNotification ? 'On' : 'Off'}</span>
        </div>
        <div className="mt-4">
          <Scoreboard />
        </div>
        <ToastContainer
          position={isMobile ? 'top-right' : 'bottom-right'}
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          limit={1}
          pauseOnHover
          theme="dark"
        />
        {selectedUser && <Details user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </Wrapper>
    </>
  );
};

export default Homepage;
