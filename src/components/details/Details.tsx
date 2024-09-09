import useGetGitHubUserData from '@api/getUserGitData';
import { IoMdClose } from 'react-icons/io';
import { IUser } from '../../types';
import { useEffect } from 'preact/hooks';

interface DetailsProps {
  user: IUser;
  onClose: () => void;
}

const Details: React.FC<DetailsProps> = ({ user: userData, onClose }) => {
  const { data, isLoading, error } = useGetGitHubUserData(userData.username);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full m-4 max-h-[80vh] overflow-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" aria-label="Close">
          <IoMdClose size={24} />
        </button>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error fetching user data</div>
        ) : data ? (
          <>
            <div className="flex gap-2 items-center mb-4">
              <h2 className="text-2xl font-bold">User Details</h2>
              <a href={data.user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                View on GitHub
              </a>
            </div>

            <div className="mb-4 flex items-center">
              <img src={data.user.avatar_url} alt={`${data.user.name}'s avatar`} className="w-20 h-20 rounded-full mr-4" />
              <div>
                <h3 className="text-xl font-semibold">{data.user.name}</h3>
                <p className="text-gray-600">@{data.user.login}</p>
              </div>
            </div>

            <div className="mb-4">
              <p>
                <strong>Bio:</strong> {data.user.bio || 'N/A'}
              </p>
              <p>
                <strong>Location:</strong> {data.user.location || 'N/A'}
              </p>
              <p>
                <strong>Blog:</strong>{' '}
                {data.user.blog ? (
                  <a href={data.user.blog} target="_blank" rel="noopener noreferrer">
                    {data.user.blog}
                  </a>
                ) : (
                  'N/A'
                )}
              </p>
              <p>
                <strong>Twitter:</strong> {data.user.twitter_username ? `@${data.user.twitter_username}` : 'N/A'}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <p>
                <strong>Followers:</strong> {data.followers.length}
              </p>
              <p>
                <strong>Following:</strong> {data.following.length}
              </p>
              <p>
                <strong>Public Repos:</strong> {data.repos.length}
              </p>
              <p>
                <strong>Public Gists:</strong> {data.gists.length}
              </p>
              <p>
                <strong>Starred Repos:</strong> {data.starred.length}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Recent Followers</h4>
              <div className="flex flex-wrap">
                {data.followers.slice(0, 5).map((follower) => (
                  <img
                    key={follower.login}
                    src={follower.avatar_url}
                    alt={follower.login}
                    className="w-10 h-10 rounded-full mr-2 mb-2"
                    title={follower.login}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Recent Repositories</h4>
              <ul className="list-disc list-inside">
                {data.repos.slice(0, 5).map((repo) => (
                  <li key={repo.name}>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {repo.name}
                    </a>
                    {repo.description && <span className="text-sm text-gray-600"> - {repo.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Details;
