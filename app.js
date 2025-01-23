const boardSize = 8;
let board = [];
let currentPlayer = null; // Definido pelo sorteio
let selectedPiece = null;

// Função para criar o tabuleiro
function createBoard() {
    const boardContainer = document.querySelector('.board');
    boardContainer.innerHTML = ''; // Limpa o conteúdo existente
    board = [];

    for (let row = 0; row < boardSize; row++) {
        const rowArray = [];
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if ((row + col) % 2 === 0) {
                cell.classList.add('yellow'); // Amarelo para as casas claras
            } else {
                cell.classList.add('blue'); // Azul para as casas escuras
            }

            if (row < 3 && (row + col) % 2 !== 0) {
                const piece = createPiece('white');
                cell.appendChild(piece);
                rowArray.push('white');
            } else if (row > 4 && (row + col) % 2 !== 0) {
                const piece = createPiece('black');
                cell.appendChild(piece);
                rowArray.push('black');
            } else {
                rowArray.push(null);
            }

            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardContainer.appendChild(cell);
        }
        board.push(rowArray);
    }
}

// Função para criar a peça
function createPiece(color) {
    const piece = document.createElement('div');
    piece.classList.add('piece', color === 'white' ? 'white-piece' : 'black-piece');
    return piece;
}

// Função para lidar com o evento de click na célula
function handleCellClick(event) {
    const cell = event.target.closest('.cell');
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (selectedPiece) {
        // Tentativa de mover a peça
        if (isValidMove(selectedPiece.pieceColor, selectedPiece.row, selectedPiece.col, row, col)) {
            movePiece(selectedPiece.piece, selectedPiece.row, selectedPiece.col, row, col);
            capturePiece(selectedPiece.pieceColor, selectedPiece.row, selectedPiece.col, row, col);
            promoteToQueen(selectedPiece.pieceColor, row, selectedPiece.piece); // Verifica promoção
            switchPlayer();
        } else {
            alert("Movimento inválido!");
        }
        selectedPiece = null; // Limpa a peça selecionada após o movimento
    } else {
        // Seleciona uma peça
        if (cell.firstChild && cell.firstChild.classList.contains(`${currentPlayer}-piece`)) {
            selectedPiece = {
                piece: cell.firstChild,
                pieceColor: currentPlayer,
                row,
                col
            };
            cell.classList.add('selected'); // Marca a célula selecionada
        }
    }
}

// Função para verificar se o movimento é válido
function isValidMove(pieceColor, startRow, startCol, endRow, endCol) {
    if (board[endRow][endCol] !== null) return false; // A célula de destino deve estar vazia

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    // Verifica se o movimento é diagonal
    if (Math.abs(rowDiff) !== Math.abs(colDiff)) {
        return false;
    }

    // Valida movimentos para peões
    if (pieceColor === 'white') {
        if (rowDiff < 0) return false; // Peão branco não pode voltar
    } else {
        if (rowDiff > 0) return false; // Peão preto não pode voltar
    }

    return true; // Movimento válido para dama
}

// Função para mover a peça
function movePiece(piece, startRow, startCol, endRow, endCol) {
    const startCell = document.querySelector(`[data-row="${startRow}"][data-col="${startCol}"]`);
    const endCell = document.querySelector(`[data-row="${endRow}"][data-col="${endCol}"]`);

    startCell.innerHTML = ''; // Limpa a célula de origem
    endCell.appendChild(piece); // Move a peça para a célula de destino
    board[startRow][startCol] = null; // Atualiza o tabuleiro
    board[endRow][endCol] = currentPlayer; // Atualiza o tabuleiro
}

// Função para capturar a peça adversária
function capturePiece(pieceColor, startRow, startCol, endRow, endCol) {
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    // Verifica se a captura é válida
    if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
        const middleRow = startRow + (rowDiff > 0 ? 1 : -1);
        const middleCol = startCol + (colDiff > 0 ? 1 : -1);
        const middleCell = board[middleRow][middleCol];

        // Permite captura se houver uma peça adversária no caminho
        if (middleCell && middleCell !== pieceColor) {
            // Remove a peça capturada
            board[middleRow][middleCol] = null; // Remove a peça capturada do tabuleiro
            const capturedPiece = document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`).firstChild;
            document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`).innerHTML = ''; // Limpa a célula
            alert(`${pieceColor === 'white' ? 'Peça branca' : 'Peça preta'} capturada!`);
        }
    }
}

// Função para promover a peça a dama
function promoteToQueen(pieceColor, row, piece) {
    if ((pieceColor === 'black' && row === 0) || (pieceColor === 'white' && row === 7)) {
        piece.classList.add('queen'); // Adiciona a classe de dama
        piece.innerHTML = '♛'; // Adiciona um símbolo de dama
        piece.classList.remove('piece'); // Remove a classe de peça normal
        alert(`${pieceColor === 'white' ? 'Peça branca' : 'Peça preta'} se tornou uma dama!`);
    }
}

// Função para alternar o jogador
function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    document.getElementById('game-status').textContent = `É a vez do jogador ${currentPlayer === 'white' ? 'Branco' : 'Preto'}.`;
}

// Função para iniciar o jogo
function startGame() {
    createBoard();
    currentPlayer = Math.random() < 0.5 ? 'white' : 'black'; // Sorteio para o jogador que começa
    document.getElementById('game-status').textContent = `Sorteio: Jogador ${currentPlayer === 'white' ? 'Branco' : 'Preto'} começa!`;
}

// Inicia o jogo
startGame();
