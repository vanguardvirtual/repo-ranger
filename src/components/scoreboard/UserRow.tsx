import { useEffect, useRef, useState } from 'react';
import { IUser } from '../../types';
import { formatNumber } from '../../util/NumberFormater';

interface UserRowProps {
  user: IUser;
  index: number;
  setSelectedUser: (user: IUser) => void;
  hasUserBeenCreated: boolean;
  createdUser: IUser | undefined;
}

const UserRow = ({ user, index, setSelectedUser, hasUserBeenCreated, createdUser }: UserRowProps) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const isUserCreated = hasUserBeenCreated && createdUser && createdUser.id === user.id;

    if (isUserCreated) {
      setIsFlashing(true);
      rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasUserBeenCreated, createdUser, user.id]);

  const isTrending = index < 3;
  const rowClassName = `transition-colors duration-300 hover:translate-y-[-2px] transition-transform duration-300 
  ${isTrending ? 'flame-row' : ''} ${isFlashing ? 'bg-green-200' : ''}`;

  return (
    <tr ref={rowRef} className={rowClassName} key={user.username}>
      <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
      <td className="border border-gray-300 p-2 flex items-center justify-center">
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img src={user.avatar} alt={`avatar-${user.username}`} />
          </div>
        </div>
      </td>
      <td className="border border-gray-300 p-2">{user.username}</td>
      <td className="border border-gray-300 p-2">{user.fav_language}</td>
      <td className="border border-gray-300 p-2">{user.location}</td>
      <td className="border border-gray-300 p-2">{formatNumber(user.score)}</td>
      <td className="border border-gray-300 p-2">{user.emoji}</td>
      <td className="border border-gray-300 p-2 h-full">
        <div className="flex gap-2 items-center h-full">
          <button onClick={() => setSelectedUser(user)} className="underline">
            View Details
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
