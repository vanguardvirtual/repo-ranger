# Changelog

## 29/9/2024

- Created new get last id function on username service
- Fixed cron job error on id reset above 10
- Updated User Details to fetch data diretly from the API
- Added default value on created_at on username
- Fixed Broken Cron Job and fixed broken timestamps
- Fixed error not creating username passing wrong argument in user contr
- On create user save repos as well

## 21/9/2024

- Added Bruno API documentation
- Fixed problem with repos not saving the created_at field
- Username service now is saving the created_at field
- Added trending users on the frontend with animations
- Included trending users on the search results
- Added bruno trending endpoint
- Updated username tests to include emoji service

## 20/9/2024

- Refresh user now is saving the events and the repos for each user
- Fixes bugs on cron job to not run on already save users
- Fixed problem with circular dependency
- Made cron job to only work on production
- Created tests for events and repo services
- Create service and controller for trending users (users with most events in the last 24 hours)
- Created tests for trending users
- Fixed problem with circular dependency on github-events.model.ts

## 19/9/2024

- Updated the husky pre-commit hook to run tests before committing
- Updated tests to work with the new api structure
- Removed refresh score from endpoint and moved it to a cron job
- Removed refresh score from user details view
- Update alias for import
- Fixed problem with circular dependency
- Made cron job to only work on production

## 18/9/2024

- Created tests for controllers and services
- Updated dependencies
- Refactored the entire API code to be more clear and organized

## 16/9/2024

- Fixed details popup when user does not have https on their blog link it now adds it for them. ([text](https://github.com/vanguardvirtual/repo-ranger/issues/7))
- Fixed bug on return statement of create user api call. Added the correct interface to the response.
- Created issue templates for new enhancements and bugs
- Fixed cron jobs for random user tweets. Added agenda for cron jobs and removed node-cron, also installed mongodb to work with agenda
- Updated README.md with all the dependencies and credits
- Created CONTRIBUTING.md with the code of conduct and the process for submitting pull requests
- Created .env.example files

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
