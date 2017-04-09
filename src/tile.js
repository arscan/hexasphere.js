var Point = require('./point');

function vector(p1, p2){
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    }

}

// https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal
// Set Vector U to (Triangle.p2 minus Triangle.p1)
// Set Vector V to (Triangle.p3 minus Triangle.p1)
// Set Normal.x to (multiply U.y by V.z) minus (multiply U.z by V.y)
// Set Normal.y to (multiply U.z by V.x) minus (multiply U.x by V.z)
// Set Normal.z to (multiply U.x by V.y) minus (multiply U.y by V.x)
function calculateSurfaceNormal(p1, p2, p3){

    U = vector(p1, p2)
    V = vector(p1, p3)
    
    N = {
        x: U.y * V.z - U.z * V.y,
        y: U.z * V.x - U.x * V.z,
        z: U.x * V.y - U.y * V.x
    };

    return N;

}

function pointingAwayFromOrigin(p, v){
    return ((p.x * v.x) >= 0) && ((p.y * v.y) >= 0) && ((p.z * v.z) >= 0)
}

function normalizeVector(v){
    var m = Math.sqrt((v.x * v.x) + (v.y * v.y) + (v.z * v.z));

    return {
        x: (v.x/m),
        y: (v.y/m),
        z: (v.z/m)
    };

}

var Tile = function(centerPoint, hexSize){
    
    if(hexSize == undefined){
        hexSize = 1;
    }

    hexSize = Math.max(.01, Math.min(1.0, hexSize));

    this.centerPoint = centerPoint;
    this.faces = centerPoint.getOrderedFaces();
    this.boundary = [];
    this.neighborIds = []; // this holds the centerpoints, will resolve to references after
    this.neighbors = []; // this is filled in after all the tiles have been created

    var neighborHash = {};
    for(var f=0; f< this.faces.length; f++){
        // build boundary
        this.boundary.push(this.faces[f].getCentroid().segment(this.centerPoint, hexSize));

        // get neighboring tiles
        var otherPoints = this.faces[f].getOtherPoints(this.centerPoint);
        for(var o = 0; o < 2; o++){
            neighborHash[otherPoints[o]] = 1;
        }

    }

    this.neighborIds = Object.keys(neighborHash);

    // Some of the faces are pointing in the wrong direction
    // Fix this.  Should be a better way of handling it
    // than flipping them around afterwards

    var normal = calculateSurfaceNormal(this.boundary[1], this.boundary[2], this.boundary[3]);

    if(!pointingAwayFromOrigin(this.centerPoint, normal)){
        this.boundary.reverse();
    }



};

Tile.prototype.getLatLon = function(radius, boundaryNum){
    var point = this.centerPoint;
    if(typeof boundaryNum == "number" && boundaryNum < this.boundary.length){
        point = this.boundary[boundaryNum];
    }
    var phi = Math.acos(point.y / radius); //lat 
    var theta = (Math.atan2(point.x, point.z) + Math.PI + Math.PI / 2) % (Math.PI * 2) - Math.PI; // lon
    
    // theta is a hack, since I want to rotate by Math.PI/2 to start.  sorryyyyyyyyyyy
    return {
        lat: 180 * phi / Math.PI - 90,
        lon: 180 * theta / Math.PI
    };
};



Tile.prototype.scaledBoundary = function(scale){

    scale = Math.max(0, Math.min(1, scale));

    var ret = [];
    for(var i = 0; i < this.boundary.length; i++){
        ret.push(this.centerPoint.segment(this.boundary[i], 1 - scale));
    }

    return ret;
};

Tile.prototype.toJson = function(){
    // this.centerPoint = centerPoint;
    // this.faces = centerPoint.getOrderedFaces();
    // this.boundary = [];
    return {
        centerPoint: this.centerPoint.toJson(),
        boundary: this.boundary.map(function(point){return point.toJson()})
    };

}

Tile.prototype.toString = function(){
    return this.centerPoint.toString();
};

module.exports = Tile;
