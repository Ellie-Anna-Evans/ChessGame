var board = new Board;

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
    
    if(piece === "none"){ //Make sure to ignore clicks on spaces that are empty.
        return;
    }
    
    movingpiece = piece; //realized i need this to track the piece thats moving in the second click function
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
                    if(piece.type === "pawn"){
                        if(piece.color === "white" && row != 6) {break;}
                        else if(piece.color === "black" && row != 1) {break;}
                    }

           
                }
            }
            if(piece.mvtype === "continuous"){
                var j;
                for(j = 0; j < 8; j++){
                    var chkspace =board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))]; //Again, makes it easier to fix logic errors.
                    var mvspace = 8 * (row + (movement[i][0] * j)) + column + (movement[i][1] * j); //This makes it easier to change if i got it wrong
                    if( ((row + (movement[i][0] * j)) >= 0) || ((row + (movement[i][0] * j)) < 8) || ((column + (movement[i][1] * j)) >= 0) || ((column + (movement[i][1] * j)) < 8) ){
                        break; // Break out of loop if out of bounds
                    }
                    else{
                        if(chkspace.piece.color != piece.color){ //Checks if this would target a friendly piece
                        //if not out of bounds, add in the space highlight and event listener
                            boardVis[mvspace].addEventListener("click", secondClick);
                            boardVis[mvspace].classList.add("moving");
                            if(chkspace.piece != "none"){ //If there is a piece in this space, it is takeable and still needs a space highlight, but that does end the loop.
                                    break;
                            }
                        }
                        else if(piece.type === "rook" && chkspace.piece.type === "king"){
                            boardVis[mvspace].addEventListener("click", secondClick);
                            boardVis[mvspace].classList.add("moving");
                            break;
                        }
                    }
                }
            }
        }
    }
}

function secondClick(event){
    //This needs to call appropriate move or take function, and then reset the click listeners to whichever side is making a move next.
    var space = event.target;
    var row = String(space.classList.item(0)).charCodeAt(0) - 65;
    var column = Number(space.classList.item(1)) - 1;

    //Remove all second click listeners and moving visual class
    var i;
    for(i = 0; i < boardVis.length; i++){
        boardVis[i].removeEventListener("click", secondClick);
        boardVis[i].classList.remove("moving");
    }

    


    for(i = 0; i < boardVis.length; i++){
        boardVis[i].addEventListener("click", clickHandler);
    }
}

function movePiece(row1, column1, row2, column2, type){
    //Will move piece based on piece type and parameters. Might have this function add the listeners 
    //back in for what spots the piece can move to.
}

function takePiece(row1, column1, row2, column2, type){
    //Will remove a piece and replace with piece that took it, and update eventual board that will have game information
}

function resetBoard(){
    var i;
    for(i = 0; i < boardVis.length; i++){
        boardVis[i].classList.remove("moving");
        boardVis[i].removeEventListener("click", clickHandler);
        boardVis[i].removeEventListener("click", secondClick);
    }

    board = new Board;
    board.setupBoard();
    boardListeners();
}

board.setupBoard();
boardListeners();