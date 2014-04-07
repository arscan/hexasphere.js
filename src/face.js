var _faceCount = 0;

var Face = function(point1, point2, point3){
    this.id = _faceCount++;

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
    var np1 = checkPoint(this.points[0].midpoint(this.points[1]));
    var np2 = checkPoint(this.points[0].midpoint(this.points[2]));
    var np3 = checkPoint(this.points[2].midpoint(this.points[1]));
    
    var nf1 = new Face(this.points[0], np1, np2);
    var nf2 = new Face(np1, this.points[1], np3);
    var nf3 = new Face(np1, np2, np3);
    var nf4 = new Face(np2, np3, this.points[2]);

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
        this.points[0].registerFace(nf1);
        this.points[1].registerFace(nf2);
        this.points[2].registerFace(nf4);
        
        if(this.points[0].corner){
            console.log("foudn a corner!");
        }

    }

    nf.push(nf1);
    nf.push(nf2);
    nf.push(nf3);
    nf.push(nf4);

    return nf;

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

