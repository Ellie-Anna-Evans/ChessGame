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
    var row = space.classList.item(0);
    var column = space.classList.item(1);
    var i;
    for(i = 0; i < boardVis.length; i++){
        var boardSpace = boardVis[i];
        boardSpace.removeEventListener("click", clickHandler);
    }

    var movement = board[row][column - 64].getPiece().getMovement();
    //Need to make sure to check if the space to move to is out of bounds
    for(i = 0; i < movement.length; i++){
        
    }
    
}

function secondClick(){

}

function movePiece(row1, column1, row2, column2, type){
    //Will move piece based on piece type and parameters. Might have this function add the listeners 
    //back in for what spots the piece can move to.
}


board.setupBoard();
boardListeners();