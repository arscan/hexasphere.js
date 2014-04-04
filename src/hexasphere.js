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
