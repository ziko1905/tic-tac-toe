const gameBoard = (function() {
    let board = [];
    for (let n = 0; n < 3; n++) {
        board.push([]);
        for (let m = 0; m < 3; m++) {
            board[n].push(null);
        } 
    }

    let spaceLeft = [9];
    
    function addToBoard(y, x, sign) {
        if (!board[y][x]) {
            board[y][x] = sign
            spaceLeft[0] = spaceLeft[0] - 1;
        }
        else return false
        return true
    }

    function resetBoard() {
        for (let n = 0; n < 3; n++) {
            for (let m = 0; m < 3; m++) {
                board[n][m] = null;
            } 
        }

        while (spaceLeft[0] < 9) spaceLeft[0] = spaceLeft[0] + 1;
    }

    function checkCols() {
        rowsLoop:
        for (let n = 0; n < 3; n++) {
            if (board[n][0] === null) continue
            for (let m = 1; m < 3; m++) {
                if (board[n][m] != board[n][m-1]) continue rowsLoop
            }
            return board[n][2]
        }
        return false
    }

    function checkRows() {
        colsLoop:
        for (let n = 0; n < 3; n++) {
            if (board[0][n] === null) continue
            for (let m = 1; m < 3; m++) {
                if (board[m][n] != board[m-1][n]) continue colsLoop
            }
            return board[2][n]
        }
        return false
    }

    function checkDigs() {
        digsLoop:
        for (let n of [[0, 1, 2], [2, 1, 0]]) {
            if (!board[0][n[0]]) continue digsLoop
            for (let m = 1; m < 3; m++) {    
                if (board[m][n[m]] != board[m-1][n[m-1]]) continue digsLoop   
            }
            return board[2][n[2]]
        }
        return false
    }

    function checkWinner() {
        for (let winner of [checkCols(), checkRows(), checkDigs()]) {
            if (winner) return winner
        }
        if (!spaceLeft[0]) return true
        return false
    }

    return { addToBoard, resetBoard, checkWinner, board, spaceLeft }
})()

const Player = function(name, sign) {
    let score = 0;

    return { name, sign, score }
}

const gameFlow = (function() {
    let turn;
    let nextTurn;
    createPlayers()

    function createPlayers() {
        // This is temporary until frontend is designed
        ply1 = Player("cross", "X")
        ply2 = Player("circle", "O")
        turn = ply1
        nextTurn = ply1
    }
    
    function placeItem(x, y) {
        if (gameBoard.addToBoard(x, y, turn.sign)) {
            if (gameBoard.checkWinner()) {
                if (gameBoard.checkWinner() === turn.sign) {
                    ++turn.score
                    console.log(`${turn.name} won, congrats!`)
                } else console.log("Its a Tie!")
                gameBoard.resetBoard()
                turn = nextTurn;
                nextTurn = nextTurn == ply2 ? ply1 : ply2;
            }
            else {
                if (turn == ply1) turn = ply2
                else turn = ply1
            }
        }
    }

    return { placeItem }
})()

