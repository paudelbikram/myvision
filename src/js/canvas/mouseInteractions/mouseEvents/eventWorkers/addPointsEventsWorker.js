import { removeEditedPolygonId } from './editPolygonEventsWorker';
import {
  removePolygonPoints, getPolygonEditingStatus, setEditablePolygon,
  getPolygonIdIfEditing, initializeAddNewPoints, addFirstPoint,
  addPoint, completePolygon, drawLineOnMouseMove, moveAddablePoint,
  addPointsMouseHover, resetAddPointProperties,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { resetCanvasEventsToDefault } from '../resetCanvasUtils/resetCanvasEventsFacade';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let addingPoints = false;
let addFirstPointMode = false;
let coordinatesOfLastMouseHover = null;

function isRightMouseButtonClicked(pointer) {
  if (coordinatesOfLastMouseHover.x !== pointer.x) {
    return true;
  }
  return false;
}

// a nice to have - when nothing selected and selecting remove or add points
// make sure that everything that uses change returns polygon points and see
// if they can be changed directly instead of searching the canvas
// highlight all of them differently to indicate that
// they can all be potentially edited (ghost points)
// when click to remove points, remove, click add new polygon, click add points, adding replaces
// longer distance

// disallow the creation of a new polygon with 1 point
// keep polygon points when adding points and clicked the same button or remove button
// when finished adding points, then add again and click inside a polygon, the initial point
// turns green
// cancel add points by the other buttons
// when clicking on rectangle, doesn't stay on top of other polygons
// when selecting add points mode, and selecting a polygon then another,
//  the add points doesn't work properly when overlapping
// when clicking add points multiple times after adding points, can't select polygon

function mouseOverEvents(events) {
  addPointsMouseHover(events);
}

function setAddPointsEventsCanvas(canvasObj) {
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
  addingPoints = false;
  addFirstPointMode = false;
  resetAddPointProperties();
}

function prepareToAddPolygonPoints(event) {
  removeEditedPolygonId();
  setEditablePolygon(canvas, event.target, false, false, true);
  selectedPolygonId = event.target.id;
  // should not be managed here
}

function moveAddPoints(event) {
  if (addingPoints) {
    moveAddablePoint(event);
  }
}

function mouseMove(event) {
  if (addingPoints) {
    const pointer = canvas.getPointer(event.e);
    coordinatesOfLastMouseHover = pointer;
    drawLineOnMouseMove(pointer);
  }
}

function pointMouseDownEvents(event) {
  if (!addingPoints) {
    if (event.target) {
      enableActiveObjectsAppearInFront(canvas);
      if (event.target.shapeName === 'point') {
        initializeAddNewPoints(event);
        addingPoints = true;
        addFirstPointMode = true;
      } else {
        if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
          newPolygonSelected = true;
        } else {
          newPolygonSelected = false;
        }
        preventActiveObjectsAppearInFront(canvas);
      }
    }
  } else if (addFirstPointMode) {
    if (!event.target || (event.target && (event.target.shapeName !== 'point' && event.target.shapeName !== 'initialAddPoint'))) {
      addFirstPoint(event);
      addFirstPointMode = false;
    }
  } else if (event.target && event.target.shapeName === 'point') {
    addingPoints = false;
    completePolygon(event.target);
    resetCanvasEventsToDefault();
  } else if (!event.target
      || (event.target && (event.target.shapeName !== 'initialAddPoint' && event.target.shapeName !== 'tempPoint'))) {
    const pointer = canvas.getPointer(event.e);
    if (!isRightMouseButtonClicked(pointer)) {
      addPoint(pointer);
    }
  }
}

function pointMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'polygon' && newPolygonSelected) {
    prepareToAddPolygonPoints(event);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    if (!addingPoints) {
      removePolygonPoints();
      selectedPolygonId = null;
    }
  }
}

function getSelectedPolygonIdForAddPoints() {
  return selectedPolygonId;
}

export {
  mouseMove,
  moveAddPoints,
  mouseOverEvents,
  pointMouseUpEvents,
  pointMouseDownEvents,
  setAddPointsEventsCanvas,
  getSelectedPolygonIdForAddPoints,
};