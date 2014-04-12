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

Tile.prototype.getLatLon = function(radius){
    var theta = Math.acos(this.centerPoint.y / radius); //lat 
    var phi = Math.atan2(this.centerPoint.x ,this.centerPoint.z); // lon
    return {
        lat: 180 * theta / Math.PI - 90,
        lon: 360 * phi / (2* Math.PI)
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
