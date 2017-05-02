/* ======================================================== 
              javascript sound button set up
   ======================================================== */
var buttons = [];

var button1 = new Image();
button1.src ="images/cowbell.jpeg";
var buttonData1 = { name:"strum", image:button1, x:80, y:305, w:70, h:70, class:"strum" };
buttons.push( buttonData1 );


var button2 = new Image();
button2.src ="images/cowbell.jpeg";
var buttonData2 = { name:"E", image:button2, x:339, y:100, w:30, h:30 };
buttons.push( buttonData2 );

var button3 = new Image();
button3.src ="images/cowbell.jpeg";
var buttonData3 = { name:"G", image:button2, x:270, y:150, w:30, h:30 };
buttons.push( buttonData3 );

function isStrumming(buttonName) {
  if (buttonName === "strum") {
    return true;
  }
  return false;
}

function playSound(sound){
  var audio = document.getElementById(sound);
  console.log(sound);
  if (readyToPlay(audio) === true) {
    delay(audio);
    audio.play();
    console.log(audio.id);
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
