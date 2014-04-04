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

