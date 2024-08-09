const gameBoard = (function() {
    let board = [];
    for (let n = 0; n < 3; n++) {
        board.push([])
        for (let m = 0; m < 3; m++) {
            board[n].push(null)
        } 
    }

    function addToBoard(y, x, sign) {
        if (!board[y][x]) board[y][x] = sign
        else return false
        return true
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

    return { board, addToBoard, checkCols }
})()