import { Username } from '@models/username.model';

const getEmoji = (score: number, topUsers: Username[]): string => {
  if (topUsers) {
    if (topUsers.length === 0) {
      return '💩'; // Default emoji if no users exist
    }

    const userRank = topUsers.findIndex((user) => user.score <= score) + 1;

    if (userRank === 1) {
      return '😂'; // Top 1 user gets laugh face
    }

    if (userRank >= 2 && userRank <= 10) {
      return '🌟'; // Top 2-10 users get star
    }

    if (score >= 1000) {
      return '👏';
    }
  }
  return '💩';
};

export default { getEmoji };
