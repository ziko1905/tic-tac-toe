const gameBoard = (function() {
    let board = [];
    for (let n = 0; n < 3; n++) {
        board.push([])
        for (let m = 0; m < 3; m++) {
            board[n].push(null)
        } 
    }

    return { board }
})()