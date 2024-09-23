export const formatNumber = (score: number) => {
  return new Intl.NumberFormat('en-US').format(score);
};
