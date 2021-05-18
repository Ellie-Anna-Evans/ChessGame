var board = new Board;

var boardVis = document.getElementById("Board").children;

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
    var i;
    for(i = 0; i < boardVis.length; i++){
        var boardSpace = boardVis[i];
        boardSpace.removeEventListener("click", clickHandler);
    }

    var piece = board.board[row][column].piece;
    var movement = piece.movement;
    //Need to make sure to check if the space to move to is out of bounds
     
    for(i = 0; i < movement.length; i++){

        if( ((movement[i][0] + row) >= 0) && ((movement[i][0] + row) < 8) && ((movement[i][1] + column) >= 0) && ((movement[i][1] + column) < 8) ){
            if(piece.mvtype === "single"){
                //Need to add conditionals for if there is a friendly piece in the spot.
                
                //Also need a conditional for pawns, to account for a few special rules
                //like jumping 2 spaces on the first move, or that different colored pawns
                //can only move in one direction, which is not currently accounted for. 
                var mvspace = 8 * (row + movement[i][0]) + column + movement[i][1]; //This makes it easier to change if i got it wrong
                boardVis[mvspace].addEventListener("click", secondClick);
                boardVis[mvspace].classList.add("moving");
            }
            //This is not working correctly currently.
            if(piece.mvtype === "continuous"){
                var j;
                for(j = 0; j < 8; j++){
                    if( ((row + (movement[i][0] * j)) < 0) || ((row + (movement[i][0] * j)) > 8) || ((column + (movement[i][1] * j)) < 0) || ((column + (movement[i][1] * j)) > 8) ){
                        break; // Break out of loop if out of bounds
                    }
                    else{
                        //if not out of bounds, add in the space highlight and event listener
                        var mvspace = 8 * (row + (movement[i][0] * j)) + column + (movement[i][1] * j); //This makes it easier to change if i got it wrong
                        boardVis[mvspace].addEventListener("click", secondClick);
                        boardVis[mvspace].classList.add("moving");
                        if(board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))].piece != "none"){ //If there is a piece in this space, it is takeable and still needs a space highlight, but that does end the loop.
                            break;
                        }
                    }
                }
            }
        }

    }
}

function secondClick(){
    //This needs to call appropriate move or take function, and then reset the click listeners to whichever side is making a move next.
}

function movePiece(row1, column1, row2, column2, type){
    //Will move piece based on piece type and parameters. Might have this function add the listeners 
    //back in for what spots the piece can move to.
}

function takePiece(row1, column1, row2, column2, type){
    //Will remove a piece and replace with piece that took it, and update eventual board that will have game information
}

board.setupBoard();
boardListeners();