goog.require('glift.displays.icons');

/**
 * Row-Center an array of wrapped icons.
 */
glift.displays.icons.rowCenterWrapped = function(
    divBbox, wrappedIcons, vMargin, hMargin, minSpacing) {
  return glift.displays.icons._centerWrapped(
      divBbox, wrappedIcons, vMargin, hMargin, minSpacing, 'h');
}

/**
 * Column-Center an array of wrapped icons.
 */
glift.displays.icons.columnCenterWrapped = function(
    divBbox, wrappedIcons, vMargin, hMargin, minSpacing) {
  return glift.displays.icons._centerWrapped(
      divBbox, wrappedIcons, vMargin, hMargin, minSpacing, 'v');
}

/**
 * Center an array of wrapped icons.
 */
glift.displays.icons._centerWrapped = function(
    divBbox, wrappedIcons, vMargin, hMargin, minSpacing, direction) {
  var bboxes = [];
  if (direction !== 'h' && direction !== 'v') {
    direction = 'h'
  }
  for (var i = 0; i < wrappedIcons.length; i++) {
    bboxes.push(wrappedIcons[i].bbox);
  }

  minSpacing = minSpacing || 0;

  // Row center returns: { transforms: [...], bboxes: [...] }
  if (direction === 'h') {
    var centeringData = glift.displays.gui.rowCenterSimple(
        divBbox, bboxes, vMargin, hMargin, minSpacing);
  } else {
    var centeringData = glift.displays.gui.columnCenterSimple(
        divBbox, bboxes, vMargin, hMargin, minSpacing)
  }
  var transforms = centeringData.transforms;

  // TODO(kashomon): Can the transforms be less than the centerede icons? I
  // think so.  In any case, this case probably needs to be handled.
  for (var i = 0; i < transforms.length && i < wrappedIcons.length; i++) {
    wrappedIcons[i].performTransform(transforms[i]);
  }
  return transforms;
};
