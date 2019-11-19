// Setup discord and logger and cron
    var Discord = require('discord.io');
    var logger = require('winston');
    var auth = require('./auth.json');
    var cron = require("cron");

// Fun Bot Array Initializations
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'black', 'white', 'grey', 'brown', 'tan'];

// Configure logger settings
    logger.remove(logger.transports.Console);
    logger.add(new logger.transports.Console, {
        colorize: true
    });
    logger.level = 'debug';

// Initialize Discord Bot
    var bot = new Discord.Client({
       token: auth.token,
       autorun: true
    });

    // This just prints when you start
    bot.on('ready', function (evt) {
        logger.info(bot.username + ' - (' + bot.id + ')');
    });

// Variables
    var cronChannelTestId = 0; // this is a saved channel id for the good morning cron

// Helper Functions
    function goodMorning(){
        bot.sendMessage({
            to: cronChannelTestId,
            message: "Good Morning !"
        });
    }

// Cron Job Setups
    var goodMorningJob = new cron.CronJob('0 30 10 * * *', goodMorning);

// Bot On Message Responses
    bot.on('message', function (user, userID, channelID, message, evt) {
        // Commands that start with ~ go here
        if (message.substring(0, 1) == '~') {
            var args = message.substring(1).split(' ');
            var cmd = args[0];
            args = args.splice(1);
            switch(cmd) {            
                case 'batNips':
                case 'batnips':
                case 'BatNips':
                case 'Batnips':
                    bot.sendMessage({
                        to: channelID,
                        message: 'BatNips ! https://imgur.com/a/c5PN4TP'
                    });
                    break;
                case 'butts':
                    bot.sendMessage({
                        to: channelID,
                        message: 'We all love butts.'
                    })
                    break;
                case 'grillMeACheese':
                    bot.sendMessage({
                        to: channelID,
                        message: 'https://www.youtube.com/watch?v=U6V8OmFz1jM'
                    })
                    break;
                case 'gucci':
                    bot.sendMessage({
                        to: channelID,
                        message: 'https://media.discordapp.net/attachments/608017200711729162/627615678018486322/unknown.png'
                    })
                    break;
                case 'angrypants':
                    bot.sendMessage({
                        to: channelID,
                        message: 'https://media.discordapp.net/attachments/608723228721938435/627997236755955752/14102446_10208533864123065_8943067988458447371_n.png?width=527&height=702'
                    })
                    break;
                case 'rickroll':
                    bot.sendMessage({
                        to: channelID,
                        message: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                    })
                    break;
                case 'color':
                    bot.sendMessage({
                        to: channelID,
                        message: colors[Math.floor(Math.random() * 13)]
                    })
                    break;
                case 'ready':
                    bot.sendMessage({
                        to: channelID,
                        message: "Bonesaw is READY ! https://www.youtube.com/watch?v=691qO96VRVw"
                    })
                    break;
                case 'gameboy':
                    bot.sendMessage({
                        to: channelID,
                        message: "https://cdn.discordapp.com/attachments/624368677986238504/628357374192779264/70312300_2932057710155045_4612042788475764736_n.png"
                    })
                    break;
                case 'cronChannelGoodMorning':
                    cronChannelTestId = channelID
                    goodMorningJob.start();   
                    break;
                case 'uggo':
                    bot.sendMessage({
                        to: channelID,
                        message: "YOU UGGO !!\nUGGOOOOOOOO !!!!!"
                    })
                    break;
                case 'birthday':
                    message = message.substring(10);
                    message = message.toUpperCase();
                    bot.sendMessage({
                        to: channelID,
                        message: "HAPPY BIRTHDAY " + message + " !!!!!" + "\n https://www.handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg"
                    });
                    break;
                case 'pricePotato':
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
                        bot.sendMessage({
                            to: channelID,
                            // You can find the structure of the JSON Data on the OSRS api wherever that is hosted now.
                            message: "The price of a potato is: " + jsondata['item']['current']['price']
                        });
                      });

                    }).on("error", (err) => {
                      logger.info("Error: " + err.message);
                    });
                    break;
             }
         }
         else if(user == "BatNips"){
            //return;
            // Do not do anything in response to yourself Batnips.
         }
         // Commands containing a phrase go under here. Make sure it's not from Batnips though.
         else if((message.toLowerCase().includes("let's bash") || message.toLowerCase().includes("lets bash")) && user != "BatNips"){
            bot.sendMessage({
                to: channelID,
                message: "Let's Bash !"
            })
         }
         else if(message.toLowerCase().includes("life is change") && user != "BatNips"){
            bot.sendMessage({
                to: channelID,
                message: "Change is life."
            })
         }
         else if((message.toLowerCase().includes("69") || message.toLowerCase().includes("420")) && user != "BatNips" && message.substring(0, 2) != '<@'){
            bot.sendMessage({
                to: channelID,
                message: "Noice."
            })
         }
         else if(message.toLowerCase().includes("noice") && user != "BatNips"){
            bot.sendMessage({
                to: channelID,
                message: "Noice."
            })
         }
         else if(message.toLowerCase().includes("change is life") && user != "BatNips"){
            bot.sendMessage({
                to: channelID,
                message: "Life is change."
            })
         }
         else if((message.toLowerCase().includes("morning") || message.toLowerCase().includes("mornin")) && user != "BatNips" && message.length <= 15){
            newMessage = message.split(" ");

            if(newMessage[0].toLowerCase().includes("g") || newMessage[0].toLowerCase().includes("morning") || newMessage[0].toLowerCase().includes("mornin")){
                bot.sendMessage({
                    to: channelID,
                    message: "Good Morning !"
                });
            }
         }
         else if(message.toLowerCase().includes("life is") && user != "BatNips"){
            bot.sendMessage({
                to: channelID,
                message: "Life is change."
            })
         }
         else if(message.toLowerCase().includes("butts") && message != "We all love butts."){
            bot.sendMessage({
                to: channelID,
                message: 'We all love butts.'
            })
         }
         // Weird issue with @'ing lady penguin. Her username converts to an ID with 99 and prints this. TODO: Figure out a way to deal with this earlier
         else if(message.toLowerCase().includes("99") && user != "BatNips" && !message.toLowerCase().includes("99s") && !message.toLowerCase().includes("99-") && message.substring(0, 2) != '<@'){
            bot.sendMessage({
                to: channelID,
                message: '99 !'
            })
         }
         else if(message.toLowerCase().includes("who run the world") && user != "BatNips"){
            bot.sendMessage({
                to: channelID,
                message: 'PANTSU !'
            })
         }
         else if((message.toLowerCase().includes("thanks nips") || message.toLowerCase().includes("thanks batnips") || message.toLowerCase().includes("thank you nips") || message.toLowerCase().includes("thank you batnips")) && user != "BatNips"){
            bot.sendMessage({
                to: channelID,
                message: 'No problem !'
            })
         }
    });

// Bot On Message Responses
    bot.on('presence', function(user, userID, status, game, event) { 
        /*if(user == "VailVeix" && status == "online"){
            bot.sendMessage({
                to: "587391421812572242",
                message: user + " is here. Welcome back QT !"
            })
        }*/
    });

