export const GET_RANDOM_BOARD = (difficulty) => {
    return `https://sugoku.herokuapp.com/board?difficulty=${difficulty}`;
};

export const SOLVE_BOARD = 'https://sugoku.herokuapp.com/solve';

