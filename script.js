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

const dispControler = (function() {
    const divs = document.querySelectorAll(".item");
    managePrompt()

    function managePrompt() {
        const form = document.querySelector("form")
        const prompt = document.querySelector(".prompt")
        
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            gameFlow.createPlayers(formData.get("ply1-name"), formData.get("ply2-name"))
            insertNames(formData.get("ply1-name"), formData.get("ply2-name"))
            prompt.remove()
        })
    }

    function insertNames(val1, val2) {
        const name1 = document.querySelector(".name1")
        const name2 = document.querySelector(".name2")

        name1.textContent = val1 ? `${val1}: ` : "Cross: ";
        name2.textContent = val2 ? `${val2}: ` : "Circle: ";
    }

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

    function changeTurn(sign) {
        const cross = document.querySelector("#cross");
        const circle = document.querySelector("#circle");

        console.log(cross)
        cross.setAttribute("class", sign == "X" ? "turn" : "" )
        circle.setAttribute("class", sign == "O" ? "turn" : "")
    }

    function changeScore(winner) {
        const val1 = document.querySelector("#ply1-val");
        const val2 = document.querySelector("#ply2-val");

        if (winner.sign == "X") val1.textContent = winner.score;
        else val2.textContent = winner.score;
    }

    function alertScore(text) {
        const div = document.createElement("div");
        const btn = document.createElement("button");

        div.setAttribute("class", "alert")
        div.textContent = text;
        btn.textContent = "Ok"
        div.appendChild(btn);
        document.querySelector(".game").appendChild(div)
        
        btn.addEventListener("click", () => div.remove())

    }

    functionalizeItemDivs()

    return { placeImage, resetBoardDisp, changeTurn, changeScore, alertScore }
})()

const Player = function(name, sign) {
    let score = 0;

    return { name, sign, score }
}

const gameFlow = (function() {
    let turn;
    let nextTurn;

    function createPlayers(name1, name2) {
        // This is temporary until frontend is designed
        ply1 = Player(name1 ? name1 : "Cross", "X")
        ply2 = Player(name2 ? name2 : "Circle", "O")
        turn = ply1;
        dispControler.changeTurn(turn.sign)
        nextTurn = ply2;
        console.log(ply1.name, ply2.name)
    }
    
    function placeItem(x, y) {
        if (gameBoard.addToBoard(x, y, turn.sign)) {
            dispControler.placeImage(x, y, turn.sign)
            if (gameBoard.checkWinner()) {
                prepareBoard = function() {
                    
                }
                if (gameBoard.checkWinner() === turn.sign) {
                    ++turn.score
                    dispControler.changeScore(turn)
                    dispControler.alertScore(`${turn.name} won, congrats!`)
                } else dispControler.alertScore("Its a Tie!")
                gameBoard.resetBoard()
                dispControler.resetBoardDisp()
                turn = nextTurn;
                nextTurn = nextTurn == ply2 ? ply1 : ply2;    
            }
            else {
                if (turn == ply1) turn = ply2
                else turn = ply1
            }
            dispControler.changeTurn(turn.sign)
        }
    }

    return { placeItem, createPlayers }
})()


