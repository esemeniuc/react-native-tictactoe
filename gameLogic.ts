//check diagonals, and along col and row
export function isWin(state: Array<Array<string>>): boolean {
    for (let i = 0; i < 3; i++) {
        if ((state[i][0] === state[i][1] && state[i][1] === state[i][2] && state[i][0] !== '_') ||
            (state[0][i] === state[1][i] && state[1][i] === state[2][i] && state[0][i] !== '_')) {
            return true;
        }
    }
    return ((state[0][0] === state[1][1] && state[1][1] === state[2][2]) || //cross
        (state[2][0] === state[1][1] && state[1][1] === state[0][2])) && state[1][1] !== '_';
}

//all spaces are set is a tie
export function  isTie(state: Array<Array<string>>): boolean {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === '_') {
                return false;
            }
        }
    }
    return true;
}
