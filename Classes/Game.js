const Player = require('./Player.js');
const Card = require('./Card.js');

module.exports = class Game{
	constructor(channelId, userId, user){
		this.channelId = channelId;
		
		this.totalGamesComplete = 0;
		this.gameActive = 0;
		this.level = 0;
		this.cards = [];
		this.cardsSorted = [];
		this.maxLevel = 0;

		this.playerIds = [];
		this.playerIds.push(userId);

		this.players = [];
		var newPlayer = new Player(userId);
		this.players.push(newPlayer);

		this.playerNames = []
		this.playerNames.push(user);
	}

	playerExists(userID){
	    if(this.playerIds.includes(userID)){
	        return this.playerIds.indexOf(userID);
	    }
	    else{
	        return -1;
	    }
	}

	getPlayers(){
		return this.playerIds;
	}

	getPlayerName(){
		return this.playerIds;
	}

	getPlayersStats(){
		var message = "";
		for(var i = 0; i < this.players.length; i++){
            message += this.playerNames[i] + "- " + this.players[i].getLives() + ".\n";
        }

        return message;
	}

	getLevel(){
		return this.level;
	}

	getCards(){
		return this.cards;
	}

	getActive(){
		return this.gameActive;
	}

	getLevel(){
		return this.level;
	}

	addPlayer(userId, user){
		var playerId = this.playerExists(userId);
		/*if(playerId != -1){
			console.log("already added");
		}	
		else{*/
			this.playerIds.push(userId);
			var newPlayer = new Player(userId);
			this.players.push(newPlayer);
			this.playerNames.push(user);
		//}
	}

	removePlayer(userId){
		if(this.gameActive != 1){
			var playerId = this.playerExists(userId);
			this.playerIds.slice(playerId, 1);
			this.players.slice(playerId, 1);
		}
	}

	async startGame(){
		this.gameActive = 1;
		this.level++;
		if(this.level > this.maxLevel){
			this.maxLevel = this.level;
		}

		if(this.level == 1){
			this.resetLives();
		}

		for(var i = 0; i < this.level * this.playerIds.length; i++){
			this.cards[i] = this.random100();
			this.cardsSorted[i] = this.cards[i];
		}

		await this.cardsSorted.sort();

		return this.cards;
	}

	resetLives(){
		var totalLives = this.playerIds.length;

		for(var i = 0; i < this.playerIds.length; i++){
			var thisplayer = this.players[i];
			thisplayer.setLives(totalLives);
		}
	}

	checkNumber(number, userId){
		var response = [];
		response['over'] = -1;
		response['cardsBefore'] = this.cardsSorted;

		if(this.cardsSorted[0] == number){
			this.cardsSorted.shift();
			response['over'] = 0;
			if(this.cardsSorted.length == 0){
				response['message'] = this.endGame();
				response['over'] = 1;
			}
		}
		else{
			var playerId = this.playerExists(userId);
			var thisplayer = this.players[playerId];
			thisplayer.removeLives();

			var totalCards = 0;
			var cardNumbers = "";

			while(number >= this.cardsSorted[0] && totalCards != 0){
				cardNumbers += this.cardsSorted[0] + " ";
				this.cardsSorted.shift();
				totalCards++;
			}

			response['totalCards'] = totalCards;
			response['cardNumbers'] = cardNumbers;

			if(this.cardsSorted.length == 0){
				response['message'] = this.endGame();
				response['over'] = 2;
			}
			else{
				response['over'] = 3;
			}
		}
		
		response['cards'] = this.cardsSorted;

		return response;

	}

	endGame(){
		this.totalGamesComplete++;
		this.gameActive = 0;
		this.cards = [];
		this.cardsSorted = [];
		var removedUsers = "";

		for(var i = 0; i < this.playerIds.length; i++){
			var thisplayer = this.players[i];
			if(thisplayer.getOut() == 1){
				this.removePlayer(thisplayer.userId);
				removedUsers += this.playerNames[i] + ", ";	
			}
		}

		removedUsers = removedUsers.substring(0, removedUsers.length - 2);
		if(removedUsers.length != 0){
			removedUsers += ". These people have run out of lives during this round and will not be in the next round";
		}
		return removedUsers
	}

	random100(){
		var number = Math.floor(Math.random() * 100) + 1;
		while(this.cards.includes(number)){
			number = Math.floor(Math.random() * 100) + 1;
		}
	    return number;
	}
}
