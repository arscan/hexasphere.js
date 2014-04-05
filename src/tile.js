var Tile = function(centerPoint){
    // make the tiles at the end.
    // we render the triangles by the center point out to a percentage of the permiters

    this.centerPoint = centerPoint;
    this.faces = centerPoint.faces;

};

Tile.prototype.toString = function(){
    return centerPoint.toString();

};

/*
Tile.prototype.faces = function(){
    console.log("---");
    console.log(this.centerpoint.faces.length);
    console.log("---");

    return this.centerPoint.faces;


};
*/
