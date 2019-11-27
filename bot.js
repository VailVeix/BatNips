// Setup discord and logger and cron
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const auth = require('./auth.json');
    const Game = require('./Classes/Game.js');
    const cron = require("cron");
    const var_dump = require('var_dump');

// Initialize Discord Bot
    client.on('ready', () => {
      console.log('Ready!');
    });

// Variables
    var cronChannelTestId = 0; // this is a saved channel id for the good morning cron

    var gameChannels = [];
    var games = [];
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'black', 'white', 'grey', 'brown', 'tan'];

// Helper Functions
    function goodMorning(){
        cronChannelTestId.send('Good Morning !');
    }

    function gameExists(channelID){
        if(gameChannels.includes(channelID)){
            return gameChannels.indexOf(channelID);
        }
        else{
            return -1;
        }
    }

    function createGame(channelID, userID, user){
        gameId = gameExists(channelID);
        if(gameId != -1){
            console.log("Game Exists");
        }
        else{
            myGame = new Game(channelID, userID, user);
            gameChannels.push(channelID);
            games.push(myGame);
        }
    }

    function addPlayer(channelID, userId, user){
        gameId = gameExists(channelID);
        game = games[gameId];
        game.addPlayer(userId, user);
    }

    function startGame(channelID){
        gameId = gameExists(channelID);
        if(gameId == -1){
            return;
        }        
        game = games[gameId];
        var cards = game.startGame(channelID);   
        var players = game.getPlayers();
        var level = game.getLevel();
        var cardsSorted = game.getCardsSorted();

        var cardCount = 0;

        for (var i = 0; i < players.length; i++) {
            playerID = players[i];
            cardMessage = "";

            for(var j = 0; j < level; j++){
                cardMessage += cards[cardCount] + ", ";
                cardCount++;
            }

            cardMessage = cardMessage.substring(0, cardMessage.length - 2);

            bot.sendMessage({
                to: playerID,
                message: cardMessage
            });
        }

        bot.sendMessage({
            to: channelID,
            message: "Starting level " + game.getLevel() + " now ! You have all been sent your numbers for this round. If you think you have the lowest number, please enter it now."
        });
    }

    function checkNumber(channelID, userId, number){
        gameId = gameExists(channelID);
        game = games[gameId];
        var response = game.checkNumber(number, userId);

        /*bot.sendMessage({
            to: channelID,
            message: "Debug Message. Over Response- " + response['over'] + ". Total Cards- " + response['totalCards'] + ". Total Cards Numbers- " + response['cardNumbers'] + ". Cards- " + response['cards'] + ". Before Cards- " + response['cardsBefore'] 
        });*/

        if(response['over'] == 1){
            bot.sendMessage({
                to: channelID,
                message: "Congratulations ! You have played the last number. The level is over ! Start again to go to the next level. " + response['message']
            });
            //console.log("Congratulations ! You have played the last card. The level is over ! Start again to go to the next level.");
        }
        else if(response['over'] == 2){
            bot.sendMessage({
                to: channelID,
                message: "Whomp whomp. " + number + " was the highest number. This level is over. Start again to go to the next level. " + response['message']
            });
            //console.log("Whomp whomp. " + number + " is the highest card. This level is over. Start again to go to the next level.");
        }
        else if(response['over'] == 3){
            bot.sendMessage({
                to: channelID,
                message: "Whomp whomp. " + number + " is the highest number now. All lower number have been discarded for a total of " + response['totalCards'] + ". Who's next ?"
            });
            //console.log("Whomp whomp. " + number + " is the new highest card. Who's next ?");
        } 
        else if(response['over'] == -1){
            bot.sendMessage({
                to: channelID,
                message: "You cannot play numbers lower than the previous one. All lower numbers have been discared. Please play the next number."
            });
            //console.log("Whomp whomp. " + number + " is the new highest card. Who's next ?");
        }   
        else{
            bot.sendMessage({
                to: channelID,
                message: "Congratulations ! " + number + " was the next number. Who's next ?"
            });
            //console.log("Congratulations ! " + number + " was the next card. Who's next ?" + response['over']);
        }
    }

    function closeGame(channelID){
        gameId = gameExists(channelID);
        game = games[gameId];
        if(gameId != -1 && game.getActive() != 1){
            gameChannels.slice(gameId, 1);
            games.slice(gameId, 1);
        }
    }

    function listPlayers(channelID){
        gameId = gameExists(channelID);
        game = games[gameId];
        message = game.getPlayersStats();

        message = "Player Stats: \n" + message;

        bot.sendMessage({
            to: channelID,
            message: message
        });
    }

    function currentLevel(channelID){
        gameId = gameExists(channelID);
        game = games[gameId];
        level = game.getLevel();
        bot.sendMessage({
            to: channelID,
            message: "The current level is " + level
        });
    }

// Cron Job Setups
    var goodMorningJob = new cron.CronJob('0 30 10 * * *', goodMorning);

// Bot On Message Responses
    client.on('message', message => {
        messageContent = message.content;
        channelID = message.channel;
        user = message.author.tag;
        userID = message.author.id;
        
        /*console.log(message);
        console.log(user);
        console.log(userID);*/
        
        // Commands that start with ~ go here
        if (messageContent.substring(0, 1) == '~') {
            var args = messageContent.substring(1).split(' ');
            var cmd = args[0];
            args = args.splice(1);
            switch(cmd) {   
                /*case 'lastLevel':
                    currentLevel(channelID);
                    break;
                case 'mindGameListPlayers':
                    listPlayers(channelID);
                    break;
                case 'startMindGame':
                    startGame(channelID);
                    break;
                case 'createMindGame':
                    createGame(channelID, userID, user);
                    bot.sendMessage({
                        to: channelID,
                        message: "The Mind Game for this channel has been created ! Players please add yourself then start the game when you're ready."
                    });
                    break;
                case 'mindGameAddMe':
                    addPlayer(channelID, userID, user);
                    bot.sendMessage({
                        to: channelID,
                        message: user + " has been added to the Mind Game."
                    });
                    break;
                case 'dmUser':
                    taggedUser = messageContent.match('<@(.*)>');
                    taggedUser = taggedUser[1];
                    if(taggedUser.substring(0,1) == "!"){
                        taggedUser = taggedUser.substr(1);
                    }
                    bot.sendMessage({
                        to: taggedUser,
                        message: user + " wants you to know they love butts !"
                    });
                    break;
                case 'closeGame':
                    closeGame();
                    break;*/
                case 'batNips':
                case 'batnips':
                case 'BatNips':
                case 'Batnips':
                    channelID.send("BatNips ! https://imgur.com/a/c5PN4TP");
                    break;
                case 'butts':
                    channelID.send('We all love butts.');
                    break;
                case 'grillMeACheese':
                    channelID.send('https://www.youtube.com/watch?v=U6V8OmFz1jM');
                    break;
                case 'gucci':
                    channelID.send('https://media.discordapp.net/attachments/608017200711729162/627615678018486322/unknown.png');
                    break;
                case 'angrypants':
                    channelID.send('https://media.discordapp.net/attachments/608723228721938435/627997236755955752/14102446_10208533864123065_8943067988458447371_n.png?width=527&height=702');
                    break;
                case 'rickroll':
                    channelID.send('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                    break;
                case 'color':
                    channelID.send(colors[Math.floor(Math.random() * 13)]);
                    break;
                case 'ready':
                    channelID.send('Bonesaw is READY ! https://www.youtube.com/watch?v=691qO96VRVw');
                    break;
                case 'gameboy':
                    channelID.send('https://cdn.discordapp.com/attachments/624368677986238504/628357374192779264/70312300_2932057710155045_4612042788475764736_n.png');
                    break;
                case 'cronChannelGoodMorning':
                    cronChannelTestId = channelID
                    goodMorningJob.start();   
                    break;
                case 'uggo':
                    channelID.send('YOU UGGO !!\nUGGOOOOOOOO !!!!!');
                    break;
                case 'birthday':
                    messageContent = messageContent.substring(10);
                    messageContent = messageContent.toUpperCase();
                    channelID.send("HAPPY BIRTHDAY " + messageContent + " !!!!!" + "\n https://www.handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg");
                    break;
                case 'pricePotato':
                case 'pricepotato':
                    // This is a call to the OSRS price library for potatoes only.
                    // I didn't create any look up to go from name -> item id. #dealwithit
                    // To duplicate just go look up the item ID for whatever youwant and replace hte 1942 with it.
                    const https = require('https');

                    https.get("https://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=1942", (resp) => {
                        let data = '';

                        // A chunk of data has been recieved.
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        // The whole response has been received. Print out the result.
                        resp.on('end', () => {
                            jsondata = JSON.parse(data);
                            channelID.send("The price of a potato is: " + jsondata['item']['current']['price']);
                        });

                    }).on("error", (err) => {
                        //logger.info("Error: " + err.message);
                    });
                    break;
            }
        }
        else if(userID == "627303083709431838"){
            //return;
            // Do not do anything in response to yourself Batnips.
        }
        else if(gameExists(channelID) != -1 && !isNaN(messageContent)){
            //checkNumber(channelID, userID, messageContent);
        }
        // Commands containing a phrase go under here. Make sure it's not from Batnips though.
        else if((messageContent.toLowerCase().includes("let's bash") || messageContent.toLowerCase().includes("lets bash"))){
            channelID.send("Let's Bash !");
        }
        else if(messageContent.toLowerCase().includes("life is change")){
            channelID.send("Change is life.");
        }
        else if((messageContent.toLowerCase().includes("69") || messageContent.toLowerCase().includes("420")) && messageContent.substring(0, 2) != '<@'){
            channelID.send("Noice.");
        }
        else if(messageContent.toLowerCase().includes("noice")){
            channelID.send("Noice.");
        }
        else if(messageContent.toLowerCase().includes("change is life")){
            channelID.send("Life is change.");
        }
        else if((messageContent.toLowerCase().includes("morning") || messageContent.toLowerCase().includes("mornin")) && messageContent.length <= 15){
            newMessage = messageContent.split(" ");

            if(newMessage[0].toLowerCase().includes("g") || newMessage[0].toLowerCase().includes("morning") || newMessage[0].toLowerCase().includes("mornin")){
                channelID.send("Good Morning !");
            }
        }
        else if(messageContent.toLowerCase().includes("life is")){
            channelID.send("Life is change.");
        }
        else if(messageContent.toLowerCase().includes("butts")){
            channelID.send("We all love butts.");
        }
        // Weird issue with @'ing lady penguin. Her username converts to an ID with 99 and prints this. TODO: Figure out a way to deal with this earlier
        else if(messageContent.toLowerCase().includes("99") && !messageContent.toLowerCase().includes("99s") && !messageContent.toLowerCase().includes("99-") && messageContent.substring(0, 2) != '<@'){
            channelID.send("99 !");
        }
        else if(messageContent.toLowerCase().includes("who run the world")){
            channelID.send("PANTSU !");
        }
        else if((messageContent.toLowerCase().includes("thanks nips") || messageContent.toLowerCase().includes("thanks batnips") || messageContent.toLowerCase().includes("thank you nips") || messageContent.toLowerCase().includes("thank you batnips"))){
            channelID.send("No problem !");
        }
    });

client.login(auth.token);