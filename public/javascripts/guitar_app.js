
 /* ======================================================== 
        this script is what launches the audio and webcam 
    ======================================================== */

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

window.URL = window.URL || window.webkitURL;

if (!navigator.getUserMedia) 
{
  document.getElementById('messageError').innerHTML = 
    'Sorry. <code>navigator.getUserMedia()</code> is not available.';
}

navigator.getUserMedia({video: true, audio: false}, gotStream, noStream);

function gotStream(stream) 
{
  if (window.URL) 
  {   monitor.src = window.URL.createObjectURL(stream);   } 
  else // Opera
  {   monitor.src = stream;   }

  monitor.onerror = function(e) 
  {   stream.stop();   };

  stream.onended = noStream;
}

function noStream(e) 
{
  var msg = 'No camera available.';
  if (e.code == 1)  
  {   msg = 'User denied access to use camera.';   }
  document.getElementById('errorMessage').textContent = msg;
}

window.onload = function() { 
  // the webcam stream
  // var monitor = document.getElementById('monitor');

  // var videoCanvas = document.getElementById('videoCanvas');
  // var videoContext = videoCanvas.getContext('2d');

  // var greenCanvas = document.getElementById('blendCanvas');
  // var greenCanvasContext = greenCanvas.getContext('2d');


/* ======================================================== 
                    global variable setup
   ======================================================== */
var video = document.getElementById( 'monitor' );
// var video = monitor;
var videoCanvas = document.getElementById( 'videoCanvas' );
var videoContext = videoCanvas.getContext( '2d' );

var layer2Canvas = document.getElementById( 'layer2' );
var layer2Context = layer2Canvas.getContext( '2d' );
// //GREEN SOCK CAM
var blendCanvas  = document.getElementById( "blendCanvas" );
var blendContext = blendCanvas.getContext('2d');
// var greenCanvas = document.getElementById('blendCanvas');
//   var greenCanvasContext = greenCanvas.getContext('2d');
//  var blendContext = videoContext;  
// background color if no video present
videoContext.fillStyle = '#005337';
videoContext.fillRect( 0, 0, videoCanvas.width, videoCanvas.height );       

/* ======================================================== 
                START DAS LOOP, HANS!
   ======================================================== */      
animate();

function animate() 
{
  requestAnimationFrame( animate ); //The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint. 
  
  render(); //this renders the mirror video canvas and the canvas with buttons adding the video and buttons as graphics to their respective canvas. 

  blend();  

  checkAreas();
  // timeOut = setTimeout(animate(), 1000/60); //this sets how many pics/second are taken. wasn't working properly also, with the first parameter, was messing stuff up giving errors in console. Not necessary to have, was fun feature to add. 
}

function render() 
{ 
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
  {
    //where put guitar variable
    layer2Context.drawImage( buttonData7.image, buttonData7.x, buttonData7.y, buttonData7.w, buttonData7.h );
    // mirror video
    videoContext.drawImage( video, 0, 0, videoCanvas.width, videoCanvas.height );
    for ( var i = 0; i < buttons.length; i++ ) {
      //this is where the buttons are being placed on one canvas.
      layer2Context.drawImage( buttons[i].image, buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h );        
  }
}}

var lastImageData;

function blend() 
{
  var width  = videoCanvas.width;
  var height = videoCanvas.height;
  // getImageData is getting pixel information for a certain canvas. params are (left, top, width, height)
  var sourceData = videoContext.getImageData(0, 0, width, height); // get current webcam image data
  if (!lastImageData) lastImageData = videoContext.getImageData(0, 0, width, height); // create an image if the previous image doesn’t exist
  // create a ImageData instance to receive the blended result
  var blendedData = videoContext.createImageData(width, height);
  // blend the 2 images
  differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
  
  // draw the result in a canvas
  blendContext.putImageData(blendedData, 0, 0);
  // store the current webcam image
  lastImageData = sourceData;
}

// this function is used in the blend function 
function differenceAccuracy(target, data1, data2) 
{
  if (data1.length != data2.length) return null; // if they're not the same width and height(canvas), can't compare accurate image pixel differences.
  var i = 0;
  while (i < (data1.length * 0.25)) 
  {
    // (((data1[4*i] < 150) && (data1[4*i+1] > 150) && (data1[4*i+2] < 150)) === true)
    if (data1[4*i+1] > data1[4*i+2] &&  data1[4*i+1] > data1[4*i] + 20 && data1[4*i+2] < 150) {
      //if ((data1[4*i+2] < 150) === true) {
        target[4*i]   = 0;
        target[4*i+1] = 255;
        target[4*i+2] = 0;
        target[4*i+3] = 0xFF;
      ++i;
      //}
    } else {
      target[4*i]   = 0x15;
      target[4*i+1] = 0x15;
      target[4*i+2] = 0x15;
      target[4*i+3] = 0xFF;
      ++i;
    }
  }
}

// fastAbs and threshold functions are plugged into the differenceAccuracy function
function fastAbs(value) 
{
  return (value ^ (value >> 31)) - (value >> 31);
}
function threshold(value) // refers to the change in pixels, we are setting the threshold here for how big a change in pixels should be to want to detect a "motion change". FF might be referring to the white imaging when taking photos, when there is movement, it detects more white in the photo taking.
{
  return (value > 0x15) ? 0xFF : 0;
}
//-----------------------------------------------------------

function checkStrum(blendedData) {
  var i = 0
  var sum = 0;
  var countPixels = blendedData.data.length * 0.25;
  //debugger
    while (i < countPixels) 
    {
      //console.log(i);
      sum += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]);
      ++i;
    }
    // console.log(sum);
  var average = Math.round(sum / (3 * countPixels));
  //debugger
  //console.log(average);
  if (average > 70) {
    return true;
  }
  else return false;
}

function checkNeck( ) {
  var open = 0
  for (var b = buttons.length-1; b > 0; b--) {
    var blendedData = blendContext.getImageData( buttons[b].x, buttons[b].y, buttons[b].w, buttons[b].h );
    if (checkStrum(blendedData) === true) {
      playSound(buttons[b].name)
      open = 1;
     } 
     if (open === 0 && b === 1) {
      playSound(buttons[0].name)
     }
  }
}

//-----------------------------------------------------------

function checkAreas() 
{
  var openE = document.getElementById("strum");
    for (var b = 0; b < buttons.length; b++) 
  {
    var blendedData = blendContext.getImageData( buttons[0].x, buttons[0].y, buttons[0].w, buttons[0].h );
    if (checkStrum(blendedData) === true) {
      openE.pause();
      openE.currentTime =0;
      checkNeck();
    }
    else {
      return
    }
  }
  }
}

