//import contstants
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

//define the allowed characters
const allowed = "abcdefghijklmnopqrstuvwxyz 1234567890".split("");

//define what a result is
function Result(answer) {
  this.cnt = 0;
  this.ans = answer;
}

//define data objects
function DataObject(invar0, outvar0) {
  this.invar = invar0;
  this.outvar = outvar0;
}

//the data
var data = [];
var lastAns = null;

//off or on
var off = false;

data.push(new DataObject("hi", "whats up"));

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
  
  if(msg.content == ".load") {
    fs.readFile("data.txt", function(err, buf) {
      data = JSON.parse(buf.toString());
      msg.reply("Loaded " + data.length + " data objects")
    });
    return;
  }else if(msg.content == ".save"){
    fs.writeFile("data.txt", JSON.stringify(data), (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
      msg.reply("Saved " + data.length + " data objects");
    });
    return;
  }else if(msg.content == ".off") {
    off = true;
  }else if(msg.content == ".on") {
    off = false;
    return;
  }
  
  //if is off dont continue
  if(off) return;

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
      data.push(new DataObject(lastAns, input));
    }

    //determine the answer
    //compare how many words are same and add to a result list
    let answers = [];
    //loop through data
    for (let i = 0; i < data.length; i++) {
      //get dataobject
      let dato = data[i];
      //create a result
      let res = new Result(dato.outvar);
      //create split string array
      let wordos = dato.invar.split(" ");
      //loop through the words list
      for (let j = 0; j < words.length; j++) {
        for (let k = 0; k < wordos.length; k++) {
          //if the word and the datword are the
          if (wordos[k] == words[j]) {
            res.cnt += 1;
          }
        }
      }
      //add result res to list
      answers.push(res);
    }

    //now find highest result
    let high = new Result();
    high.cnt = -1;

    //loop through res
    for (let i = 0; i < answers.length; i++) {
      let resn = answers[i];
      if (resn.cnt > high.cnt) {
        high = resn;
      }
    }

    //answer is repetition at first
    let answer = input;
    //set the answer if got a match
    if (high.cnt > 0) {
      answer = high.ans;
    }
    
    //print answer
    msg.reply(answer);
    //set last answer for learning
    lastAns = answer;
  }
});

//log onto the server
client.login(process.env.BOT_TOKEN);
