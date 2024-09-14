# Changelog

## 14/9/2024

- Connect twitter api
- Added Extra Points to users
- Created TwitterPost entity to save all tweets
- Created example tweet
- Create CRON jobs for posting random users to twitter
- Create CRON jobs to add extra point to users based on their promotion performance

## 13/9/2024

- Created asyncFn handler to not repeat code
- Refactored all api calls to use asyncFn
- Refactored frontend api calls to use reponse interface
- Updated eslint to work with api/src as well
- Updated eslint package.json commands.

## 12/9/2024

- Fixed too quick notification, now it's 8 seconds to close and sends them every 15 seconds

## 10/9/2024

- Added analytics tracking code
- Added Refresh User Score
- Made Scoreboard into mulitple components for re-usability
- Added Avatar on scoreboard
- Added top 1 different emoji
- Added Anthropic AI to generate AI descriptions for users
- Added notification toggle to homepage
- Added notifiocations with react toastify
- Made github request authenticated to not get rate limited
- Fixed duplicate error on username creation
- Moved from fetch to axios
- Added music toggle to homepage
- Added IRC chat

## 9/9/2024

- Finished frontend with preact added scoreboard and details view
- Finished API for create users, get users, get user by id etc
- Created api endpoints with react query for create, search, get single, refresh and get github user
- Created search functionality for users
- Added husky for pre-commit hooks
- Added eslint for code linting
- Added prettier for code formatting
- Added mysql and typeorm for the database
- Added a rate limiter for the API
