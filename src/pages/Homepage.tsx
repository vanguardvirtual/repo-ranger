import io from 'socket.io-client';
import Header from '@components/header/Header';
import Wrapper from '@components/HOC/Wrapper';
import { useEffect, useState, useRef } from 'preact/hooks';
import { API_URL } from '@config/endpoints';
import ScorePopup from '@components/scorePopup/scorePopup';
import { IUser } from '../types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Details from '@components/details/Details';
import Scoreboard from '@components/scoreboard/Scoreboard';
import Chat from '@components/chat/Chat';

const Homepage = () => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [hasMusic, setHasMusic] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showScoreboard, setShowScoreboard] = useState(true);

  const toggleNotification = () => {
    setHasNotification(!hasNotification);
  };

  const toggleMusic = () => {
    setHasMusic(!hasMusic);
    if (audioRef.current) {
      if (hasMusic) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const toggleView = () => {
    setShowScoreboard(!showScoreboard);
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
        toast(<ScorePopup user={notification} onClickHandler={() => setSelectedUser(notification)} />, {});
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isMobile, hasNotification]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set initial volume to 50%
    }
  }, []);

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
        <div className="mb-4 flex items-center mt-4">
          <label htmlFor="musicToggle" className="mr-2 text-sm font-medium cursor-pointer">
            Music:
          </label>
          <input type="checkbox" id="musicToggle" className="toggle toggle-primary" checked={hasMusic} onChange={toggleMusic} />
          <span className="ml-2 text-sm font-medium">{hasMusic ? 'On' : 'Off'}</span>
        </div>
        <audio ref={audioRef} loop>
          <source src="/path/to/your/audio.webm" type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
        <div className="mb-4 flex items-center mt-4">
          <label htmlFor="viewToggle" className="mr-2 text-sm font-medium cursor-pointer">
            View:
          </label>
          <input type="checkbox" id="viewToggle" className="toggle toggle-primary" checked={showScoreboard} onChange={toggleView} />
          <span className="ml-2 text-sm font-medium me-2">{showScoreboard ? 'Scoreboard' : 'Chat'}</span>{' '}
          <span className="italic text-xs">(Toggle to view between chat and scoreboard)</span>
        </div>
        <div className="mt-4">{showScoreboard ? <Scoreboard /> : <Chat />}</div>
        <ToastContainer
          position={isMobile ? 'top-right' : 'bottom-right'}
          autoClose={8000}
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
