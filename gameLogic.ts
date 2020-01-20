//check diagonals, and along col and row

export enum Winner {X, O, TIE, NONE}

export enum BoardSelection {X, O, NONE}

export function getWinner(board: Array<Array<BoardSelection>>): Winner {
    const selection2winner = (input: BoardSelection): Winner => {
        switch (input) {
            case BoardSelection.X:
                return Winner.X;
            case BoardSelection.O:
                return Winner.O;
        }
    };
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] &&
            board[i][1] === board[i][2] &&
            board[i][0] !== BoardSelection.NONE) {
            return selection2winner(board[i][0]);
        }
        if (board[0][i] === board[1][i] &&
            board[1][i] === board[2][i] &&
            board[0][i] !== BoardSelection.NONE) {
            return selection2winner(board[0][i]);
        }
    }
    if (((board[0][0] === board[1][1] && board[1][1] === board[2][2]) || //cross
        (board[2][0] === board[1][1] && board[1][1] === board[0][2])) && board[1][1] !== BoardSelection.NONE) {
        return selection2winner(board[1][1]);
    }

    return isTie(board) ? Winner.TIE : Winner.NONE;
}

//all spaces are set is a tie
export function isTie(state: Array<Array<BoardSelection>>): boolean {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === BoardSelection.NONE) {
                return false;
            }
        }
    }
    return true;
}
