var Point = function(x,y,z){
    if(x !== undefined && y !== undefined && z !== undefined){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    this.faces = [];
}

Point.prototype.midpoint = function(point){
    var newPoint = new Point();

    newPoint.x = (this.x + point.x)/2;
    newPoint.y = (this.y + point.y)/2;
    newPoint.z = (this.z + point.z)/2;

    return newPoint;
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



    /*

    var newx = Math.sqrt(Math.pow(radius,2) / (1 + Math.pow(yx,2) + Math.pow(zx,2)));
    var newy = Math.sqrt((Math.pow(radius,2) - Math.pow(newx,2)) / (1 + Math.pow(yz,2)));
    var newz = Math.sqrt((Math.pow(radius,2) - Math.pow(newx,2) - Math.pow(newy,2)));

    this.x = newx;
    this.y = newy;
    this.z = newz;

    console.log(Math.sqrt(Math.pow(newx,2) + Math.pow(newy,2) + Math.pow(newz,2)));
   */

    return this;

};

Point.prototype.registerFace = function(face){
    this.faces.push(face);
}

Point.prototype.toString = function(){
    return "" + this.x + "," + this.y + "," + this.z;

}



var Face = function(point1, point2, point3){

    this.point1 = point1; // top
    this.point2 = point2; // bot left
    this.point3 = point3; // bot right
};

Face.prototype.subdivide = function(last, checkPoint){

    if(typeof last != "boolean"){
        last = false;
    }

    if(typeof checkPoint != "function"){
        checkPoint = function(p){return p};
    }

    var nf = [];
    var np1 = checkPoint(this.point1.midpoint(this.point2));
    var np2 = checkPoint(this.point1.midpoint(this.point3));
    var np3 = checkPoint(this.point3.midpoint(this.point2));
    
    var nf1 = new Face(this.point1, np1, np2);
    var nf2 = new Face(np1, this.point2, np3);
    var nf3 = new Face(np1, np2, np3);
    var nf4 = new Face(np2, np3, this.point3);

    // the last time we are subdividing, register all the faces
    // with the point so we can figure out neighbors and 
    // build my hexes
    if(last){
        np1.registerFace(nf1);
        np1.registerFace(nf2);
        np1.registerFace(nf3);
        np2.registerFace(nf1);
        np2.registerFace(nf3);
        np2.registerFace(nf4);
        np3.registerFace(nf2);
        np3.registerFace(nf3);
        np3.registerFace(nf4);
        this.point1.registerFace(nf1);
        this.point2.registerFace(nf2);
        this.point3.registerFace(nf4);

    }

    nf.push(nf1);
    nf.push(nf2);
    nf.push(nf3);
    nf.push(nf4);

    return nf;

};


var Tile = function(centerPoint){
    // make the tiles at the end.
    // we render the triangles by the center point out to a percentage of the permiters

    this.centerPoint = centerPoint;

};

var Hexsphere = function(radius, numDivisions){

    var tao = 1.61803399;
    var corners = [
        new Point(radius, tao * radius, 0),
        new Point(-radius, tao * radius, 0),
        new Point(radius,-tao * radius,0),
        new Point(-radius,-tao * radius,0),
        new Point(0,radius,tao * radius),
        new Point(0,-radius,tao * radius),
        new Point(0,radius,-tao * radius),
        new Point(0,-radius,-tao * radius),
        new Point(tao * radius,0,radius),
        new Point(-tao * radius,0,radius),
        new Point(tao * radius,0,-radius),
        new Point(-tao * radius,0,-radius)
    ];

    this.points = {};

    for(var i = 0; i< corners.length; i++){
        this.points[corners[i]] = corners[i];
    }

    this.faces = [
        new Face(corners[0], corners[1], corners[4]),
        new Face(corners[1], corners[9], corners[4]),
        new Face(corners[4], corners[9], corners[5]),
        new Face(corners[5], corners[9], corners[3]),
        new Face(corners[2], corners[3], corners[7]),
        new Face(corners[3], corners[2], corners[5]),
        new Face(corners[7], corners[10], corners[2]),
        new Face(corners[0], corners[8], corners[10]),
        new Face(corners[0], corners[4], corners[8]),
        new Face(corners[8], corners[2], corners[10]),
        new Face(corners[8], corners[4], corners[5]),
        new Face(corners[8], corners[5], corners[2]),
        new Face(corners[1], corners[0], corners[6]),
        new Face(corners[11], corners[1], corners[6]),
        new Face(corners[3], corners[9], corners[11]),
        new Face(corners[6], corners[10], corners[7]),
        new Face(corners[3], corners[11], corners[7]),
        new Face(corners[11], corners[6], corners[7]),
        new Face(corners[6], corners[0], corners[10]),
        new Face(corners[9], corners[1], corners[11])
    ];

    var _this = this; // argh
    while(numDivisions > 0){
        numDivisions --;
        var facesNew = [];
        for(var i = 0; i< this.faces.length; i++){
            var nf = this.faces[i].subdivide(i == 0, function(point){
                if(_this.points[point]){
                    return _this.points[point];
                } else {
                    _this.points[point] = point;
                    return point;
                }
            });
            for(var j = 0; j < nf.length; j++){
                facesNew.push(nf[j]);

            }
        }
        this.faces = facesNew;
    }

    var newPoints = {};


    for(var p in this.points){
        var np = this.points[p].project(tao * 10);
        newPoints[np] = np;
    }

    this.points = newPoints;

    this.tiles = [];

    for(var c = 0; c< corners.length; c++){
        this.tiles.push(new Tile(corners[c]));
    }

    var tileNum = 0;

    while(tileNum < this.tiles.length){
        console.log("Processing " + tileNum + " of " + this.tiles.length);
        tileNum++;


    }
    
};
