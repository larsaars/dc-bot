//import contstants
const Discord = require("discord.js");
const client = new Discord.Client();

//define the allowed characters
const allowed = "abcdefghijklmnopqrstuvwxyz 1234567890".split("");

//define what a result is
function Result(answer) {
  this.cnt = 0;
  this.ans = answer;
}

//define data objects
function DataObject(in0, out0) {
  this.in = in0;
  this.out = out0;
}

//the data
var data = [new DataObject("hi", "wats up"), new DataObject("whats up", "nothing")];
var lastAns = null;

client.on("ready", () => {
  client.user.setPresence({
    game: {
      name: "chatting",
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
    if (lastAns != null) {
      data.push(lastAns + "," + input);
    }

    //determine the answer
    //compare how many words are same and add to a result list
    let answers = [];
    //loop through data
    for (let dataobject in data) {
      //create a result
      let res = new Result(dataobject.out);
      //loop through the words list
      for (let wordin in words) {
        for (let worddo in dataobject.in.split(" ")) {
          //if the word and the datword are the
          if (wordin == worddo) {
            res.cnt += 1;
          }
        }
      }
    }
    
    msg.reply(answers);

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
      let answer = high.ans;
      //print answer
      msg.reply(answer);
      //set last answer for learning
      lastAns = answer;
    }
  }
});

//log onto the server
client.login(process.env.BOT_TOKEN);
