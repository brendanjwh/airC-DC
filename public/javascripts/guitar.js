/* ======================================================== 
              javascript sound button set up
   ======================================================== */

var button7 = new Image();
button7.src ="/images/superguitar.png";
var buttonData7 = { name:"guitar", image:button7, x:-300, y:-150, w:1900, h:1200 };


var buttons = [];

var button1 = new Image();
button1.src ="/images/pick.jpg";
var buttonData1 = { name:"strum", image:button1, x:50, y:700, w:160, h:160, class:"strum" };
buttons.push( buttonData1 );


var button2 = new Image();
button2.src ="/images/g.png";
var buttonData2 = { name:"G", image:button2, x:1180, y:30, w:100, h:100 };
buttons.push( buttonData2 );

var button3 = new Image();
button3.src ="/images/a.png";
var buttonData3 = { name:"A", image:button3, x:1000, y:160, w:100, h:100};
buttons.push( buttonData3 );

var button4 = new Image();
button4.src ="/images/b.png";
var buttonData4 = { name:"B", image:button4, x:800, y:300, w:100, h:100, class:"B" };
buttons.push( buttonData4 );

var button5 = new Image();
button5.src ="/images/d.png";
var buttonData5 = { name:"D", image:button5, x:590, y:450, w:100, h:100 };
buttons.push( buttonData5 );

var button6 = new Image();
button6.src ="/images/e.png";
var buttonData6 = { name:"E_hi", image:button6, x:360, y:590, w:100, h:100 };
buttons.push( buttonData6 );

var showbuttons = [];

var button1 = new Image();
button1.src ="images/pick.jpg";
var buttonData1 = { name:"strum", image:button1, x:1155, y:700, w:190, h:190, class:"strum" };
showbuttons.push( buttonData1 );

var button2 = new Image();
button2.src ="images/g.png";
var buttonData2 = { name:"G", image:button2, x:195, y:30, w:100, h:100 };
showbuttons.push( buttonData2 );

var button3 = new Image();
button3.src ="images/a.png";
var buttonData3 = { name:"A", image:button3, x:375, y:160, w:100, h:100 };
showbuttons.push( buttonData3 );

var button4 = new Image();
button4.src ="images/b.png";
var buttonData4 = { name:"B", image:button4, x:575, y:300, w:100, h:100 };
showbuttons.push( buttonData4 );

var button5 = new Image();
button5.src ="images/d.png";
var buttonData5 = { name:"D", image:button5, x:765, y:450, w:100, h:100 };
showbuttons.push( buttonData5 );

var button6 = new Image();
button6.src ="images/e.png";
var buttonData6 = { name:"E_hi", image:button6, x:950, y:590, w:100, h:100 };
showbuttons.push( buttonData6 );

notes = ["A", "B", "D", "strum", "E_hi", "G"];
sounds = [];

for (var i = 0; i < notes.length; i++) {
  sounds.push( document.getElementById(notes[i]));
}

var urlHash = {
  "A": "https://7972657d7c.dataplicity.io/6/blink", 
  "B": "https://7972657d7c.dataplicity.io/17/blink", 
  "D": "https://7972657d7c.dataplicity.io/11/blink", 
  "strum": "https://7972657d7c.dataplicity.io/5/blink", 
  "E_hi": "https://7972657d7c.dataplicity.io/22/blink", 
  "G": "https://7972657d7c.dataplicity.io/9/blink"
} 

var instrumentHash = {
  "A": aSuppressor,
  "B": bSuppressor,
  "D": dSuppressor,
  "strum": strumSuppressor,
  "E_hi": e_hiSuppressor,
  "G": gSuppressor,
}

var aSuppressor = new FunctionSuppressor({threshold: 150 });
var dSuppressor = new FunctionSuppressor({threshold: 150 });
var bSuppressor = new FunctionSuppressor({threshold: 150 });
var strumSuppressor = new FunctionSuppressor({threshold: 150 });
var e_hiSuppressor = new FunctionSuppressor({threshold: 150 });
var gSuppressor = new FunctionSuppressor({threshold: 150 });


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true ); // false for synchronous request
    console.log("here");
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function FunctionSuppressor(args) {
  this.callback = args.callback;
  this.lastFiredAt = Date.now();
  this.threshold = args.threshold;
}

FunctionSuppressor.prototype.fire = function() {
  if (Date.now() - this.lastFiredAt > this.threshold) {
    httpGet("https://7972657d7c.dataplicity.io/6/blink")
    this.lastFiredAt = Date.now();
  }
}

function getSuppressor(sound, audio) {
  //instrumentHash[sound].playAudio(audio);
  //httpGet(urlHash[sound]);
}

FunctionSuppressor.prototype.playAudio = function(audio)  {
  if (Date.now() - this.lastFiredAt > this.threshold) {
    delay(audio); 
    audio.play();
    this.lastFiredAt = Date.now(); 
  }
}

function isStrumming(buttonName) {
  if (buttonName === "strum") {
    return true;
  }
  return false;
}



function playSound(sound){
  //debugger
  var audio = document.getElementById(sound);
  if (readyToPlay(audio)) {
    delay(audio);
    stopNote(sounds);
    audio.play();
    //getSuppressor(sound, audio);
  }
 }


 function stopNote(sounds) {
    for (var i =0; i < sounds.length; i++) {
      if (sounds[i].currentTime > 0) {
        sounds[i].pause();
        sounds[i].currentTime = 0;
      }
    }
 }

function readyToPlay(soundTime) {
  if ((soundTime.currentTime > .16) || (soundTime.currentTime === 0)) {
    return true
  } else {
  return false
  }
}

function delay(sound) {
  if (sound.duration > 0 && !sound.paused) {
      sound.currentTime = 0;
    }
  } 
