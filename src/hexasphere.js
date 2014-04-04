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
