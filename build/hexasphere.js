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

    console.log(this.x);

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


var Hexsphere = function(radius, numDivisions){

    var tao = 1.61803399;
    var p = [
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

    for(var i = 0; i< p.length; i++){
        this.points[p[i]] = p[i];
    }

    this.faces = [
        new Face(p[0], p[1], p[4]),
        new Face(p[1], p[9], p[4]),
        new Face(p[4], p[9], p[5]),
        new Face(p[5], p[9], p[3]),
        new Face(p[2], p[3], p[7]),
        new Face(p[3], p[2], p[5]),
        new Face(p[7], p[10], p[2]),
        new Face(p[0], p[8], p[10]),
        new Face(p[0], p[4], p[8]),
        new Face(p[8], p[2], p[10]),
        new Face(p[8], p[4], p[5]),
        new Face(p[8], p[5], p[2]),
        new Face(p[1], p[0], p[6]),
        new Face(p[11], p[1], p[6]),
        new Face(p[3], p[9], p[11]),
        new Face(p[6], p[10], p[7]),
        new Face(p[3], p[11], p[7]),
        new Face(p[11], p[6], p[7]),
        new Face(p[6], p[0], p[10]),
        new Face(p[9], p[1], p[11])
    ];

    var _this = this; // argh
    while(numDivisions > 0){
        numDivisions --;
        var facesNew = [];
        for(var i = 0; i< this.faces.length; i++){
            var nf = this.faces[i].subdivide(i == 0, function(point){
                if(_this.points[point]){
                    console.log("already got that point!");
                    return _this.points[point];
                } else {
                    console.log("don't have " + point);
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
    
};
