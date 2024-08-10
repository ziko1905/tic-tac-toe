const gameBoard = (function() {
    let board;
    let spaceLeft;
    
    function addToBoard(y, x, sign) {
        if (!board[y][x]) {
            board[y][x] = sign
            spaceLeft -= 1;
        }
        else return false
        return true
    }

    function resetBoard() {
        board = []
        for (let n = 0; n < 3; n++) {
            board.push([])
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
        if (!spaceLeft) return true
        return false
    }

    resetBoard()

    return { addToBoard, resetBoard, checkWinner, board }
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
        turn = ply1;
        nextTurn = ply2;
    }
    
    function placeItem(x, y) {
        if (gameBoard.addToBoard(x, y, turn.sign)) {
            dispControler.placeImage(x, y, turn.sign)
            if (gameBoard.checkWinner()) {
                prepareBoard = function() {
                    gameBoard.resetBoard()
                    dispControler.resetBoardDisp()
                    turn = nextTurn;
                    nextTurn = nextTurn == ply2 ? ply1 : ply2;
                }
                if (gameBoard.checkWinner() === turn.sign) {
                    ++turn.score
                    setTimeout(function () { 
                        alert(`${turn.name} won, congrats!`)
                        console.log("continue")
                        prepareBoard()
                    }, 1)
                } else setTimeout(function () { 
                    alert("Its a Tie!")
                    prepareBoard()
                }, 1)
                
            }
            else {
                if (turn == ply1) turn = ply2
                else turn = ply1
            }
        }
    }

    return { placeItem }
})()

const dispControler = (function() {
    const divs = document.querySelectorAll(".item");

    function functionalizeItemDivs() {
        for (div of divs) {
            div.addEventListener("click", (e) => gameFlow.placeItem(Math.floor(e.target.id[2] / 3), e.target.id[2] % 3))
        }
    }

    function placeImage(x, y, sign) {
        const id = x * 3 + y; 
        const image = document.createElement("img");
        const place = document.querySelector(`#id${id}`)

        if (sign == "X") image.setAttribute("src", "media/Cross-draw-image.svg.png")
        else image.setAttribute("src", "media/circle-outline-shape.svg")

        place.appendChild(image)
    }

    function resetBoardDisp() {
        for (div of divs) {
            div.textContent = ""
        }
    }

    functionalizeItemDivs()

    return { placeImage, resetBoardDisp }
})()

