module.exports = class Game{
	constructor(channelId, user){
		this.channelId = channelId;
		
		this.totalGamesComplete = 0;
		this.totalGamesTried = 0;
		this.gameActive = 0;
		this.level = 0;
		this.cards = [];
		this.cardsSorted = [];
		this.maxLevel = 0;

		this.playerIds = [];
		this.playerIds.push(user.id);

		this.players = [];
		this.players.push(user);
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
		return this.players;
	}

	getPlayersStats(){
		var message = "";
		for(var i = 0; i < this.players.length; i++){
            message += this.players[i].username + ".\n";
        }

        return message;
	}

	getLevel(){
		return this.level;
	}

	getCards(){
		return this.cards;
	}

	getCardsSorted(){
		return this.cardsSorted;
	}

	getActive(){
		return this.gameActive;
	}

	addPlayer(user){
		var playerId = this.playerExists(user.id);
		if(playerId != -1){
			console.log("already added");
		}	
		else{
			this.playerIds.push(user.id);
			this.players.push(user); 
		}
	}

	removePlayer(user){
		if(this.gameActive != 1){
			var playerId = this.playerExists(user.id);
			this.playerIds.slice(playerId, 1);
			this.players.slice(playerId, 1);
		}
	}

	startGame(){
		this.gameActive = 1;
		this.level++;
		if(this.level > this.maxLevel){
			this.maxLevel = this.level;
		}

		for(var i = 0; i < this.level * this.playerIds.length; i++){
			this.cards[i] = this.random100();
			this.cardsSorted[i] = parseInt(this.cards[i]);
		}

		this.cardsSorted = this.cardsSorted.sort(function(a, b){return a-b});

		return this.cards;
	}

	checkNumber(number){
		var response = [];
		response['over'] = -1;
		response['cardsBefore'] = this.cardsSorted;

		if(parseInt(this.cardsSorted[0]) == parseInt(number)){
			this.cardsSorted.shift();
			response['over'] = 0;
			if(this.cardsSorted.length == 0){
				this.endGame();
				response['over'] = 1;
			}
		}
		else if(parseInt(this.cardsSorted[0]) > parseInt(number)){
			response['over'] = -1;
		}
		else{			
			this.endGame();
			response['over'] = 2;
		}
		
		response['cards'] = this.cardsSorted;

		return response;

	}

	endGame(){
		this.totalGamesComplete++;
		this.gameActive = 0;
		this.cards = [];
		this.cardsSorted = [];
	}

	random100(){
		var number = Math.floor(Math.random() * 100) + 1;
		while(this.cards.includes(number)){
			number = Math.floor(Math.random() * 100) + 1;
		}
	    return number;
	}
}
