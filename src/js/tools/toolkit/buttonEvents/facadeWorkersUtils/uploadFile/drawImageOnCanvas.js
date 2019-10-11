import fabric from 'fabric';

const initialFileStatus = {};
const newFileStatus = { uploaded: false, name: null };
const canvasProperties = {};
let canvas = null;
let canvas2 = null;
let currentImage = null;
let canvasElement = null;
// timeout canvas zooms make it look bad, check zoom in and out to original

function drawResizedImage(newImageDimensions) {
  canvas.setWidth(newImageDimensions.width);
  canvas.setHeight(newImageDimensions.height);
  fabric.Image.fromURL(currentImage.src, (img) => {
    newFileStatus.scaleX = canvas.width / img.width;
    newFileStatus.scaleY = canvas.height / img.height;
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: newFileStatus.scaleX,
      scaleY: newFileStatus.scaleY,
    });
  });

  newFileStatus.width = newImageDimensions.width;
  newFileStatus.height = newImageDimensions.height;
}

function drawResizedImage2(newImageDimensions) {
  console.log('ACTIVATED');
  canvas2.setWidth(newImageDimensions.width);
  canvas2.setHeight(newImageDimensions.height);
  fabric.Image.fromURL(currentImage.src, (img) => {
    newFileStatus.scaleX = canvas2.width / img.width;
    newFileStatus.scaleY = canvas2.height / img.height;
    canvas2.setBackgroundImage(img, canvas2.renderAll.bind(canvas2), {
      scaleX: newFileStatus.scaleX,
      scaleY: newFileStatus.scaleY,
    });
  });
  setTimeout(() => {
    canvasElement.style.display = 'none';
  }, 0);
  newFileStatus.width = newImageDimensions.width;
  newFileStatus.height = newImageDimensions.height;
}

function drawOriginalImage() {
  canvas.setWidth(currentImage.width);
  canvas.setHeight(currentImage.height);
  fabric.Image.fromURL(currentImage.src, (img) => {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {});
  });
  newFileStatus.width = currentImage.width;
  newFileStatus.height = currentImage.height;
}

function drawImageOnCanvas(newImageDimensions, overlayCanvas) {
  if (newImageDimensions) {
    if (!overlayCanvas) {
      drawResizedImage(newImageDimensions);
    } else {
      drawResizedImage2(newImageDimensions);
    }
  } else {
    drawOriginalImage();
  }
}

function resizeWhenImageExceedsMaxHeight() {
  const newImageDimensions = {};
  const heightRatio = canvasProperties.maximumCanvasHeight / currentImage.height;
  newImageDimensions.height = canvasProperties.maximumCanvasHeight;
  newImageDimensions.width = currentImage.width * heightRatio;
  return newImageDimensions;
}

function resizeWhenImageExceedsMaxWidth(imageDimensions) {
  const newImageDimensions = {};
  const widthRatio = canvasProperties.maximumCanvasWidth / imageDimensions.width;
  newImageDimensions.width = canvasProperties.maximumCanvasWidth;
  newImageDimensions.height = imageDimensions.height * widthRatio;
  return newImageDimensions;
}

function setCanvasWrapperMaximumDimensions() {
  const canvasWrapper = document.getElementById('canvas-wrapper');
  canvasWrapper.style.maxWidth = `${canvasProperties.maximumCanvasWidth}px`;
  canvasWrapper.style.maxHeight = `${canvasProperties.maximumCanvasHeight}px`;
}

function setCanvasProperties() {
  canvasProperties.maximumCanvasHeight = window.innerHeight - 50;
  canvasProperties.maximumCanvasWidth = window.innerWidth - 162;
}

function draw(overlayCanvas) {
  setCanvasProperties();
  if (canvasProperties.maximumCanvasHeight < currentImage.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight();
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
      newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
    drawImageOnCanvas(newImageDimensions, overlayCanvas);
  } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
    const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
    drawImageOnCanvas(newImageDimensions);
  } else {
    drawImageOnCanvas();
  }
  setCanvasWrapperMaximumDimensions();
  initialFileStatus.width = newFileStatus.width;
  initialFileStatus.height = newFileStatus.height;
}

function drawImageFromList(selectedImage) {
  currentImage = selectedImage;
  draw(draw);
}

function onImageLoad() {
  newFileStatus.uploaded = true;
  currentImage = this;
  draw();
}

function assignCanvasForDrawImageOnCanvas(newCanvas, newCanvas2) {
  canvas = newCanvas;
  canvas2 = newCanvas2;
  canvasElement = document.getElementById('canvas-wrapper-inner');
  setCanvasProperties();
}

function getCanvasProperties() {
  return canvasProperties;
}

function getImageProperties() {
  return newFileStatus;
}

function calculateNewFileSizeRatio() {
  const newFileSizeRatio = {};
  newFileSizeRatio.width = newFileStatus.width / initialFileStatus.width;
  newFileSizeRatio.height = newFileStatus.height / initialFileStatus.height;
  initialFileStatus.width = newFileStatus.width;
  initialFileStatus.height = newFileStatus.height;
  return newFileSizeRatio;
}

function resizeCanvasAndImage() {
  if (canvasProperties.maximumCanvasHeight < currentImage.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight();
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
      newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
    drawImageOnCanvas(newImageDimensions);
  } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
    const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
    drawImageOnCanvas(newImageDimensions);
  } else {
    drawImageOnCanvas();
  }
  return calculateNewFileSizeRatio();
}

function resizeCanvas() {
  setCanvasProperties();
  if (canvasProperties.maximumCanvasHeight < currentImage.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight();
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
      newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
    canvas.setWidth(newImageDimensions.width);
    canvas.setHeight(newImageDimensions.height);
  } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
    const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
    canvas.setWidth(newImageDimensions.width);
    canvas.setHeight(newImageDimensions.height);
  } else {
    canvas.setWidth(currentImage.width);
    canvas.setHeight(currentImage.height);
  }
  setCanvasWrapperMaximumDimensions();
}

export {
  onImageLoad, getImageProperties, resizeCanvasAndImage, resizeCanvas,
  assignCanvasForDrawImageOnCanvas, getCanvasProperties, drawImageFromList,
};
