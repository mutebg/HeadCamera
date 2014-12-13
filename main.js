var videoEl = document.querySelector('#video');
var canvasEl = document.querySelector('#canvas');
var goBtn = document.querySelector('#btn-go');
var imageListEl = document.querySelector('#image-list');
var cursorEl = document.querySelector('#cursor');
var pathEl = document.querySelector('#path');
var ctx = canvasEl.getContext('2d');
var localMediaStream = null;
var current = null
var imageList = [];

goBtn.addEventListener('click', go, false);
videoEl.addEventListener('click', capture, false);


function capture() {
  console.log('capture');
  if ( localMediaStream ) {
    ctx.drawImage(videoEl, 0, 0);
    var dataURL = canvasEl.toDataURL('image/png');
    imageList.push( dataURL );
  }
}

function go() {
  pathEl.classList.remove('hide');
  cursorEl.classList.add('start');
  imageList = [];
  var time = 0;
  var period = 200;
  var endTime = 10 * 1000;
  speak('Slowly turn your head left.');
  //capture();
  var interval = setInterval(function(){ 
    capture();
    time += period; 
    if ( time == endTime ) {
      clearInterval(interval);
      cursorEl.classList.remove('start');
      imageListEl.addEventListener('mousemove', moveFace, false);
      showList();
      speak('Scroll down to view result');
    }

    if ( time == 2000) {
      speak('Now very slowly turn your head so you\'re facing the camera.');
    }

    if ( time == 7000 ) {
      speak('And back to the center.');
    }

  }, period);
}

function startVideo() {
  console.log('start');
  speak('Align your face.');
  window.URL = window.URL || window.webkitURL;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia( { video: true }, function(stream) {
      if (window.URL) {
        videoEl.src = window.URL.createObjectURL(stream);
      } else {
        videoEl.src = stream; // Opera support.
      }
      localMediaStream = stream;
     }, onError);
  }
}

function stopVideo() {
  console.log('stop');
  videoEl.pause();
  localMediaStream.stop();
}

var onError = function(e) {
    console.log('Reeeejected!', e);
};

function showList() {
  imageListEl.innerHTML = '';

  //slice imagelist
  var start   = parseInt( imageList.length * 0.25 );
  var end     = parseInt( imageList.length * 0.75 );
  ;
  imageList = imageList.slice(start, end);
  var middle  = parseInt( imageList.length * 0.50 );

  console.log(start, end, middle);

  for( var i in imageList ) {
    var img = document.createElement('IMG');
    img.src = imageList[i];
    var li = document.createElement("LI");
    li.appendChild(img);

    if ( i == middle ) {
      li.classList.add('active');
      current = li;
    }

    imageListEl.appendChild(li);
  }
}

var oldX;
function moveFace(event) {
  if ( oldX > 0 ) {
    var x = event.layerX - oldX;
    oldX = event.layerX;
  } 

  oldX = event.layerX;

  if ( Math.abs(x) > 1 ) {
    if ( x > 0 ) {
      console.log('move right');
      var next = current.nextElementSibling;

    } else {
      var next = current.previousElementSibling;
      console.log('move left');
    }

    if ( next ) {
      current.classList.remove('active');
      current = next;
      current.classList.add('active');
    }
  }
}

startVideo();

function speak(textToSpeak) {
  var newUtterance = new SpeechSynthesisUtterance();
  newUtterance.text = textToSpeak;
  window.speechSynthesis.speak(newUtterance);
}