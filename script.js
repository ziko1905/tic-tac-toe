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

    return { board, addToBoard }
})()