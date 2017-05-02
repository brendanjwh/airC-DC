// this script is what launches the audio and webcam

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var camvideo = document.getElementById('monitor');

  if (!navigator.getUserMedia) 
  {
    document.getElementById('messageError').innerHTML = 
      'Sorry. <code>navigator.getUserMedia()</code> is not available.';
  }
  navigator.getUserMedia({video: true}, gotStream, noStream);

function gotStream(stream) 
{
  if (window.URL) 
  {   camvideo.src = window.URL.createObjectURL(stream);   } 
  else // Opera
  {   camvideo.src = stream;   }

  camvideo.onerror = function(e) 
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

//The code below contains a loop to draw the contents of the video tag onto the canvas tag, enabling us to do cool things with the image. 
// Based on http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html 
// assign global variables to HTML elements
var video = document.getElementById( 'monitor' );
var videoCanvas = document.getElementById( 'videoCanvas' );
var videoContext = videoCanvas.getContext( '2d' );

var layer2Canvas = document.getElementById( 'layer2' );
var layer2Context = layer2Canvas.getContext( '2d' );

var blendCanvas  = document.getElementById( "blendCanvas" );
var blendContext = blendCanvas.getContext('2d');

var messageArea = document.getElementById( "messageArea" );
var timeout
    
// background color if no video present
videoContext.fillStyle = '#005337';
videoContext.fillRect( 0, 0, videoCanvas.width, videoCanvas.height ); 


// start the loop       
animate();

function animate() 
{
    requestAnimationFrame( animate ); //The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint. 
  
  render(); //this renders the mirror video canvas and the canvas with buttons adding the video and buttons as graphics to their respective canvas. 
  blend();  
  checkAreas();
  // timeOut = setTimeout(animate(), 1000/60); //this sets how many pics/second are taken. wasn't working properly also, with the first parameter, was messing stuff up giving errors in console. Not necessary to have, was fun feature to add. 
}

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
    var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3; 
    var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
    var diff = threshold(fastAbs(average1 - average2)); // this is comparing the difference in pixels between two canvas images. 
    target[4*i]   = diff;
    target[4*i+1] = diff;
    target[4*i+2] = diff;
    target[4*i+3] = 0xFF;
    ++i;
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
