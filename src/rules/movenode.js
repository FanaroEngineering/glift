goog.provide('glift.rules.MoveNode');

glift.rules.movenode = function(properties, children, nodeId, parentNode) {
  return new glift.rules.MoveNode(properties, children, nodeId, parentNode);
};

/**
 * A Node in the MoveTree.
 *
 * @package
 * @constructor @final @struct
 */
glift.rules.MoveNode = function(properties, children, nodeId, parentNode) {
  this._properties = properties || glift.rules.properties();
  this.children = children || [];
  this._nodeId = nodeId || { nodeNum: 0, varNum: 0 }; // this is a bad default.
  this._parentNode = parentNode;
  /**
   * Marker for determining mainline.  Should ONLY be used by onMainline from
   * the movetree.
   */
  // TODO(kashomon): Consider putting this in a data class.
  this._mainline = false;
};

glift.rules.MoveNode.prototype = {
  /** Get the properties */
  properties: function() { return this._properties; },

  /**
   * Set the NodeId. Each node has an ID based on the depth and variation
   * number.
   *
   * Great caution should be exercised when using this method.  If you
   * don't adjust the surrounding nodes, the movetree will get into a funky
   * state.
   */
  _setNodeId: function(nodeNum, varNum) {
    this._nodeId = { nodeNum: nodeNum, varNum: varNum };
    return this;
  },

  /**
   * Get the node number (i.e., the depth number).  For our purposes, we
   * consider passes to be moves, but this is a special enough case that it
   * shouldn't matter for most situations.
   */
  getNodeNum: function() { return this._nodeId.nodeNum; },

  /** Gets the variation number. */
  getVarNum: function() { return this._nodeId.varNum; },

  /** Gets the number of children. */
  numChildren: function() { return this.children.length; },

  getIntersection: function() {
    var colors = ['B', 'W'];
    for (var i in colors) {
      var color = colors[i];
      if(this._properties.propMap[color] != undefined) {
        return this._properties.propMap[color];
      }
    }
  },

  /** Add a new child node. */
  addChild: function() {
    this.children.push(glift.rules.movenode(
      glift.rules.properties(),
      [], // children
      { nodeNum: this.getNodeNum() + 1, varNum: this.numChildren() },
      this));
    return this;
  },

  /**
   * Get the next child node.  This the same semantically as moving down the
   * movetree.
   */
  getChild: function(variationNum) {
    variationNum = variationNum || 0;
    if (this.children.length > 0) {
      return this.children[variationNum];
    } else {
      return null;
    }
  },

  /** Return the parent node. Returns null if no parent node exists. */
  getParent: function() { return this._parentNode ? this._parentNode : null; },

  /**
   * Renumber the nodes.  Useful for when nodes are deleted during SGF editing.
   * Note: This performs the renumbering recursively
   */
  renumber: function() {
    numberMoves(this, this._nodeId.nodeNum, this._nodeId.varNum);
    return this;
  }
};

// Private number moves function
var numberMoves = function(move, nodeNum, varNum) {
  move._setNodeId(nodeNum, varNum);
  for (var i = 0; i < move.children.length; i++) {
    var next = move.children[i];
    numberMoves(next, nodeNum + 1, i);
  }
  return move;
};
