var board = new Board;
board.setupBoard();

var boardVis = document.getElementsByClassName("Board").children;

function boardListeners(){
    var i;
    for(i = 0; i < boardVis.length; i++){
       var boardSpace = boardVis[i];
       boardSpace.addEventListener("click", clickHandler);
    }
}

function clickHandler(){
    //Need to figure out how to handle this so it intercepts the second click properly.
    //Perhaps remove all listeners and then send it to movePiece to handle specific piece movement
    var i;
    for(i = 0; i < boardVis.length; i++){
        var boardSpace = boardVis[i];
        boardSpace.removeEventListener("click", clickHandler);
    }

    //Need to make sure to check if its out of bounds

    
}

function secondClick(){

}

function movePiece(row1, column1, row2, column2, type){
    //Will move piece based on piece type and parameters. Might have this function add the listeners 
    //back in for what spots the piece can move to.
}
