const path = require("path");
const { isMainThread, Worker } = require("worker_threads");
const pathToResizeWorker = path.resolve(__dirname, "./resizeWorker.js");
const pathToMonnochromeWorker = path.resolve(__dirname, "/monochromeWorker.js");
function uploadPathResolver(filename) {
  return path.resolve(__dirname, "../uploads", filename);
}
var resizeWorkerFinished = false;
var monochromeWorkerFinished = false;
function imageProcessor(filename) {
  const sourcePath = uploadPathResolver(filename);
  const resizedDestination = uploadPathResolver("resized-" + filename);
  const monochromeDestination = uploadPathResolver("monochrome-" + filename);
  return new Promise((resolve, reject) => {
    if (isMainThread) {
      try {
        const resizeWorker = new Worker(pathToResizeWorker, {
          workerData: { source: sourcePath, destination: resizedDestination },
        });
        const monochromeWorker = new Worker(pathToMonnochromeWorker, {
          workerData: {
            source: sourcePath,
            destination: monochromeDestination,
          },
        });
        resizeWorker.on("message", (error) => {
          if (monochromeWorkerFinished === true) {
            resolve();
          }
          reject(new Error(error.message));
        });
        resizeWorker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error("Exited with status code" + code));
          }
        });
        monochromeWorker.on("message", (message) => {
          monochromeWorkerFinished = true;
          if (resizeWorkerFinished === true) {
            resolve("monochromeWorker finished processing");
          }
        });
        monochromeWorker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error("Exited with status code" + code));
          }
        });
        monochromeWorker.on("error", (code) => {
          if (code !== 0) {
            reject(new Error("Exited with status code " + code));
          }
        });
      } catch {}
    } else {
      reject(new Error("not on main thread"));
    }
    resolve();
  });
}

module.exports = imageProcessor;
