# Repo-Ranger

The AI-powered Github leaderboard.

Created by [@sotergreco](https://x.com/sotergreco) - Find the code for this project on [Github](https://github.com/vanguardvirtual/repo-ranger)

Repo-Ranger is an AI-powered Github leaderboard. It analyzes your Github activity and based on your score (💯) you win a clap (👏) or a poo(💩). Top 10 will get 🌟

## Table of Contents

1. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   2. [Installation](#installation)
   3. [Running the Application](#running-the-application)
2. [Features](#features)
3. [How It Works](#how-it-works)
4. [API Endpoints](#api-endpoints)
5. [Contributing](#contributing)
6. [License](#license)
7. [Acknowledgments](#acknowledgments)

## Getting Started

### Prerequisites

- Node.js (version specified in package.json)
- pnpm
- MySQL database
- MongoDB database
- Github Access Token

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/vanguardvirtual/repo-ranger.git
   ```

2. Install dependencies for both frontend and backend:

   ```
   pnpm install
   cd api && pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and the `api` directory, and add the necessary environment variables (refer to `.env.example` if available).

### Running the Application

1. Start the backend server:

   ```
   cd api && pnpm run dev
   ```

2. Start the frontend development server:

   ```
   pnpm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` (or the port specified in your configuration).

## API Endpoints

All the API endpoints are on Bruno, we haven't set up Bruno yet. It is coming in the future. (Check here for updates: https://github.com/vanguardvirtual/repo-ranger/issues/11)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Preact](https://preactjs.com/) for the frontend framework
- [ESLint](https://eslint.org/) for the linter
- [Prettier](https://prettier.io/) for the code formatter
- [Husky](https://typicode.github.io/husky/) for the pre-commit hooks
- [Express](https://expressjs.com/) for the backend server
- [TypeORM](https://typeorm.io/) for database management
- [Anthropic AI](https://www.anthropic.com/) for AI-generated descriptions
- [Twitter API](https://developer.twitter.com/en/docs/twitter-api) for social media integration
- [Github API](https://docs.github.com/en/rest) for Github integration
- [MongoDB](https://www.mongodb.com/) for the database
- [MySQL](https://www.mysql.com/) for the database
- [Railway](https://railway.app/) for the deployment
