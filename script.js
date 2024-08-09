const gameBoard = (function() {
    let board;
    let spaceLeft;
    resetBoard()
    
    function addToBoard(y, x, sign) {
        if (!board[y][x]) {
            board[y][x] = sign
            spaceLeft -= 1;
        }
        else return false
        return true
    }

    function resetBoard() {
        board = [];
        for (let n = 0; n < 3; n++) {
            board.push([]);
            for (let m = 0; m < 3; m++) {
                board[n].push(null);
            } 
        }

        spaceLeft = 9;
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
        if (!spaceLeft) return false
    }

    return { addToBoard, resetBoard, checkWinner }
})()

const gameFlow = (function() {
    function createPlayers() {
        // This is temporary until frontend is designed
        ply1 = Player("cross", "X")
        ply2 = Player("circle", "O")
    }

    let turn = ply1;

    function placeItem(x, y) {
        if (gameBoard.addToBoard(x, y, turn.playerSign)) {
            if (gameBoard.checkWinner()) {
                gameBoard.resetBoard()
                if (gameBoard.checkWinner()[1]) {
                    ++turn.score
                    console.log(`${turn.playerName} won, congrats!`)
                } else console.log("Its a Tie!")

                if (turn == ply1) turn = ply2
                else turn = ply1
            }
        }
    }

    return { placeItem }
})()

const Player = function(name, sign) {
    let playerName = name;
    let playerSign = sign;
    let score = 0;

    return { playerName, playerSign, score }
}