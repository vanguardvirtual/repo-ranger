import { createUsername } from '../src/controller';
import { retrieveGithubInformation, generateAiNickname, generateAiDescription } from '../src/service';
import { Username } from '../src/model';
import { resFn } from '../src/utils';
import { NextFunction, Request, Response } from 'express';

jest.mock('@/model', () => {
  class Username {
    static findOne = jest.fn();
    static save = jest.fn();
    save = jest.fn(); // Instance method
  }
  return { Username };
});

jest.mock('@/service', () => ({
  retrieveGithubInformation: jest.fn(),
  generateAiNickname: jest.fn(),
  generateAiDescription: jest.fn(),
}));
jest.mock('@/utils', () => ({
  asyncFn: jest.fn(
    (fn) =>
      (...args: Parameters<typeof fn>) =>
        Promise.resolve(fn(...args)),
  ),
  resFn: jest.fn(),
}));

describe('createUsername Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 400 if username is not provided', async () => {
    req.body = {};
    await createUsername(req as Request, res as Response, next as NextFunction);

    expect(resFn).toHaveBeenCalledWith(res, {
      data: null,
      message: 'Username is required',
      status: 400,
      success: false,
      error: 'Username is required',
    });
  });

  it('should return 400 if username already exists', async () => {
    (Username.findOne as jest.Mock).mockResolvedValueOnce(true);
    req.body = { username: 'testuser' };

    await createUsername(req as Request, res as Response, next as NextFunction);

    expect(Username.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    expect(resFn).toHaveBeenCalledWith(res, {
      data: null,
      message: 'Username already exists',
      status: 400,
      success: false,
      error: 'Username already exists',
    });
  });

  it('should return 404 if GitHub user is not found', async () => {
    (Username.findOne as jest.Mock).mockResolvedValueOnce(null);
    (retrieveGithubInformation as jest.Mock).mockResolvedValueOnce({ status: 404 });
    req.body = { username: 'testuser' };

    await createUsername(req as Request, res as Response, next as NextFunction);

    expect(retrieveGithubInformation).toHaveBeenCalledWith('testuser');
    expect(resFn).toHaveBeenCalledWith(res, {
      data: null,
      message: 'User not found',
      status: 404,
      success: false,
      error: 'User not found',
    });
  });

  it('should create a new username if valid', async () => {
    (Username.findOne as jest.Mock).mockResolvedValueOnce(null);
    (retrieveGithubInformation as jest.Mock).mockResolvedValueOnce({
      score: 10,
      country: 'US',
      favoriteLanguage: 'JavaScript',
      contributions: 100,
      status: 200,
      name: 'Test User',
      bio: 'Test Bio',
      avatar: 'test-avatar-url',
      followers: 10,
      following: 5,
      github_url: 'https://github.com/testuser',
    });
    (generateAiNickname as jest.Mock).mockResolvedValueOnce('AI Nickname');
    (generateAiDescription as jest.Mock).mockResolvedValueOnce('AI Description');

    req.body = { username: 'testuser' };

    await createUsername(req as Request, res as Response, next as NextFunction);

    expect(Username.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    expect(generateAiNickname).toHaveBeenCalled();
    expect(generateAiDescription).toHaveBeenCalled();
    expect(resFn).toHaveBeenCalledWith(res, {
      data: expect.objectContaining({
        username: 'testuser',
        ai_nickname: 'AI Nickname',
        ai_description: 'AI Description',
      }),
      message: 'Username created',
      status: 200,
      success: true,
      error: '',
    });
  });
});
