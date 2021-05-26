//Each piece needs needs an identifier, due to the type fuzziness
//in javascript, they need a movement pair array to tell the movement function 
//where to check for valid moves, some need a pair for taking another piece
//(pawn). Still deciding if they need any functions aside from get functions
//

class Piece{
    type;
    color;
    movement;
    mvtype;
    constructor(type, color, movement, mvtype){
        this.type = type;
        this.color = color
        this.movement = movement;
        this.mvtype = mvtype;
    }
    
    get type(){
        return this.type;
    }

    get movement(){
        return this.movement;
    }

    get mvtype(){
        return this.mvtype;
    }
}

class Pawn extends Piece{
    constructor(color){
            if(color === "white"){
                super("Pawn", color, [[-1,0], [-2,0]], "single");
            }
            else{
                super("Pawn", color, [[1,0], [2,0]], "single");
            }
    }
}

class Rook extends Piece{
    constructor(color){
        super("Rook", color, [[0,1], [1,0], [0,-1], [-1,0]], "continuous");
    }
}

class Knight extends Piece{
    constructor(color){
        super("Knight", color, [[2,1], [2,-1], [1,2], [1,-2], [-2,1], [-2,-1], [-1,2], [-1,-2]], "single");
    }
}

class Bishop extends Piece{
    constructor(color){
        super("Bishop", color, [[1,1], [-1,1], [-1,-1], [1,-1]], "continuous");
    }
}

class Queen extends Piece{
    constructor(color){
        super("Queen", color, [[0,1], [1,0], [0,-1], [-1,0], [1,1], [-1,1], [-1,-1], [1,-1]], "continuous");
    }
}

class King extends Piece{
    constructor(color){
        super("King", color, [[0,1], [1,0], [0,-1], [-1,0], [1,1], [-1,1], [-1,-1], [1,-1]], "single");
    }
}