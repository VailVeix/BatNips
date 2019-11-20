module.exports = class Player{
	constructor(userId){
		this.userId = userId;
		
		this.lives = -1;
		this.out = 0;
	}

	setLives(lives){
		this.lives = lives;
	}

	removeLives(){
		this.lives--;

		if(this.lives == 0){
			this.out = 1;
		}
	}

	getLives(){
		return this.lives
	}

	getOut(){
		return this.out;
	}
}