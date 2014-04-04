var Face = function(point1, point2, point3){

    this.point1 = point1; // top
    this.point2 = point2; // bot left
    this.point3 = point3; // bot right
};

Face.prototype.subdivide = function(checkPoint){

    if(typeof checkPoint != "function"){
        checkPoint = function(p){return p};
    }

    var nf = [];
    var np1 = checkPoint(this.point1.midpoint(this.point2));
    var np2 = checkPoint(this.point1.midpoint(this.point3));
    var np3 = checkPoint(this.point3.midpoint(this.point2));

    nf.push(new Face(this.point1, np1, np2));
    nf.push(new Face(np1, this.point2, np3));
    nf.push(new Face(np1, np2, np3));
    nf.push(new Face(np2, np3, this.point3));

    return nf;

};

