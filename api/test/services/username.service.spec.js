import usernameService from '@/services/username.service';
import githubService from '@/services/github.service';
import scoreService from '@/services/score.service';
import { Username } from '@/models/username.model';
jest.mock('@/models/username.model');
jest.mock('@/services/github.service');
jest.mock('@/services/score.service');
describe('Username Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockUsernameDTO = {
    username: 'testUser',
    score: 100,
    extra_score: 10,
    location: 'Nowhere',
    fav_language: 'JavaScript',
    contributions: 50,
    avatar: 'avatar.jpg',
    bio: 'I am a test user',
    name: 'Test User',
    followers: 10,
    following: 5,
    github_url: 'https://github.com/testUser',
    twitter_username: 'testTwitter',
    ai_description: 'A test AI description',
    ai_nickname: 'Testy',
    ai_description_updated_at: new Date(),
    created_at: new Date(),
    total_score: 100,
    twitter_posts: [],
    id: 1,
    email: 'testuser@example.com',
  };
  test('createUsername should create a new username', async () => {
    const mockFindOne = Username.findOne;
    mockFindOne.mockResolvedValue(null); // No existing username
    const mockSave = Username.prototype.save;
    mockSave.mockResolvedValue(mockUsernameDTO);
    const result = await usernameService.createUsername(mockUsernameDTO);
    expect(result).toEqual(mockUsernameDTO);
  });
  test('createUsername should throw if username exists', async () => {
    const mockFindOne = Username.findOne;
    mockFindOne.mockResolvedValue({ ...mockUsernameDTO }); // Username exists
    await expect(usernameService.createUsername(mockUsernameDTO)).rejects.toThrow('Username already exists');
  });
  test('updateUsername should update an existing username', async () => {
    const mockFindOne = Username.findOne;
    const mockUsername = { ...mockUsernameDTO, save: jest.fn() };
    mockFindOne.mockResolvedValue(mockUsername);
    jest.mocked(githubService.getGithubUserRepositories).mockResolvedValue([
      {
        id: 12345,
        node_id: 'MDEwOlJlcG9zaXRvcnkxMjM0NQ==',
        name: 'repo1',
        full_name: 'testUser/repo1',
        private: false,
        owner: {
          login: 'testUser',
          id: 12345,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjEyMzQ1',
          avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/testUser',
          html_url: 'https://github.com/testUser',
          followers_url: 'https://api.github.com/users/testUser/followers',
          following_url: 'https://api.github.com/users/testUser/following{/other_user}',
          gists_url: 'https://api.github.com/users/testUser/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/testUser/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/testUser/subscriptions',
          organizations_url: 'https://api.github.com/users/testUser/orgs',
          repos_url: 'https://api.github.com/users/testUser/repos',
          events_url: 'https://api.github.com/users/testUser/events{/privacy}',
          received_events_url: 'https://api.github.com/users/testUser/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/testUser',
        description: 'A test repository',
        fork: false,
        url: 'https://api.github.com/repos/testUser/repo1',
        forks_url: 'https://api.github.com/repos/testUser/repo1/forks',
        keys_url: 'https://api.github.com/repos/testUser/repo1/keys{/key_id}',
        collaborators_url: 'https://api.github.com/repos/testUser/repo1/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/testUser/repo1/teams',
        hooks_url: 'https://api.github.com/repos/testUser/repo1/hooks',
        issue_events_url: 'https://api.github.com/repos/testUser/repo1/issues/events{/number}',
        events_url: 'https://api.github.com/repos/testUser/repo1/events',
        assignees_url: 'https://api.github.com/repos/testUser/repo1/assignees{/user}',
        branches_url: 'https://api.github.com/repos/testUser/repo1/branches{/branch}',
        tags_url: 'https://api.github.com/repos/testUser/repo1/tags',
        blobs_url: 'https://api.github.com/repos/testUser/repo1/git/blobs{/sha}',
        git_tags_url: 'https://api.github.com/repos/testUser/repo1/git/tags{/sha}',
        git_refs_url: 'https://api.github.com/repos/testUser/repo1/git/refs{/sha}',
        trees_url: 'https://api.github.com/repos/testUser/repo1/git/trees{/sha}',
        statuses_url: 'https://api.github.com/repos/testUser/repo1/statuses/{sha}',
        languages_url: 'https://api.github.com/repos/testUser/repo1/languages',
        stargazers_url: 'https://api.github.com/repos/testUser/repo1/stargazers',
        contributors_url: 'https://api.github.com/repos/testUser/repo1/contributors',
        subscribers_url: 'https://api.github.com/repos/testUser/repo1/subscribers',
        subscription_url: 'https://api.github.com/repos/testUser/repo1/subscription',
        commits_url: 'https://api.github.com/repos/testUser/repo1/commits{/sha}',
        git_commits_url: 'https://api.github.com/repos/testUser/repo1/git/commits{/sha}',
        comments_url: 'https://api.github.com/repos/testUser/repo1/comments{/number}',
        issue_comment_url: 'https://api.github.com/repos/testUser/repo1/issues/comments{/number}',
        contents_url: 'https://api.github.com/repos/testUser/repo1/contents/{+path}',
        compare_url: 'https://api.github.com/repos/testUser/repo1/compare/{base}...{head}',
        merges_url: 'https://api.github.com/repos/testUser/repo1/merges',
        archive_url: 'https://api.github.com/repos/testUser/repo1/{archive_format}{/ref}',
        downloads_url: 'https://api.github.com/repos/testUser/repo1/downloads',
        issues_url: 'https://api.github.com/repos/testUser/repo1/issues{/number}',
        pulls_url: 'https://api.github.com/repos/testUser/repo1/pulls{/number}',
        milestones_url: 'https://api.github.com/repos/testUser/repo1/milestones{/number}',
        notifications_url: 'https://api.github.com/repos/testUser/repo1/notifications{?since,all,participating}',
        labels_url: 'https://api.github.com/repos/testUser/repo1/labels{/name}',
        releases_url: 'https://api.github.com/repos/testUser/repo1/releases{/id}',
        deployments_url: 'https://api.github.com/repos/testUser/repo1/deployments',
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
        pushed_at: '2024-02-01T00:00:00Z',
        git_url: 'https://github.com/testUser/repo1.git',
        ssh_url: 'git@github.com:testUser/repo1.git',
        clone_url: 'https://github.com/testUser/repo1.git',
        svn_url: 'https://github.com/testUser/repo1',
        homepage: null,
        size: 100,
        stargazers_count: 10,
        watchers_count: 10,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: true,
        has_discussions: true,
        forks_count: 10,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 10,
        license: null,
        allow_forking: true,
        is_template: false,
        web_commit_signoff_required: false,
        topics: ['test', 'test2'],
        visibility: 'public',
        forks: 10,
        open_issues: 10,
        watchers: 10,
        default_branch: 'main',
      },
    ]);
    jest.mocked(githubService.getGithubUserCommits).mockResolvedValue([
      {
        sha: '12345',
        node_id: '12345',
        commit: {
          author: {
            name: 'Test User',
            email: 'testuser@example.com',
            date: '2024-02-01T00:00:00Z',
          },
          committer: {
            name: 'Test User',
            email: 'testuser@example.com',
            date: '2024-02-01T00:00:00Z',
          },
          message: 'A test commit',
          tree: {
            sha: '12345',
            url: 'https://github.com/testUser/repo1',
          },
          url: 'https://github.com/testUser/repo1',
          comment_count: 10,
          verification: {
            verified: true,
            reason: 'A test reason',
            signature: 'A test signature',
            payload: null,
          },
        },
        url: 'https://github.com/testUser/repo1',
        html_url: 'https://github.com/testUser/repo1',
        comments_url: 'https://github.com/testUser/repo1/comments',
        author: {
          login: 'testUser',
          id: 12345,
          node_id: '12345',
          avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/testUser',
          html_url: 'https://github.com/testUser',
          followers_url: 'https://api.github.com/users/testUser/followers',
          following_url: 'https://api.github.com/users/testUser/following{/other_user}',
          gists_url: 'https://api.github.com/users/testUser/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/testUser/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/testUser/subscriptions',
          organizations_url: 'https://api.github.com/users/testUser/orgs',
          repos_url: 'https://api.github.com/users/testUser/repos',
          events_url: 'https://api.github.com/users/testUser/events{/privacy}',
          received_events_url: 'https://api.github.com/users/testUser/received_events',
          type: 'User',
          site_admin: false,
        },
        committer: {
          login: 'testUser',
          id: 12345,
          node_id: '12345',
          avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/testUser',
          html_url: 'https://github.com/testUser',
          followers_url: 'https://api.github.com/users/testUser/followers',
          following_url: 'https://api.github.com/users/testUser/following{/other_user}',
          gists_url: 'https://api.github.com/users/testUser/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/testUser/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/testUser/subscriptions',
          organizations_url: 'https://api.github.com/users/testUser/orgs',
          repos_url: 'https://api.github.com/users/testUser/repos',
          events_url: 'https://api.github.com/users/testUser/events{/privacy}',
          received_events_url: 'https://api.github.com/users/testUser/received_events',
          type: 'User',
          site_admin: false,
        },
        parents: [
          {
            sha: '12345',
            url: 'https://github.com/testUser/repo1',
            html_url: 'https://github.com/testUser/repo1',
          },
        ],
      },
    ]);
    jest.mocked(githubService.getGithubUserPullRequests).mockResolvedValue(10);
    jest.mocked(scoreService.calculateScore).mockResolvedValue(150);
    mockUsername.save.mockResolvedValue({ ...mockUsername, score: 150 });
    const result = await usernameService.updateUsername(mockUsernameDTO);
    expect(result).toBeDefined();
    expect(result.score).toBe(150);
    expect(mockUsername.save).toHaveBeenCalled();
  });
  test('findByUsername should find a username', async () => {
    const mockFindOne = Username.findOne;
    mockFindOne.mockResolvedValue(mockUsernameDTO);
    const result = await usernameService.findByUsername('testUser');
    expect(result).toEqual(mockUsernameDTO);
  });
  test('getAllUsernames should return all usernames', async () => {
    const mockFind = Username.find;
    mockFind.mockResolvedValue([mockUsernameDTO, { username: 'anotherUser' }]);
    const result = await usernameService.getAllUsernames();
    expect(result.length).toBeGreaterThan(0);
  });
  test('searchUsernames should return usernames matching query', async () => {
    const mockFind = Username.find;
    mockFind.mockResolvedValue([mockUsernameDTO]);
    const result = await usernameService.searchUsernames('test');
    expect(result[0]).toMatchObject({ username: expect.stringContaining('test') });
  });
  test('get should return a user by id', async () => {
    const mockFindOne = Username.findOne;
    mockFindOne.mockResolvedValue(mockUsernameDTO);
    const result = await usernameService.get(1);
    expect(result).toEqual(mockUsernameDTO);
  });
  // Add more tests for other methods like getTopUsers, getRandomUser, etc.
});
