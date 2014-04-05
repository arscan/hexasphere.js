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
            var nf = this.faces[i].subdivide(numDivisions == 0, function(point){
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


    this.tiles = [];
    var finishedPoints ={};
    var edgePoints ={};

    for(var c = 0; c< corners.length; c++){
        this.tiles.push(new Tile(corners[c]));
        finishedPoints[corners[c]] = true;
    }

    var tileNum = 0;


    while(tileNum < this.tiles.length){
        for(var f = 0; f< this.tiles[tileNum].faces.length; f++){
            var face = this.tiles[tileNum].faces[f];

            var firstPoint = null;
                var count = 0;
            for(var p = 0; p < face.points.length; p++){
                if(face.points[p].toString() != this.tiles[tileNum].centerPoint.toString()){
                    count++;
                    console.log(count);
                    if(firstPoint == null){
                        firstPoint = face.points[p];
                    } else {
                        var newFace = firstPoint.findCommonFace(face.points[p], face);
                        var newCenter = newFace.findThirdPoint(face.points[p], firstPoint);
                        var allok = true; // I shouldn't have to do this...
                        if(!finishedPoints[newCenter.toString()] && !edgePoints[newCenter.toString()]){
                            for(var x = 0; x < newCenter.faces.length; x++){
                                for(var xy = 0; xy < newCenter.faces[x].points.length; xy++){
                                    if(finishedPoints[newCenter.faces[x].points[xy]]){
                                        allok = false;
                                    }

                                }

                            }
                            if(allok){
                                finishedPoints[newCenter.toString()] = true;
                                this.tiles.push(new Tile(newCenter));
                            }
                        }
                        
                    }
                    edgePoints[firstPoint.toString()] = true;
                    edgePoints[face.points[p].toString()] = true;
                }
            }
            
        }

        tileNum++;

    }

    for(var p in this.points){
        var np = this.points[p].project(tao * 10);
        newPoints[np] = np;
    }

    this.points = newPoints;

    
};
