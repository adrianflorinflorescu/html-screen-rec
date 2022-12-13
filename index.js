function saveDataToFile(data) {
  // Create a Blob from the recorded data
  const blob = new Blob([data], { type: 'video/webm' });

  // Create a URL for the blob object
  const url = URL.createObjectURL(blob);

  // Create a new anchor element
  const a = document.createElement('a');

  // Set the href and download attributes of the anchor element
  // to the URL of the blob object
  a.href = url;
  a.download = 'screen-recording.webm';

  // Click the anchor element to trigger the download
  a.click();
}

let mediaRecorder;


function startRec(){
    // Ask the user for permission to access the screen
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
      // Create a new MediaRecorder instance
      mediaRecorder = new MediaRecorder(stream);
  
      // Start recording
      mediaRecorder.start();
  
      // Listen for the 'dataavailable' event, which is fired
      // whenever there is a chunk of data available
      mediaRecorder.addEventListener('dataavailable', (event) => {
        // Save the recorded data to a file
        saveDataToFile(event.data);
      });
    });
}

function stopRec(){
    // Stop the recording
    mediaRecorder.stop();
}

export async function init() {
  // First, check if the browser supports the MediaRecorder API
  if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    console.error('MediaRecorder is not supported by this browser.');
    return;
  }

  const startElement = document.getElementById('start');
  const stopElement = document.getElementById('stop');

  // Start recording when the user clicks on the button
  startElement.addEventListener('click', startRec);

  // Stop recording when the user clicks on the button
  stopElement.addEventListener('click', stopRec);
}