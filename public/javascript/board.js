class Space{
    constructor(piece, row, column){
        this.piece = piece;
        this.row = row;
        this.column = column;
    }

    get piece(){
        return this.piece;
    }

    get location(){
        return (this.row, this.column);
    }
}

class Board{
    constructor(){
        this.board = [];
    }

    //can't think of an eleagant solution to setting up the board
    //will probably just be hackish for now and just declare all the unique spaces,
    //and loop through the non-unique ones.
    setupBoard(){

        this.board.push();
        
        var i;
        for(i = 0; i < 8; i++){
            
        }
    }

}


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
    
}

function secondClick(){

}

function movePiece(row1, column1, row2, column2, type){
    //Will move piece based on piece type and parameters. Might have this function add the listeners 
    //back in for what spots the piece can move to.
}

function makeEmpty(row, column){
    //This function is for when a piece is taken and removed from the board
}