# chessgame
chess game for OSU projects class

In order to install, install into directory where the webpage can be accessed. In the case of the OSU servers, this is public_html. Make sure to assign permissions, as sometimes I have run into problems moving the files around cause them to lose permissions. Run a chmod:

chmod -R 755 chessgame

To fix this if there are issue with loading the webpage.


Once hosted somewhere, you can navigate to the webpage and play the game in its entirety. 

If you are having a lot of trouble setting up the webpage, you can navigate to my OSU webspace to see the project. Link:

http://web.engr.oregonstate.edu/~evansdr/chessgame/public/

The webpage starts it on the white player's turn. 
To use the game, simply start by clicking the piece you wish to move and the game will highlight where the piece can move to. Then, you can either click the space the piece is on to choose a different piece to move, or you can click a space the piece can move to, to move it there. The game will not let you click outside of specific spaces so as to take some unneeded choice from the user. The game then functions like any other chess game for the most part. Turns swap after each move, pieces move based on the rules of chess, you can perform pawn promotions and castling, the game will inform you if you are in check, and once the king is taken, the game ends. 