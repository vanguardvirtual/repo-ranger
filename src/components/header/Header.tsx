const Header = () => {
  return (
    <>
      <span className="white-dot"></span>
      <h1 className="text-xl font-bold">Welcome to Repo-Ranger</h1>
      <p className="mb-2">The AI-powered Github leaderboard.</p>
      <p>
        Created by{' '}
        <a href="https://x.com/sotergreco" target="_blank" rel="noopener noreferrer">
          @sotergreco
        </a>
        {' - '}
        <span>
          Find the code for this project on{' '}
          <a href="https://github.com/vanguardvirtual/repo-ranger" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </span>
      </p>
      <p className="mb-4">
        Repo-Ranger is an AI-powered Github leaderboard. It analyzes your Github activity and based on your score{' '}
        <span className="text-xl">(💯)</span> you win a clap <span className="text-xl">(👏)</span> or a poo
        <span className="text-xl">(💩)</span>. Top 10 will get <span className="text-xl">🌟</span>
      </p>
      <p className="mb-2">How we calculate your score?</p>
      <p>
        🤝 Commits: <b className="underline">+1</b> point for each commit
      </p>
      <p>
        👥 Followers: <b className="underline">+3</b> point for each follower
      </p>
      <p>
        🔍 Following: <b className="underline">-1</b> point for each person you follow
      </p>
      <p>
        📁 Repositories: <b className="underline">+2</b> points for each repository
      </p>
      <p>
        ⭐ Stars: <b className="underline">+3</b> points for each star
      </p>
      <p>
        🍴 Forks: <b className="underline">+1</b> point for each fork
      </p>
      <p>
        🔀 Pull Requests: <b className="underline">+2</b> point for each pull request
      </p>
      <p>
        🐛 Issues: <b className="underline">+1</b> point for each issue
      </p>
    </>
  );
};

export default Header;
