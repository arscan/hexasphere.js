var _faceCount = 0;

var Face = function(point1, point2, point3){
    this.id = _faceCount++;

    this.point1 = point1; // top
    this.point2 = point2; // bot left
    this.point3 = point3; // bot right

    this.points = [
        point1,
        point2,
        point3
        ];
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
        
        if(this.point1.corner){
            console.log("foudn a corner!");
            console.log(this.point1.faces.length);
        }

    }

    nf.push(nf1);
    nf.push(nf2);
    nf.push(nf3);
    nf.push(nf4);

    return nf;

};

Face.prototype.findThirdPoint = function(point1, point2){
    for(var i = 0; i < this.points.length; i++){
        if(this.points[i].toString() !== point1.toString() && this.points[i].toString() !== point2.toString()){
            return this.points[i];
        }
    }


}

