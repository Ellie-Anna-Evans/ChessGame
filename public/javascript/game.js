var board = new Board;

var baseBoard = document.getElementById("Board").cloneNode(true);

var boardVis = document.getElementById("Board").children;
var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", resetBoard);

var movingpiece;

function boardListeners(){
    var i;
    for(i = 0; i < boardVis.length; i++){
       var boardSpace = boardVis[i];
       boardSpace.addEventListener("click", clickHandler);
    }
}

function clickHandler(event){
    //Need to figure out how to handle this so it intercepts the second click properly.
    //Perhaps remove all listeners and then send it to movePiece to handle specific piece movement
    var space = event.target;
    var row = String(space.classList.item(0)).charCodeAt(0) - 65;
    var column = Number(space.classList.item(1)) - 1;
    //console.log(row, " ", column);

    var piece = board.board[row][column].piece;
    //console.log(piece);
    
    if(piece === "none"){ //Make sure to ignore clicks on spaces that are empty.
        return;
    }
    
    movingpiece = new Space(piece, row, column); //realized i need this to track the piece thats moving in the second click function
    var movement = piece.movement;

    var i;
    for(i = 0; i < boardVis.length; i++){
        var boardSpace = boardVis[i];
        boardSpace.removeEventListener("click", clickHandler);
    }

    
    //Need to make sure to check if the space to move to is out of bounds
     
    for(i = 0; i < movement.length; i++){

        if( ((movement[i][0] + row) >= 0) && ((movement[i][0] + row) < 8) && ((movement[i][1] + column) >= 0) && ((movement[i][1] + column) < 8) ){
            if(piece.mvtype === "single"){
                if(board.board[row+movement[i][0]][column+movement[i][1]].piece.color != piece.color){
                
                    var mvspace = 8 * (row + movement[i][0]) + column + movement[i][1]; //This makes it easier to change if i got it wrong
                    boardVis[mvspace].addEventListener("click", secondClick);
                    boardVis[mvspace].classList.add("moving");

                    //easier to just include all the possible moves for a pawn and break out of the movement array if its not the first move. 
                    if(piece.type === "Pawn"){
                        if(piece.color === "white" && row != 6) {break;}
                        else if(piece.color === "black" && row != 1) {break;}
                    }

           
                }
            }
            if(piece.mvtype === "continuous"){
                var j;
                for(j = 1; j < 8; j++){
                    //var chkspace = board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))]; //Again, makes it easier to fix logic errors.
                    
                    if( ((row + (movement[i][0] * j)) >= 0) || ((row + (movement[i][0] * j)) < 8) || ((column + (movement[i][1] * j)) >= 0) || ((column + (movement[i][1] * j)) < 8) ){
                        //console.log(board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))].piece.color);
                        if(board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))].piece.color != piece.color){ //Checks if this would target a friendly piece
                            //if not out of bounds, add in the space highlight and event listener
                            var mvspace = 8 * (row + (movement[i][0] * j)) + column + (movement[i][1] * j); //This makes it easier to change if i got it wrong
                            boardVis[mvspace].addEventListener("click", secondClick);
                            boardVis[mvspace].classList.add("moving");
                            if(board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))].piece != "none"){ //If there is a piece in this space, it is takeable and still needs a space highlight, but that does end the loop.
                                    break;
                            }
                        }
                        else if(piece.type === "Rook" && board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))].piece.type === "King"){
                            var mvspace = 8 * (row + (movement[i][0] * j)) + column + (movement[i][1] * j); //This makes it easier to change if i got it wrong
                            boardVis[mvspace].addEventListener("click", secondClick);
                            boardVis[mvspace].classList.add("moving");
                            break;
                        }
                        else{
                            break;
                        }
                    }
                    else{
                        break; // Break out of loop if out of bounds
                    }
                }
            }
        }
    }

    return;
}

function secondClick(event){
    //This needs to call appropriate move or take function, and then reset the click listeners to whichever side is making a move next.
    var space = event.target;
    var row = String(space.classList.item(0)).charCodeAt(0) - 65;
    var column = Number(space.classList.item(1)) - 1;

    //console.log(row, ", ", column);

    var piece = board.board[row][column].piece;

    //Remove all second click listeners and moving visual class
    var i;
    for(i = 0; i < boardVis.length; i++){
        boardVis[i].removeEventListener("click", secondClick);
        boardVis[i].classList.remove("moving");
    }

    if(piece === "none"){
        movePiece(movingpiece.row, movingpiece.column, row, column);
    }
    else if(piece.type === "King" && movingpiece.piece.type === "Rook" && piece.color === movingpiece.piece.color){
        castle(movingpiece.row, movingpiece.column, row, column);
    }
    else{
        takePiece(movingpiece.row, movingpiece.column, row, column);
    }

    for(i = 0; i < boardVis.length; i++){
        boardVis[i].addEventListener("click", clickHandler);
    }
}

//1st rc pair, piece to move. 2nd rc pair, space to move
function movePiece(row1, column1, row2, column2){
    var piece = board.board[row1][column1].piece;

    board.changePiece(row2, column2, piece);

    board.makeEmpty(row1, column1);

    boardVis[8 * row2 + column2].appendChild(boardVis[8 * row1 + column1].removeChild(boardVis[8 * row1 + column1].children[0]));

    return;
}

function castle(row1, column1, row2, column2){
    var piece1 = board.board[row1][column1].piece;
    var piece2 = board.board[row2][column2].piece;

    board.changePiece(row1, column1, piece2);
    //console.log(board.board[row1][column1]);
    board.changePiece(row2, column2, piece1);
    //console.log(board.board[row2][column2]);

    var pieceVis1 = boardVis[8 * row1 + column1].removeChild(boardVis[8 * row1 + column1].children[0]);
    var pieceVis2 = boardVis[8 * row2 + column2].removeChild(boardVis[8 * row2 + column2].children[0]);

    boardVis[8 * row1 + column1].appendChild(pieceVis2);
    boardVis[8 * row2 + column2].appendChild(pieceVis1);

    return;
}

//1st rc pair, piece to move. 2nd rc pair, space to move
function takePiece(row1, column1, row2, column2){
    //Will remove a piece and replace with piece that took it, and update eventual board that will have game information

    var piece1 = board.board[row1][column1].piece;
    //May use this for later functionality
    var piece2 = board.board[row2][column2].piece;

    board.changePiece(row2, column2, piece1);

    board.makeEmpty(row1, column1);

    //may use this, I dunno yet. 
    var takenpieceVis = boardVis[8 * row2 + column2].removeChild(boardVis[8 * row2 + column2].children[0]);

    boardVis[8 * row2 + column2].appendChild(boardVis[8 * row1 + column1].removeChild(boardVis[8 * row1 + column1].children[0]));
    
}

function resetBoard(){
    var i;
    for(i = 0; i < boardVis.length; i++){
        boardVis[i].classList.remove("moving");
        boardVis[i].removeEventListener("click", clickHandler);
        boardVis[i].removeEventListener("click", secondClick);
    }

    //Remove all child nodes of the board to have a fresh space to append clone of original board
    while(document.getElementById("Board").firstChild){
        document.getElementById("Board").removeChild(document.getElementById("Board").firstChild);
    }

    document.body.removeChild(document.getElementById("Board")); //Remove the board entirely to append the fresh board

    document.body.appendChild(baseBoard); //Append the fresh visuals
    baseBoard = document.getElementById("Board").cloneNode(true); //Reclone a fresh new visual board

    boardVis = document.getElementById("Board").children;

    board = new Board;
    board.setupBoard();
    boardListeners();
}

board.setupBoard();
boardListeners();


//Known bug: If no movement possible, unable to perform any other actions unless you reset