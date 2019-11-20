const Game = require('./Classes/Game.js');

var gameChannels = [];
var games = [];

createGame(1, 1);
addPlayer(1, 2);
startGame(1);
checkNumber(1, 1, 1);
checkNumber(1, 1, 2);

function gameExists(channelID){
    if(gameChannels.includes(channelID)){
        return gameChannels.indexOf(channelID);
    }
    else{
        return -1;
    }
}

function createGame(channelID, userID){
    gameId = gameExists(channelID);
    if(gameId != -1){
        console.log("Game Exists");
        console.log(gameId);
    }
    else{
        myGame = new Game(channelID, userID);
        gameChannels.push(channelID);
        games.push(myGame);
    }
}

function addPlayer(channelID, userId){
    gameId = gameExists(channelID);
    game = games[gameId];
    game.addPlayer(userId);
}

function startGame(channelID){
    gameId = gameExists(channelID);
    game = games[gameId];
    cards = game.startGame();   
    players = game.getPlayers();
    level = game.getLevel();

    cardCount = 0;

    for (var i = 0; i < players.length; i++) {
        playerID = players[i];
        cardMessage = "";

        for(var j = 0; j < level; j++){
            cardMessage += cards[cardCount] + ", ";
            cardCount++;
        }

        /*bot.sendMessage({
            to: playerID,
            message: cardMessage
        });*/
        console.log(playerID + " - " + cardMessage);
    }
}

function checkNumber(channelID, userId, number){
    gameId = gameExists(channelID);
    game = games[gameId];
    var response = game.checkNumber(number, userId);

    if(response['over'] == 1){
        /*bot.sendMessage({
            to: channelID,
            message: "Congratulations ! You have played the last card. The level is over ! Start again to go to the next level."
        });*/
        console.log("Congratulations ! You have played the last card. The level is over ! Start again to go to the next level.");
    }
    else if(response['over'] == 2){
        /*bot.sendMessage({
            to: channelID,
            message: "Whomp whomp. " + number + " is the highest card. This level is over. Start again to go to the next level."
        });*/
        console.log("Whomp whomp. " + number + " is the highest card. This level is over. Start again to go to the next level.");
    }
    else if(response['over'] == 3){
        /*bot.sendMessage({
            to: channelID,
            message: "Whomp whomp. " + number + " is the highest card. This level is over. Start again to go to the next level."
        });*/
        console.log("Whomp whomp. " + number + " is the new highest card. Who's next ?");
    }   
    else{
        /*bot.sendMessage({
            to: channelID,
            message: "Congratulations ! " + number + " was the next card. Who's next ?"
        });*/
        console.log("Congratulations ! " + number + " was the next card. Who's next ?" + response['over']);
    }
}