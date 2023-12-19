const startElement = document.getElementById('start')
const stopElement = document.getElementById('stop');
const videoElement = document.getElementById('video')
const recordingTextElement = document.getElementById('recording-text')

let recordedChunks = [];

function saveDataToFile(data) {
    // Create a Blob from the recorded data
    const blob = new Blob([data], { type: 'video/webm' })

    // Create a URL for the blob object
    const url = URL.createObjectURL(blob)

    // Create a new anchor element
    const a = document.createElement('a')

    // Set the href and download attributes of the anchor element
    // to the URL of the blob object
    a.href = url
    a.download = 'screen-recording.webm'

    // Click the anchor element to trigger the download
    a.click();

    recordedChunks.push(data);
}

let mediaRecorder

function startRec() {
    // Ask the user for permission to access the screen
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        // Create a new MediaRecorder instance
        mediaRecorder = new MediaRecorder(stream)

        // hide the start button
        startElement.classList.add('hidden')

        // show the stop button
        stopElement.classList.remove('hidden')

        // update the recording text
        recordingTextElement.textContent = 'Recording...'

        // show the video element
        videoElement.classList.remove('hidden')

        // Start recording
        mediaRecorder.start()

        // Listen for the 'dataavailable' event, which is fired
        // whenever there is a chunk of data available
        mediaRecorder.addEventListener('dataavailable', (event) => {
            saveDataToFile(event.data)

            // hide the stop button
            stopElement.classList.add('hidden')

            // show the start button
            startElement.classList.remove('hidden')

            // update the recording text
            recordingTextElement.textContent = 'Recording stopped.'
        })

        // play the video on the #video element
        videoElement.srcObject = stream
        videoElement.play()

        // Listen for the 'stop' event
        mediaRecorder.addEventListener('stop', () => {

          let blob = new Blob(recordedChunks, {
              type: "video/webm"
          });
          let url = URL.createObjectURL(blob);

          videoElement.srcObject = null;
          videoElement.src = url;
          videoElement.controls = true;
          videoElement.load(); // Load the videoElement
          videoElement.play(); // Play the video

          // Clear recorded chunks for future recordings
          recordedChunks = [];

          // Stop the stream
          stream.getTracks().forEach(track => track.stop());

          // hide the stop button
          stopElement.classList.add('hidden')

          // show the start button
          startElement.classList.remove('hidden')

          // update the recording text
          recordingTextElement.textContent = 'Recording stopped.'

        })
    })
}

export async function init() {
    // First, check if the browser supports the MediaRecorder API
    if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        console.error('MediaRecorder is not supported by this browser.')
        return
    }

    // hide the stop button
    stopElement.classList.add('hidden')

    // hide the video element
    videoElement.classList.add('hidden')

    // Start recording when the user clicks on the button
    startElement.addEventListener('click', startRec)

    // Stop recording when the user clicks on the button
    stopElement.addEventListener('click', () => {
        // Stop recording
        mediaRecorder.stop()
    })
}
