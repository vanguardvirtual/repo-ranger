import { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';
import Details from '../details/Details';
import useGetAllUsers from '@api/getAllUsers';
import { IUser } from '../../types';
import useCreateUser from '@api/createUser';

const Scoreboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { isLoading, data: users, refetch } = useGetAllUsers({ query: searchQuery });
  const { mutate: createUser, isLoading: isCreatingUser, isSuccess: isUserCreated, data: createdUser, isError } = useCreateUser();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiEmoji, setConfettiEmoji] = useState('');

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '500px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleAddUser = () => {
    createUser({ username: newUsername });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      setNewUsername(e.target.value);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      setSearchInput(e.target.value);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  useEffect(() => {
    if (isUserCreated && createdUser) {
      refetch();
      setConfettiEmoji(createdUser.username.emoji);
      setConfettiActive(true);

      setTimeout(() => setConfettiActive(false), 3000);
    }
  }, [isUserCreated, createdUser, refetch]);

  const customConfettiConfig = {
    ...confettiConfig,
    elementCount: 200,
    render: () => <div style={{ fontSize: '10px' }}>{confettiEmoji}</div>,
    confettiEmoji: confettiEmoji,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">Scoreboard</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="Add your github username"
            className="border border-gray-300 p-2 rounded w-full sm:w-auto"
          />
          <button onClick={handleAddUser} className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto mt-2 sm:mt-0">
            {isCreatingUser ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
      <div className="w-full text-end mb-4">{isError ? <p>Username not found, try another username</p> : null}</div>
      <div className="flex justify-center mb-2 mt-8">
        <input
          type="text"
          placeholder="Search by username"
          value={searchInput}
          onChange={handleSearchChange}
          className="p-2 w-full border"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded ml-2">
          Search
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Username</th>
              <th className="border border-gray-300 p-2 text-left">Contributions</th>
              <th className="border border-gray-300 p-2 text-left">Fav Lang</th>
              <th className="border border-gray-300 p-2 text-left">Location</th>
              <th className="border border-gray-300 p-2 text-left">Score</th>
              <th className="border border-gray-300 p-2 text-left">Emoji</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: IUser) => (
              <tr key={user.username}>
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.contributions}</td>
                <td className="border border-gray-300 p-2">{user.fav_language}</td>
                <td className="border border-gray-300 p-2">{user.location}</td>
                <td className="border border-gray-300 p-2">{user.score}</td>
                <td className="border border-gray-300 p-2">{user.emoji}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => setSelectedUser(user)} className="underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Confetti active={confettiActive} config={customConfettiConfig} />
      </div>
      {selectedUser && <Details user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default Scoreboard;
