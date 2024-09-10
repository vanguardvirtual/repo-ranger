import { ScorePopupProps } from '../../types';
import { useState, useEffect } from 'react';

const ScorePopup: React.FC<ScorePopupProps> = ({ user, onClickHandler }) => {
  const { avatar, username, score, ai_description } = user;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const truncatedDescription = isMobile && ai_description.length > 100 ? `${ai_description.slice(0, 97)}...` : ai_description;

  return (
    <div className="items-center" onClick={onClickHandler}>
      <div className="flex gap-1 items-center">
        <img src={avatar} alt={username} className="w-8 h-8 w-md-12 h-md-12 rounded-full mr-3" />
        <div className="flex items-center gap-1">
          <h3 className="font-bold mb-0">{username}</h3>
          <div className="text-primary">Score: {score}</div>
        </div>
      </div>
      <p className="text-xs mt-1">{truncatedDescription}</p>
    </div>
  );
};

export default ScorePopup;
