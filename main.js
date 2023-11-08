const gameDiv = document.getElementById('game');

var gridSquares = [[]];

var numMines = 10;

var gameStart = false;

function initGrid(rows, columns) {
    gameDiv.innerHTML = '';
    gridSquares = [];
    for(let i = 0; i < rows; i++) {
        gridSquares[i] = [];
        for(let j = 0; j < columns; j++) {
            let nextSquare = document.createElement('div');
            nextSquare.classList = 'grid-square covered';
            nextSquare.style = `width: ${100 / columns}%; height: ${100 / rows}%;`;

            nextSquare.onclick = () => {
                if(nextSquare.classList.contains('marked')) {
                    return;
                }

                if(!gameStart){
                    gameStart = true;
                    initMines(numMines, i, j);
                    initNumbers();
                }

                cascadeUnblock(i, j);

                if(nextSquare.classList.contains('mine')) {
                    setTimeout(() => {
                        alert('You lose!');
                        init();
                    }, 100);
                    return;
                }

                testWin();
            }
            
            nextSquare.oncontextmenu = (event) => {
                event.preventDefault();

                if(!gameStart) {
                    return;
                }

                if(nextSquare.classList.contains('covered') == false) {
                    nextSquare.classList.remove('marked');
                    return;
                }

                if(nextSquare.classList.contains('marked')) {
                    nextSquare.classList.remove('marked');
                }
                else {
                    nextSquare.classList.add('marked');
                }
            }

            gameDiv.appendChild(nextSquare);
            gridSquares[i][j] = nextSquare;
        }
    }
}

function initMines(numMines, excludeX, excludeY) {
    for(let i = 0; i < numMines; i++) {

        let row = Math.floor(Math.random() * gridSquares.length);
        let column = Math.floor(Math.random() * gridSquares[row].length);
        let excludeBlock = false;

        do {
            row = Math.floor(Math.random() * gridSquares.length);
            column = Math.floor(Math.random() * gridSquares[row].length);

            excludeBlock = false;
            for(let i = -2; i < 3; i++) {
                for(let j = -2; j < 3; j++) {
                    if(excludeY + i == row && excludeX + j == column) {
                        excludeBlock = true;
                    }
                }
            }
        } while(excludeBlock || gridSquares[row][column].classList.contains('mine'));

        gridSquares[row][column].classList.add('mine');

        //console.log(`Mine created at (${column}, ${row})`)
    }
} 

function squareHasMine(row, column) {
    if(row < 0 || row > gridSquares.length - 1 || column < 0 || column > gridSquares[0].length - 1) {
        return false;
    }

    if(gridSquares[row][column].classList.contains('mine')) {
        return true;
    }
    return false;
}

function getSquareValue(row, column) {
    if(
        row < 0 || row > gridSquares.length - 1 || column < 0 || column > gridSquares[0].length - 1 || 
        gridSquares[row][column].classList.contains('mine')
    ) {
        return -1;
    }

    let value = 0;

    for(let i = -1; i < 2; i++) { 
        for(let j = -1; j < 2; j++) { 
            if(squareHasMine(row + i, column + j)) { 
                value++;
            }
        }
    }

    //gridSquares[row][column].innerText = value;
    return value;
}

function initNumbers() {
    for(let i = 0; i < gridSquares.length; i++) {
        for(let j = 0; j < gridSquares[i].length; j++) {
            let value = getSquareValue(i, j);

            if(value != 0 && value != -1) {
                gridSquares[i][j].innerText = value;

                gridSquares[i][j].classList.add("num-" + value);
            }
        }
    }
}

function cascadeUnblock(row, column) {
    if(!gridSquares[row][column].classList.contains('covered')) {
        return;
    }
    
    gridSquares[row][column].classList.remove('covered');
    gridSquares[row][column].classList.remove('marked');
    gridSquares[row][column].classList.add('open');

    if(getSquareValue(row, column) != 0) {
        return;
    }

    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            if(getSquareValue(row + i, column + j) == 0) {
                cascadeUnblock(row + i, column + j);
            }
            else if(getSquareValue(row + i, column + j) != -1) { 
                gridSquares[row + i][column + j].classList.remove('covered');
                gridSquares[row + i][column + j].classList.remove('marked');
                gridSquares[row + i][column + j].classList.add('open');
            }
        }
    }
}

function testWin() {
    let numCovered = 0;

    for(let i = 0; i < gridSquares.length; i++) {
        for(let j = 0; j < gridSquares[i].length; j++) {
            if(gridSquares[i][j].classList.contains('covered')) {
                numCovered++;
            }
        }
    }

    if(numCovered <= numMines) {
        setTimeout(() => {
            alert('You win!');
            init();
        }, 100);
    }
}

function init() {
    gameStart = false;
    initGrid(10, 10);
}

init();