const gameDiv = document.getElementById('game');
const mineDisplay = document.getElementById('mineDisplay');

var gridSquares = [[]];

var numMines = 40;
var gameWidth = 16;
var gameHeight = 16;
var squareSize = 20;
var squareBorderValue = 0.25;
var numSizeValue = 0.7;

var gameStart = false;

var numMarkedMines = 0;

function initGrid(rows, columns) {
    numMarkedMines = 0;
    updateMineDisplay();
    gameStart = false;
    gameDiv.innerHTML = '';
    gameDiv.style.width = squareSize * columns + "px";
    gridSquares = [];
    for(let i = 0; i < rows; i++) {
        gridSquares[i] = [];
        for(let j = 0; j < columns; j++) {
            let nextSquare = document.createElement('div');
            nextSquare.classList = 'grid-square covered';
            nextSquare.style = `width: ${squareSize}px; height: ${squareSize}px; border-width: ${squareSize * squareBorderValue}px; font-size: ${squareSize*numSizeValue}px;`;

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
                    showSecrets();
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
                    numMarkedMines--;
                }
                else {
                    nextSquare.classList.add('marked');
                    numMarkedMines++;
                }
                updateMineDisplay();
            }

            gameDiv.appendChild(nextSquare);
            gridSquares[i][j] = nextSquare;
        }
    }
}

function initMines(numMines, excludeX, excludeY) {
    console.log('Creating mines... Exclude(' + excludeX + ", " + excludeY + ")");

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
                    if(excludeX + i == row && excludeY + j == column) {
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

    gridSquares[row][column].style.borderWidth = squareBorderValue/2 * squareSize + 'px';

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

                gridSquares[row + i][column + j].style.borderWidth = squareBorderValue/2 * squareSize + 'px';
            }
        }
    }
}

function showSecrets() {
    for(let row = 0; row < gridSquares.length; row++) {
        for(let column = 0; column < gridSquares[row].length; column++) {
            if(gridSquares[row][column].classList.contains('covered')) {
                cascadeUnblock(row, column);
            }
        }
    }
}

function updateMineDisplay() {
    mineDisplay.innerText = numMines - numMarkedMines;
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

function getUrlVar(varName) {
    var searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(varName);
}

function updateVariablesWithParams() {
    gameWidth = parseInt(getUrlVar("gamewidth")) ? parseInt(getUrlVar("gamewidth")) : gameWidth;
    gameHeight = parseInt(getUrlVar("gameheight")) ? parseInt(getUrlVar("gameheight")) : gameHeight;
    numMines = parseInt(getUrlVar("nummines")) ? parseInt(getUrlVar("nummines")) : numMines;
}

function init() {
    updateVariablesWithParams();
    initGrid(gameHeight, gameWidth);
}

init();