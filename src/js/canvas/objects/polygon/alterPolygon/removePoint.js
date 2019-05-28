import fabric from 'fabric';
import polygonProperties from '../properties';

function removePolygonPointImpl(canvas, polygon, polygonPoints, pointId) {
  if (polygon.points.length - polygon.numberOfNullPolygonPoints > 3) {
    if (Object.keys(polygon.points[pointId]).length === 0) {
      /* when the last polygons are removed, the ones before it are moved
      // to the last position - thus causing the possibility of getting nulls
       TIP - when point is null - it was already moved to the last element */
      for (let i = pointId - 1; i > -1; i -= 1) {
        if (Object.keys(polygon.points[i]).length !== 0) {
          polygon.points[polygon.points.length - 1] = polygon.points[i];
          polygon.points[i] = {};
          break;
        }
      }
    } else if ((polygon.points.length - 1) === pointId) {
      /* when last element - remove and find the next not null below it to
      to be the last element in order to enable the polygon to stay */
      for (let i = pointId - 1; i > -1; i -= 1) {
        if (Object.keys(polygon.points[i]).length !== 0) {
          polygon.points[pointId] = polygon.points[i];
          polygon.points[i] = {};
          break;
        }
      }
    } else {
      polygon.points[pointId] = {};
    }
    console.log(polygonPoints);
    canvas.remove(polygonPoints[pointId]);
    polygonPoints[pointId] = null;

    polygon.numberOfNullPolygonPoints += 1;
    if (polygon.points.length - polygon.numberOfNullPolygonPoints > 3) {
      // after all polygon points are removed from new polygon, completely remove -
      // depending on how we add new points

      // change cursor modes name convention
      // make invisible circle width a little bit bigger
      // make sure to test with thresholded performance
      // when finished creating polygon, have popup option to go back to editing
      // have tick box for moving first point
      // make sure the least amount of points when removing is same for drawing
      console.log('need to signal restrictions');
    }
    canvas.renderAll();
  }
}

function polygonPointsToObjects(polygonPoints, noNullPointsRef) {
  let pointId = 0;
  polygonPoints.forEach(() => {
    noNullPointsRef[pointId].pointId = pointId;
    pointId += 1;
  });
  return noNullPointsRef;
}

function getCleanPolygonPointsArrayImpl(polygon, pointsObjects) {
  let noNullPointsRef = [];
  pointsObjects.forEach((point) => {
    if (point) noNullPointsRef.push(point);
  });
  if (!polygon) return [];
  const polygonPoints = polygon.points;
  const noNullPolygonPoints = [];
  for (let i = 0; i < polygonPoints.length; i += 1) {
    if (Object.keys(polygonPoints[i]).length !== 0) {
      noNullPolygonPoints.push(polygonPoints[i]);
    }
  }
  polygon.set('points', noNullPolygonPoints);
  polygon.numberOfNullPolygonPoints = 0;
  noNullPointsRef = polygonPointsToObjects(noNullPolygonPoints, noNullPointsRef);
  return noNullPointsRef;
}

/* function getCleanPolygonPointsArrayImpl(polygon, pointObjects) {
  const noNullPointObjects = [];
  pointObjects.forEach((point) => {
    if (point) noNullPointObjects.push(point);
  });
  pointObjects = [];
  if (!polygon) return [];
  const polygonPoints = polygon.points;
  const noNullPolygonPoints = [];
  for (let i = 0; i < polygonPoints.length; i += 1) {
    if (Object.keys(polygonPoints[i]).length !== 0) {
      noNullPolygonPoints.push(polygonPoints[i]);
    }
  }
  polygon.set('points', noNullPolygonPoints);
  polygon.numberOfNullPolygonPoints = 0;
  for (let i = 0; i < noNullPointObjects.length; i += 1) {
    noNullPointObjects[i].pointId = noNullPointObjects[i].pointId;
  }
  return noNullPointObjects;
}
*/
export { removePolygonPointImpl, getCleanPolygonPointsArrayImpl };
