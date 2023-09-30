let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let logElement = document.getElementById("log");
let recorder;

function log(msg) {
  logElement.innerHTML = msg + "\n";
}

function startRecording(stream) {
  recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = (event) => data.push(event.data);
  recorder.start();

  log('"Recording..."');

  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = (event) => reject(event.name);
  });

  return Promise.all([stopped, recorder]).then(() => data);
}

function stop(stream) {
  if (recorder.state == "recording") {
    recorder.stop();
  }

  stream.getTracks().forEach((track) => track.stop());
}

startButton.addEventListener(
  "click",
  function () {
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        preview.srcObject = stream;

        preview.captureStream =
          preview.captureStream || preview.mozCaptureStream;
        return new Promise((resolve) => (preview.onplaying = resolve));
      })
      .then(() => startRecording(preview.captureStream()))
      .then((recordedChunks) => {
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recording.src = URL.createObjectURL(recordedBlob);
        downloadButton.href = recording.src;
        downloadButton.download = "RecordedVideo.webm";

        log(
          "Successfully recorded " +
            recordedBlob.size +
            " bytes of " +
            recordedBlob.type +
            " media."
        );
      })
      .catch(log);
  },
  false
);

stopButton.addEventListener(
  "click",
  function () {
    stop(preview.srcObject);
  },
  false
);
