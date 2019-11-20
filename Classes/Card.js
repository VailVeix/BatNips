module.exports = class Card{
	constructor(userId, cardNumber){
		this.userId = userId;
		this.card = cardNumber;
	}

	getNumber(){
		return this.card
	}
}