var Hexasphere = function(radius, numDivisions, hexSize){

    this.radius = radius;
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

    var points = {};

    for(var i = 0; i< corners.length; i++){
        points[corners[i]] = corners[i];
    }

    var faces = [
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

    while(numDivisions > 0){
        numDivisions--;
        var facesNew = [];
        for(var i = 0; i< faces.length; i++){
            var nf = faces[i].subdivide(numDivisions == 0, function(point){
                if(points[point]){
                    return points[point];
                } else {
                    points[point] = point;
                    return point;
                }
            });
            for(var j = 0; j < nf.length; j++){
                facesNew.push(nf[j]);

            }
        }
        faces = facesNew;
    }

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
