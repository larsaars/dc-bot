//import contstants
const Discord = require("discord.js");
const client = new Discord.Client();

//define the allowed characters
const allowed = "abcdefghijklmnopqrstuvwxyz 1234567890".split("");

//the data
var data = ["hi,whats up", "are you luca,nope i am lars"];
var lastIn = null;

var MAX_VALUE = 0;
//define what a result is
function Result(answer) {
  this.cnt = 0;
  this.ans = answer;
}

client.on("ready", () => {
  client.user.setPresence({
    game: {
      name: "on joe mama",
      type: "Playing"
    },
    status: "idle"
  });
});

//on input
client.on("message", msg => {
  //return if input was by user
  if (msg.author.bot) return;

  //transform the input
  let input = msg.content
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ");

  //get the words to an array
  let words = input.split(" ");

  //remove the empty entries from the input array
  for (let i = 0; i < words.length; i++) {
    if (words[i] == "") {
      words.splice(i, 1);
    }
  }

  //make sure words len is long enough
  if (words.length > 0) {
    //learn this; add to data list, if lastIn is not null
    if (lastIn != null) {
      data.push(lastIn + "," + input);
    }

    //the answser
    let answer = null;

    //determine the answer
    //compare how many words are same and add to a result list
    let answers = [];
    //loop through data
    for (let sdat in data) {
      //a single data value string split by comma
      //extract the value
      let sdsplit = sdat.split(",");
      let sdwords = sdsplit[0].split(" ");
      //create a result
      let res = new Result();
      //set the res ans
      res.ans = sdsplit[1];
      //loop through the words list
      for (let wordin in words) {
        for (let wordsd in sdwords) {
          //if the word and the datword are the
          if (wordin == wordsd) {
            res.cnt++;
          }
        }
      }
    }

    //now find highest result
    let high = new Result();
    high.cnt = -1;

    //loop through res
    for (let resn in answers) {
      if (resn.cnt > high.cnt) {
        high = resn;
      }
    }

    //set the answer
    if (high.cnt > 0) {
      answer = high.ans;
    }

    //set last input
    if (answer != null) {
      //print answer
      msg.reply(answer);
      //set last answer for learning
      lastIn = answer;
    }
  }
});

//log onto the server
client.login(process.env.BOT_TOKEN);
