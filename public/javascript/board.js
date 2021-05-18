class Space{
    piece;
    row;
    column;
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

    setPiece(piece){
        this.piece = piece;
    }
}

class Board{
    board;
    constructor(){
        this.board = [];
    }

    //can't think of an eleagant solution to setting up the board
    //will probably just be hackish for now and just declare all the unique spaces,
    //and loop through the non-unique ones.
    setupBoard(){
        this.board.push([], [], [], [], [], [], [], []);
        
        this.board[0].push(new Space(new Rook("black"), 'A', 1), new Space(new Knight("black"), 'A', 2), new Space(new Bishop("black"), 'A', 3), new Space(new Queen("black"), 'A', 4), new Space(new King("black"), 'A', 5), new Space(new Bishop("black"), 'A', 6), new Space(new Knight("black"), 'A', 7), new Space(new Rook("black"), 'A', 8));

        var i;
        for(i = 0; i < 8; i++){
            this.board[1].push(new Space(new Pawn("black"), 'B', i+1));
        }

        for(i = 1; i <= 8; i++){
            this.board[2].push(new Space("none", 'C', i+1));
        }

        for(i = 1; i <= 8; i++){
            this.board[3].push(new Space("none", 'D', i+1));
        }

        for(i = 1; i <= 8; i++){
            this.board[4].push(new Space("none", 'E', i+1));
        }

        for(i = 1; i <= 8; i++){
            this.board[5].push(new Space("none", 'F', i+1));
        }

        for(i = 1; i <= 8; i++){
            this.board[6].push(new Space(new Pawn("white"), 'G', i+1));
        }

        this.board[7].push(new Space(new Rook("white"), 'H', 1), new Space(new Knight("white"), 'H', 2), new Space(new Bishop("white"), 'H', 3), new Space(new Queen("white"), 'H', 4), new Space(new King("white"), 'H', 5), new Space(new Bishop("white"), 'H', 6), new Space(new Knight("white"), 'H', 7), new Space(new Rook("white"), 'H', 8));
    }

    get board(){
        return this.board;
    }

    getSpace(row, column){
        return this.board[row][column];
    }

    makeEmpty(row, column){
        this.board[row][column].setPiece("none");
    }

    changePiece(row, column, piece){
        this.board[row][column].setPiece(piece);
    }

}