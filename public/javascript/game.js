//Next task is to implement check/mate including all visuals for that. 
//Thinking about utilizing alerts to let the player know they are in check
 
var board = new Board;

var baseBoard = document.getElementById("Board").cloneNode(true);

var boardVis = document.getElementById("Board").children;
var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", resetBoard);

var movingpiece;

var possibleMoves; //Going to be used for tracking every possible move to check against for check/mate

var playerTurn = 0; //0 for white, 1 for black

var waitForPromote = 0;
var promoteRC;

//Track the kings publicly to make using them in checking for check/mate easier later
var blackking;
var whiteking;

//Track the pieces that target the king for use in check/mate checking
var blackCheck = [];
var whiteCheck = [];

var blacktaken = []; //Holds pieces taken by black player
var whitetaken = []; //Holds pieces taken by white player   

function boardListeners(){
    var i;
    for(i = 0; i < boardVis.length; i++){
        var boardSpace = boardVis[i];
        if(!(boardSpace.hasChildNodes())){ //If the space is empty ignore it, saves trouble later.
            continue;
        }
        else if(playerTurn == 0 && boardSpace.children[0].classList.contains("white")){ //If it is the white player's turn and the space has a white piece, add listener
            boardSpace.addEventListener("click", clickHandler, true);
        }
        else if(playerTurn == 1 && boardSpace.children[0].classList.contains("black")){ //If it is the black player's turn and the space has a black piece, add listener
            boardSpace.addEventListener("click", clickHandler, true);
        }
    }
}

//Since I already have a method to check for movement on all piece types, I should just be able to 
//reuse that method and just check for every piece every turn, and then just look up the potential movement
//in the resulting arrays. It will result in a 5D array, but the structure is pretty straight forward.
//It goes rows->columns-> (for some reason I ended up with an extra mediating layer here) -> movement x -> movement y
//The array must include a data structure similar to the board so as to be able to look up the piece by board space
function allMoves(){

    blackCheck = [];
    whiteCheck = [];

    possibleMoves = [];

    var row, column, i;
    for(row = 0; row < 8; row++){
        possibleMoves.push([]);
        for(column = 0; column < 8; column++){
            possibleMoves[row].push([]);
            if(board.board[row][column].piece === "none"){
                continue;
            }
            else{
                var piece = board.board[row][column].piece;

                //Track the kings for later use in check/mate
                if(piece.type === "King"){
                    if(piece.color === "black"){ blackking = [piece, row, column];}
                    else{ whiteking = [piece, row, column];}
                }

                var movement = piece.movement;
                //This is basically the same logic as the original click handler, but utilizes a nested loop to 
                //perform the check for every piece on the board.
                for(i = 0; i < movement.length; i++){
                    if( ((movement[i][0] + row) >= 0) && ((movement[i][0] + row) < 8) && ((movement[i][1] + column) >= 0) && ((movement[i][1] + column) < 8) ){
                        if(piece.mvtype === "single"){
                            if(board.board[row+movement[i][0]][column+movement[i][1]].piece.color != piece.color){
                                //Since pawns have the most irregular rules, we need to handle them specially
                                possibleMoves[row][column].push([]);
                                if(piece.type === "Pawn"){
                                    //New line for each condition for readability
                                    if(i != 1 && 
                                        column+movement[0][1] + 1 >= 0 && 
                                        column+movement[0][1] + 1 < 8 && 
                                        board.board[row+movement[0][0]][column+movement[0][1] + 1].piece != "none" && 
                                        board.board[row+movement[0][0]][column+movement[0][1] + 1].piece.color != piece.color)
                                        {
                                        //If pawn, check diagonals for opponent pieces to take.
                                        //If this targets the king, log it for later use in checking for check/mate
                                        if(board.board[row+movement[0][0]][column+movement[0][1] + 1].piece.type === "King"){
                                            if(board.board[row+movement[0][0]][column+movement[0][1] + 1].piece.color === "white"){
                                                whiteCheck.push([piece, row+movement[0][0], column+movement[0][1] + 1]);
                                            }
                                            else{
                                                blackCheck.push([piece, row+movement[0][0], column+movement[0][1] + 1]);
                                            }
                                        }
                                        possibleMoves[row][column][possibleMoves[row][column].length-1].push([row+movement[i][0], column+movement[i][1] + 1]);
                                    }
                                    if(i != 1 && 
                                        column+movement[0][1] - 1 >= 0 && 
                                        column+movement[0][1] - 1 < 8 && 
                                        board.board[row+movement[0][0]][column+movement[0][1] - 1].piece != "none" && 
                                        board.board[row+movement[0][0]][column+movement[0][1] - 1].piece.color != piece.color)
                                        {
                                        //If pawn, check diagonals for opponent pieces to take.
                                        //If this targets the king, log it for later use in checking for check/mate
                                        if(board.board[row+movement[0][0]][column+movement[0][1] - 1].piece.type === "King"){
                                            if(board.board[row+movement[0][0]][column+movement[0][1] - 1].piece.color === "white"){
                                                whiteCheck.push([piece, row, column]);
                                            }
                                            else{
                                                blackCheck.push([piece, row, column]);
                                            }
                                        }
                                        possibleMoves[row][column][possibleMoves[row][column].length-1].push([row+movement[i][0], column+movement[i][1] - 1]);
                                    }
                                    if(board.board[row+movement[i][0]][column+movement[i][1]].piece != "none"){ //If there is an opposing piece in front of the pawn, it cannot move forward.
                                        if(i == 1){possibleMoves[row][column].pop(); }//Pop the last movement array element in this scenario, as it causes a problem later because it adds a phantom array element (since in this if statement, we have decided there is a piece in a spot where the pawn would've normally been able to move).
                                        break;
                                    }
                                    else{
                                        if(board.board[row+movement[0][0]][column+movement[0][1]].piece.type === "King"){
                                            if(board.board[row+movement[0][0]][column+movement[0][1]].piece.color === "white"){
                                                whiteCheck.push([piece, row, column]);
                                            }
                                            else{
                                                blackCheck.push([piece, row, column]);
                                            }
                                        }
                                        possibleMoves[row][column][possibleMoves[row][column].length-1].push([row+movement[i][0], column+movement[i][1]]);
                                    }
            
                                    //If not first move, do not add in second space to move.
                                    if(piece.color === "white" && row != 6) {break;}
                                    else if(piece.color === "black" && row != 1) {break;}
                                }
                                else{//For everything else
                                    possibleMoves[row][column][possibleMoves[row][column].length-1].push([row+movement[i][0], column+movement[i][1]]);
                                }
                            }
                        }
                        if(piece.mvtype === "continuous"){
                            var j;
                            for(j = 1; j < 8; j++){
                                if( ((row + (movement[i][0] * j)) >= 0) && 
                                    ((row + (movement[i][0] * j)) < 8) && 
                                    ((column + (movement[i][1] * j)) >= 0) && 
                                    ((column + (movement[i][1] * j)) < 8) )
                                    {
                                    if(board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))].piece.color != piece.color){ //Checks if this would target a friendly piece
                                        //if not out of bounds, add in the space highlight and event listener
                                        if(board.board[row+(movement[i][0] * j)][column+(movement[i][1] * j)].piece.type === "King"){
                                            if(board.board[row+(movement[i][0] * j)][column+(movement[i][1] * j)].piece.color === "white"){
                                                whiteCheck.push([piece, row, column]);
                                            }
                                            else{
                                                blackCheck.push([piece, row, column]);
                                            }
                                        }
                                        possibleMoves[row][column].push([]);
                                        possibleMoves[row][column][possibleMoves[row][column].length-1].push([row+(movement[i][0] * j), column+(movement[i][1] * j)]);
                                        if(board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))].piece != "none"){ //If there is a piece in this space, it is takeable and still needs a space highlight, but that does end the loop.
                                                break;
                                        }
                                    }
                                    else if(piece.type === "Rook" && board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))].piece.type === "King"){
                                        possibleMoves[row][column].push([]);
                                        possibleMoves[row][column][possibleMoves[row][column].length-1].push([row+(movement[i][0] * j), column+(movement[i][1] * j)]);
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
            }
        }
    }

    return;
}

function clickHandler(event){
    event.stopPropagation();
    var space = event.target;
    var row = String(space.classList.item(0)).charCodeAt(0) - 65;
    var column = Number(space.classList.item(1)) - 1;

    var piece = board.board[row][column].piece;

    /*try{ 
        var piece = board.board[row][column].piece;
    }
    catch(e){
        return;
    }*/
    
    movingpiece = new Space(piece, row, column); //realized i need this to track the piece thats moving in the second click function

    var i, j;

    if(possibleMoves[row][column].length != 0){
        //This checks for if there is a piece, and the piece does have moves to display
        if(possibleMoves[row][column][0].length != 0){
            //Only need to remove the listeners if the piece clicked has valid moves
            for(i = 0; i < boardVis.length; i++){
                var boardSpace = boardVis[i];
                boardSpace.removeEventListener("click", clickHandler, true);
            }
            for(i = 0; i < possibleMoves[row][column].length; i++){
                for(j = 0; j < possibleMoves[row][column][i].length; j++){
                    var mvspace = 8 * possibleMoves[row][column][i][j][0] + possibleMoves[row][column][i][j][1]; //This makes it easier to change if i got it wrong
                    boardVis[mvspace].addEventListener("click", secondClick, true);
                    boardVis[mvspace].classList.add("moving");
                }
            }
            boardVis[8 * row + column].addEventListener("click", samePieceClick, true); //Added in so that the user can change their mind about what piece they want to move
        }
    }

    return;
}

function samePieceClick(){

    var i;
    for(i = 0; i < boardVis.length; i++){
        boardVis[i].removeEventListener("click", secondClick, true);
        boardVis[i].classList.remove("moving");
        boardVis[i].removeEventListener("click", samePieceClick, true);
    }

    boardListeners();
    allMoves();

}

function secondClick(event){
    //This needs to call appropriate move or take function, and then reset the click listeners to whichever side is making a move next.
    var space = event.target;
    var row = String(space.classList.item(0)).charCodeAt(0) - 65;
    var column = Number(space.classList.item(1)) - 1;

    var piece = board.board[row][column].piece;

    //Remove all second click listeners and moving visual class
    var i;
    for(i = 0; i < boardVis.length; i++){
        boardVis[i].removeEventListener("click", secondClick, true);
        boardVis[i].classList.remove("moving");
        boardVis[i].removeEventListener("click", samePieceClick, true);
    }

    if(piece === "none"){
        movePiece(movingpiece.row, movingpiece.column, row, column);
    }
    else if(piece.type === "King" && movingpiece.piece.type === "Rook" && piece.color === movingpiece.piece.color){
        castle(movingpiece.row, movingpiece.column, row, column);
    }
    else{
        //takePiece will return 1 if the king was taken, to signal the end of the game.
        if(takePiece(movingpiece.row, movingpiece.column, row, column)){
            return;
        }
    }

    if(movingpiece.piece.type === "Pawn" && (row == 0 || row == 7)){
        promote(row, column); //Send it the second pair since the piece has been moved
    }

    playerTurn = 1 - playerTurn; //Flips between 0 and 1 for player turn.
    if(playerTurn){
        document.getElementById("playerturn").textContent = "Black";
    }
    else{
        document.getElementById("playerturn").textContent = "White";
    }

    if(!waitForPromote){
        boardListeners();
        allMoves();
        if(playerTurn == 0 && whiteCheck.length){ alert("You are in check!");}
        else if(playerTurn == 1 && blackCheck.length){ alert("You are in check!");}
        //checkMate();
    }
    else{
        alert("Please select a piece to promote the pawn to.");
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

function promote(row, column){

    promoteRC = [row, column];

    waitForPromote = 1;

    var promotion = document.getElementById("promotion");

    promotion.classList.remove("hidden");

    promotion.addEventListener("change", promoteListen, true);

    return;

}

function promoteListen(){

    var piece = document.getElementById("promotion").value;
    console.log(piece);
    var row = promoteRC[0];
    var column = promoteRC[1];
    switch(piece){
        case "Rook":
            board.changePiece(row, column, new Rook(board.board[row][column].piece.color));
            boardVis[8 * row + column].children[0].textContent = "R";
            break;
        case "Queen":
            board.changePiece(row, column, new Queen(board.board[row][column].piece.color));
            boardVis[8 * row + column].children[0].textContent = "Q";
            break;
        case "Bishop":
            board.changePiece(row, column, new Bishop(board.board[row][column].piece.color));
            boardVis[8 * row + column].children[0].textContent = "B";
            break;
        case "Knight":
            board.changePiece(row, column, new Knight(board.board[row][column].piece.color));
            boardVis[8 * row + column].children[0].textContent = "Kn";
            break;
    }

    document.getElementById("promotion").removeEventListener("change", promoteListen, true);
    document.getElementById("promotion").classList.add("hidden");
    document.getElementById("promotion").selectedIndex = 0;

    waitForPromote = 0;

    boardListeners();
    allMoves();
    //If there are any elements in the check arrays, then the player is in check.
    if(playerTurn == 0 && whiteCheck.length){ alert("You are in check!");}
    else if(playerTurn == 1 && blackCheck.length){ alert("You are in check!");}
}

function castle(row1, column1, row2, column2){
    var piece1 = board.board[row1][column1].piece;
    var piece2 = board.board[row2][column2].piece;

    board.changePiece(row1, column1, piece2);

    board.changePiece(row2, column2, piece1);

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
    var piece2 = board.board[row2][column2].piece;

    board.changePiece(row2, column2, piece1);

    board.makeEmpty(row1, column1);

    //Add the taken piece's visual element to the respective taken box.
    var takenpieceVis = boardVis[8 * row2 + column2].removeChild(boardVis[8 * row2 + column2].children[0]);

    if(piece2.color === "black"){
        whitetaken.push(piece2);
        document.getElementById("whitetaken").appendChild(takenpieceVis);
    } 
    else if(piece2.color === "white"){
        blacktaken.push(piece2);
        document.getElementById("blacktaken").appendChild(takenpieceVis);
    } 

    boardVis[8 * row2 + column2].appendChild(boardVis[8 * row1 + column1].removeChild(boardVis[8 * row1 + column1].children[0]));

    if(piece2.type === "King"){
        if(playerTurn){ alert("Black Player Wins!");}
        else{ alert("White Player Wins!");}
        return 1;
    }
    return 0;
}

function resetBoard(){
    var i;
    for(i = 0; i < boardVis.length; i++){
        boardVis[i].classList.remove("moving");
        boardVis[i].removeEventListener("click", clickHandler, true);
        boardVis[i].removeEventListener("click", secondClick, true);
    }

    //Remove all child nodes of the board to have a fresh space to append clone of original board
    //Found this code as an example on a javascripy tutorial, it used several times in this function
    while(document.getElementById("Board").firstChild){
        document.getElementById("Board").removeChild(document.getElementById("Board").firstChild);
    }

    document.body.removeChild(document.getElementById("Board")); //Remove the board entirely to append the fresh board

    document.body.appendChild(baseBoard); //Append the fresh visuals
    baseBoard = document.getElementById("Board").cloneNode(true); //Reclone a fresh new visual board

    boardVis = document.getElementById("Board").children;

    while(document.getElementById("whitetaken").firstChild){
        document.getElementById("whitetaken").removeChild(document.getElementById("whitetaken").firstChild);
    }
    while(document.getElementById("blacktaken").firstChild){
        document.getElementById("blacktaken").removeChild(document.getElementById("blacktaken").firstChild);
    }

    playerTurn = 0;
    document.getElementById("playerturn").textContent = "White";
    document.getElementById("promotion").selectedIndex = 0;

    board = new Board;
    board.setupBoard();
    boardListeners();
    allMoves();

}

board.setupBoard();
boardListeners();
allMoves();


//Even though you need to just check kings moves for check/mate, the game does not
//need to check other pieces moves, as that is on the player to figure out
//what will save the king. Well, actually, specifically for check mate, more needs to calculated...
//For check mate, you need to check the moves of the other pieces still on the board for the player who's in check mate
//. If another piece can remove the immediate threat, then its not check mate, even if all the king's moves result in a death

//Could potentially track the number of pieces and the pieces that can target each king to potentially nullify needing to do this whole function, plus that would make 
//it easier to check for true checkmate, specifically in the scenario where another piece could remove the offending piece, even in the scenario where the king has no 
//moves to make that wouldn't take it out of check.


//Unfortunately due to time constraints, I am unable to finish a robust checkmate check system. As I am on the day the final pieces are due, and I have a midterm to take today as well, I will have to 
//forego it. Check is working however, so the player has at least some ability to work through the rest themselves. 


//Will return 1 or 0 depending on if in checkmate
/*function checkMate(){


}*/
    //Go through the whole array of possible moves, and check if the king is in a spot that an opponent piece can move and take.
    /*var row, column, move;
    for(row = 0; row < 8; row++){
        for(column = 0; column < 8; column++){
            if(possibleMoves[row][column].length != 0){
                for(move = 0; move < possibleMoves[row][column].length; move++){    
                    if(possibleMoves[row][column][0].length != 0){
                        if(playerTurn == 0){
                            try{ //Was getting some errors here, catching them for debugging
                                if(board.board[row][column].piece.color === "black"){
                                    if(possibleMoves[row][column][move][0][0] == whiteking[0] &&
                                    possibleMoves[row][column][move][0][1] == whiteking[1])
                                    {
                                    alert("You are in check");
                                    }
                                }
                                else{
                                    break;
                                }
                            }
                            catch(e){
                                console.log(board.board[row][column]);
                                console.log(possibleMoves[row][column].length, possibleMoves[row][column][move]);
                                console.log(e);
                                return;
                            }
                        }
                        else if(playerTurn == 1){
                            try{ //Was getting some errors here, catching them for debugging
                                if(board.board[row][column].piece.color === "white"){
                                    if(possibleMoves[row][column][move][0][0] == blackking[0] &&
                                    possibleMoves[row][column][move][0][1] == blackking[1])
                                    {
                                    alert("You are in check");
                                    }
                                }
                                else{
                                    break;
                                }
                            }
                            catch(e){
                                console.log(board.board[row][column]);
                                console.log(possibleMoves[row][column].length, possibleMoves[row][column][move]);
                                console.log(e);
                                return;
                            }
                        }
                    }
                }
            }
        }
    }*/

//Need to come up with a new way to store all possible movements for each player, it will make both movement and checking for
//checkmate much easier and nicer.


//Since I have already done all this logic to determine spaces a piece can move, no need to re-run this logic.     
//Saving this in case rollback is needed.
    /*for(i = 0; i < movement.length; i++){

        if( ((movement[i][0] + row) >= 0) && ((movement[i][0] + row) < 8) && ((movement[i][1] + column) >= 0) && ((movement[i][1] + column) < 8) ){
            if(piece.mvtype === "single"){
                if(board.board[row+movement[i][0]][column+movement[i][1]].piece.color != piece.color){
                    
                    //Since pawns have the most irregular rules, we need to handle them specially
                    if(piece.type === "Pawn"){
                        if(column+movement[0][1] + 1 >= 0 && column+movement[0][1] + 1 < 8 &&  board.board[row+movement[0][0]][column+movement[0][1] + 1].piece != "none" && i != 1){ //If pawn, check diagonals for opponent pieces to take.
                            var mvspace = 8 * (row + movement[i][0]) + column + movement[i][1] + 1; //This makes it easier to change if i got it wrong
                            boardVis[mvspace].addEventListener("click", secondClick);
                            boardVis[mvspace].classList.add("moving");
                        }
                        if(column+movement[0][1] - 1 >= 0 && column+movement[0][1] - 1 < 8 && board.board[row+movement[0][0]][column+movement[0][1] - 1].piece != "none" && i != 1){ //If pawn, check diagonals for opponent pieces to take.
                            var mvspace = 8 * (row + movement[i][0]) + column + movement[i][1] - 1; //This makes it easier to change if i got it wrong
                            boardVis[mvspace].addEventListener("click", secondClick);
                            boardVis[mvspace].classList.add("moving");
                        }
                        if(board.board[row+movement[i][0]][column+movement[i][1]].piece != "none"){ //If there is an opposing piece in front of the pawn, it cannot move forward.
                            break;
                        }
                        else{
                            var mvspace = 8 * (row + movement[i][0]) + column + movement[i][1]; //This makes it easier to change if i got it wrong
                            boardVis[mvspace].addEventListener("click", secondClick);
                            boardVis[mvspace].classList.add("moving");
                        }

                        //If not first move, do not add in second space to move.
                        if(piece.color === "white" && row != 6) {break;}
                        else if(piece.color === "black" && row != 1) {break;}
                    }
                    else{//For everything else
                        var mvspace = 8 * (row + movement[i][0]) + column + movement[i][1]; //This makes it easier to change if i got it wrong
                        boardVis[mvspace].addEventListener("click", secondClick);
                        boardVis[mvspace].classList.add("moving");
                    }
                }
            }
            if(piece.mvtype === "continuous"){
                var j;
                for(j = 1; j < 8; j++){
                    //var chkspace = board.board[(row + (movement[i][0] * j))][(column + (movement[i][1] * j))]; //Again, makes it easier to fix logic errors.
                    //console.log(column + (movement[i][1] * j));
                    if( ((row + (movement[i][0] * j)) >= 0) && ((row + (movement[i][0] * j)) < 8) && ((column + (movement[i][1] * j)) >= 0) && ((column + (movement[i][1] * j)) < 8) ){
                        //console.log((row + (movement[i][0] * j)), (column + (movement[i][1] * j)));
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

    //checks if any moves were shown as possible. If not, re-add board listeners
    for(i = 0; i < boardVis.length; i++){
        if(boardVis[i].classList.contains("moving")){
            break;
        }
    }
    if(i == boardVis.length){
        boardListeners();
    }*/