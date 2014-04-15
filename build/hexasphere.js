(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.Hexasphere = require('./src/hexasphere');

},{"./src/hexasphere":3}],2:[function(require,module,exports){
var Point = require('./point');

var _faceCount = 0;

var Face = function(point1, point2, point3, register){
    this.id = _faceCount++;

    if(register == undefined){
        register = true;
    }

    this.points = [
        point1,
        point2,
        point3
        ];
    if(register){
        point1.registerFace(this);
        point2.registerFace(this);
        point3.registerFace(this);
    }
};

Face.prototype.getOtherPoints = function(point1){
    var other = [];
    for(var i = 0; i < this.points.length; i++){
        if(this.points[i].toString() !== point1.toString()){
            other.push(this.points[i]);
        }
    }
    return other;
}

Face.prototype.findThirdPoint = function(point1, point2){
    for(var i = 0; i < this.points.length; i++){
        if(this.points[i].toString() !== point1.toString() && this.points[i].toString() !== point2.toString()){
            return this.points[i];
        }
    }
}

Face.prototype.isAdjacentTo = function(face2){
    // adjacent if 2 of the points are the same
    
    var count = 0;
    for(var i = 0; i< this.points.length; i++){
        for(var j =0 ; j< face2.points.length; j++){
            if(this.points[i].toString() == face2.points[j].toString()){
                count++;
                
            }
        }
    }

    return (count == 2);
}

Face.prototype.getCentroid = function(clear){
    if(this.centroid && !clear){
        return this.centroid;
    }
    var centroid = new Point();

    centroid.x = (this.points[0].x + this.points[1].x + this.points[2].x)/3;
    centroid.y = (this.points[0].y + this.points[1].y + this.points[2].y)/3;
    centroid.z = (this.points[0].z + this.points[1].z + this.points[2].z)/3;

    this.centroid = centroid;

    return centroid;

}

module.exports = Face;

},{"./point":4}],3:[function(require,module,exports){
var Tile = require('./tile'),
    Face = require('./face'),
    Point = require('./point');

var Hexasphere = function(radius, numDivisions, hexSize){

    this.radius = radius;
    var tao = 1.61803399;
    var corners = [
        new Point(1000, tao * 1000, 0),
        new Point(-1000, tao * 1000, 0),
        new Point(1000,-tao * 1000,0),
        new Point(-1000,-tao * 1000,0),
        new Point(0,1000,tao * 1000),
        new Point(0,-1000,tao * 1000),
        new Point(0,1000,-tao * 1000),
        new Point(0,-1000,-tao * 1000),
        new Point(tao * 1000,0,1000),
        new Point(-tao * 1000,0,1000),
        new Point(tao * 1000,0,-1000),
        new Point(-tao * 1000,0,-1000)
    ];

    var points = {};

    for(var i = 0; i< corners.length; i++){
        points[corners[i]] = corners[i];
    }

    var faces = [
        new Face(corners[0], corners[1], corners[4], false),
        new Face(corners[1], corners[9], corners[4], false),
        new Face(corners[4], corners[9], corners[5], false),
        new Face(corners[5], corners[9], corners[3], false),
        new Face(corners[2], corners[3], corners[7], false),
        new Face(corners[3], corners[2], corners[5], false),
        new Face(corners[7], corners[10], corners[2], false),
        new Face(corners[0], corners[8], corners[10], false),
        new Face(corners[0], corners[4], corners[8], false),
        new Face(corners[8], corners[2], corners[10], false),
        new Face(corners[8], corners[4], corners[5], false),
        new Face(corners[8], corners[5], corners[2], false),
        new Face(corners[1], corners[0], corners[6], false),
        new Face(corners[11], corners[1], corners[6], false),
        new Face(corners[3], corners[9], corners[11], false),
        new Face(corners[6], corners[10], corners[7], false),
        new Face(corners[3], corners[11], corners[7], false),
        new Face(corners[11], corners[6], corners[7], false),
        new Face(corners[6], corners[0], corners[10], false),
        new Face(corners[9], corners[1], corners[11], false)
    ];

    var getPointIfExists = function(point){
        if(points[point]){
            // console.log("EXISTING!");
            return points[point];
        } else {
            // console.log("NOT EXISTING!");
            points[point] = point;
            return point;
        }
    };


    var newFaces = [];

    for(var f = 0; f< faces.length; f++){
        // console.log("-0---");
        var prev = null;
        var bottom = [faces[f].points[0]];
        var left = faces[f].points[0].subdivide(faces[f].points[1], numDivisions, getPointIfExists);
        var right = faces[f].points[0].subdivide(faces[f].points[2], numDivisions, getPointIfExists);
        for(var i = 1; i<= numDivisions; i++){
            prev = bottom;
            bottom = left[i].subdivide(right[i], i, getPointIfExists);
            for(var j = 0; j< i; j++){
                var nf = new Face(prev[j], bottom[j], bottom[j+1]); 
                newFaces.push(nf);

                if(j > 0){
                    nf = new Face(prev[j-1], prev[j], bottom[j]);
                    newFaces.push(nf);
                }
            }
        }
    }

    faces = newFaces;

    var newPoints = {};
    for(var p in points){
        var np = points[p].project(radius);
        newPoints[np] = np;
    }

    points = newPoints;

    this.tiles = [];

    for(var p in points){
        this.tiles.push(new Tile(points[p], hexSize));
    }

};

module.exports = Hexasphere;

},{"./face":2,"./point":4,"./tile":5}],4:[function(require,module,exports){
var Point = function(x,y,z){
    if(x !== undefined && y !== undefined && z !== undefined){
        this.x = x;
        this.y = y;
        this.z = z;

    }

    this.faces = [];
}

Point.prototype.subdivide = function(point, count, checkPoint){

    var segments = [];
    segments.push(this);

    for(var i = 1; i< count; i++){
        var np = new Point(this.x * (1-(i/count)) + point.x * (i/count),
            this.y * (1-(i/count)) + point.y * (i/count),
            this.z * (1-(i/count)) + point.z * (i/count));
        np = checkPoint(np);
        segments.push(np);
    }

    segments.push(point);

    return segments;

}

Point.prototype.segment = function(point, percent){
    var newPoint = new Point();
    percent = Math.max(0.01, Math.min(1, percent));

    newPoint.x = point.x * (1-percent) + this.x * percent;
    newPoint.y = point.y * (1-percent) + this.y * percent;
    newPoint.z = point.z * (1-percent) + this.z * percent;
    return newPoint;

};

Point.prototype.midpoint = function(point, location){
    return this.segment(point, .5);
}


Point.prototype.project = function(radius, percent){
    if(percent == undefined){
        percent = 1.0;
    }

    percent = Math.max(0, Math.min(1, percent));
    var yx = this.y / this.x;
    var zx = this.z / this.x;
    var yz = this.z / this.y;

    var mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    var ratio = radius/ mag;

    this.x = this.x * ratio * percent;
    this.y = this.y * ratio * percent;
    this.z = this.z * ratio * percent;
    return this;

};

Point.prototype.registerFace = function(face){
    this.faces.push(face);
}

Point.prototype.getOrderedFaces = function(){
    var workingArray = this.faces.slice();
    var ret = [];

    var i = 0;
    while(i < this.faces.length){
        if(i == 0){
            ret.push(workingArray[i]);
            workingArray.splice(i,1);
        } else {
            var hit = false;
            var j = 0;
            while(j < workingArray.length && !hit){
                if(workingArray[j].isAdjacentTo(ret[i-1])){
                    hit = true;
                    ret.push(workingArray[j]);
                    workingArray.splice(j, 1);
                }
                j++;
            }
        }
        i++;
    }

    return ret;
}

Point.prototype.findCommonFace = function(other, notThisFace){
    for(var i = 0; i< this.faces.length; i++){
        for(var j = 0; j< other.faces.length; j++){
            if(this.faces[i].id === other.faces[j].id && this.faces[i].id !== notThisFace.id){
                return this.faces[i];
            }
        }
    }

    return null;
}



Point.prototype.toString = function(){
    return "" + Math.round(this.x*100)/100 + "," + Math.round(this.y*100)/100 + "," + Math.round(this.z*100)/100;

}

module.exports = Point;

},{}],5:[function(require,module,exports){
var Point = require('./point');

var Tile = function(centerPoint, hexSize){
    
    if(hexSize == undefined){
        hexSize = 1;
    }

    hexSize = Math.max(.01, Math.min(1.0, hexSize));

    this.centerPoint = centerPoint;
    this.faces = centerPoint.getOrderedFaces();
    this.boundary = [];

    this.triangles = [];


    for(var f=0; f< this.faces.length; f++){
        this.boundary.push(this.faces[f].getCentroid().segment(this.centerPoint, hexSize));
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

Tile.prototype.toString = function(){
    return this.centerPoint.toString();
};

module.exports = Tile;

},{"./point":4}]},{},[1]);