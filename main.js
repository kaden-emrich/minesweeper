const gameDiv = document.getElementById('game');

var gridSquares = [[]];

function initGrid(rows, columns) {
    gridSquares = [];
    for(let i = 0; i < rows; i++) {
        gridSquares[i] = [];
        for(let j = 0; j < columns; j++) {
            let nextSquare = document.createElement('div');
            nextSquare.classList = ['grid-square'];
            nextSquare.style = `width: ${100 / columns}%; height: ${100 / rows}%;`;
            nextSquare.onclick = () => {
                nextSquare.classList.add('open');
            }

            //nextSquare.innerText = Math.floor(Math.random() * 8); // for debugging

            gameDiv.appendChild(nextSquare);
            gridSquares[i][j] = nextSquare;
        }
    }
}

initGrid(10, 10);