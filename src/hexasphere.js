var getPoints = function(){

    var tao = 1.61803399;
    var points = [
        [1, tao, 0],
        [-1, tao, 0],
        [1,-tao,0],
        [-1,-tao,0],
        [0,1,tao],
        [0,-1,tao],
        [0,1,-tao],
        [0,-1,-tao],
        [tao,0,1],
        [-tao,0,1],
        [tao,0,-1],
        [-tao,0,-1]];

    return points;
};
