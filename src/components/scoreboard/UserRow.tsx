import { useEffect, useRef, useState } from 'react';
import { ICreateUserResponse, IUser } from '../../types';
import useRefreshUser from '@api/refreshUser';

interface UserRowProps {
  user: IUser;
  index: number;
  setSelectedUser: (user: IUser) => void;
  hasUserBeenCreated: boolean;
  createdUser: ICreateUserResponse | undefined;
}

const UserRow = ({ user, index, setSelectedUser, hasUserBeenCreated, createdUser }: UserRowProps) => {
  const { mutate: refreshUser, isLoading: isRefreshingUser, isSuccess: hasUserRefreshed, data: refreshedUser } = useRefreshUser();
  const [isFlashing, setIsFlashing] = useState(false);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const handleRefreshUser = (id: number) => {
    refreshUser({ id });
  };

  useEffect(() => {
    const isUserRefreshed = hasUserRefreshed && refreshedUser && refreshedUser.username.id === user.id;
    const isUserCreated = hasUserBeenCreated && createdUser && createdUser.username.id === user.id;

    if (isUserRefreshed || isUserCreated) {
      setIsFlashing(true);
      rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasUserRefreshed, refreshedUser, user.id, hasUserBeenCreated, createdUser]);

  const rowClassName = `transition-colors duration-300 ${isFlashing ? 'bg-green-200' : ''}`;

  return (
    <tr ref={rowRef} className={rowClassName} key={user.username}>
      <td className="border border-gray-300 p-2">{index + 1}</td>
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
      <td className="border border-gray-300 p-2">{user.score}</td>
      <td className="border border-gray-300 p-2">{user.emoji}</td>
      <td className="border border-gray-300 p-2 h-full">
        <div className="flex gap-2 items-center h-full">
          <button onClick={() => setSelectedUser(user)} className="underline">
            View Details
          </button>
          <button onClick={() => handleRefreshUser(user.id)} className="underline">
            {isRefreshingUser ? 'Refreshing...' : 'Refresh Score'}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
