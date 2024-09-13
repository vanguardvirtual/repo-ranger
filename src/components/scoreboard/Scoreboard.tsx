import { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';
import Details from '@components/details/Details';
import useGetAllUsers from '@api/getAllUsers';
import { IUser } from '../../types';
import useCreateUser from '@api/createUser';
import Search from '@components/search/Search';
import TextInput from '@components/input/TextInput';
import UserRow from '@components/scoreboard/UserRow';

const Scoreboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, data: users, refetch } = useGetAllUsers({ query: searchQuery });
  const { mutate: createUser, isLoading: isCreatingUser, isSuccess: isUserCreated, data: createdUser, isError } = useCreateUser();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    if (isUserCreated && createdUser) {
      refetch();
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 3000);
    }
  }, [isUserCreated, createdUser, refetch]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">Scoreboard</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <TextInput handleInputChange={handleInputChange} />
          <button onClick={handleAddUser} className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto mt-2 sm:mt-0">
            {isCreatingUser ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
      <div className="w-full text-end mb-4">{isError ? <p>Username not found, try another username</p> : null}</div>
      <div className="flex justify-center mb-2 mt-8">
        <Search handleSearch={handleSearch} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">#</th>
              <th className="border border-gray-300 p-2 text-left">Avatar</th>
              <th className="border border-gray-300 p-2 text-left">Username</th>
              <th className="border border-gray-300 p-2 text-left">Fav Lang</th>
              <th className="border border-gray-300 p-2 text-left">Location</th>
              <th className="border border-gray-300 p-2 text-left">Score</th>
              <th className="border border-gray-300 p-2 text-left">Emoji</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.data?.map((user: IUser, index: number) => (
              <UserRow
                hasUserBeenCreated={isUserCreated}
                createdUser={createdUser?.username}
                key={user.username}
                user={user}
                index={index}
                setSelectedUser={setSelectedUser}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Confetti active={confettiActive} config={confettiConfig} />
      </div>
      {selectedUser && <Details user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default Scoreboard;
