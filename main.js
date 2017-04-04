$(window).load(function(){

    var width = $(window).innerWidth();
    var height = $(window).innerHeight()-10;

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( width, height);

    var cameraDistance = 65;
    var camera = new THREE.PerspectiveCamera( cameraDistance, width / height, 1, 200);
    camera.position.z = -cameraDistance;

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, cameraDistance*.4, cameraDistance * 1.2);

    var img = document.getElementById("projection");
    var projectionCanvas = document.createElement('canvas');
    var projectionContext = projectionCanvas.getContext('2d');

    projectionCanvas.width = img.width;
    projectionCanvas.height = img.height;
    projectionContext.drawImage(img, 0, 0, img.width, img.height);
    

    var pixelData = null;

    var maxLat = -100;
    var maxLon = 0;
    var minLat = 0;
    var minLon = 0;

    var isLand = function(lat, lon){

        var x = parseInt(img.width * (lon + 180) / 360);
        var y = parseInt(img.height * (lat+90) / 180);

        if(pixelData == null){
            pixelData = projectionContext.getImageData(0,0,img.width, img.height);
        }
        return pixelData.data[(y * pixelData.width + x) * 4] === 0;
    };


    var meshMaterials = [];
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x7cfc00}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x397d02}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x77ee00}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x61b329}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x83f52c}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x83f52c}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x4cbb17}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x00ee00}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x00aa11}));

    var oceanMaterial = []
    oceanMaterial.push(new THREE.MeshBasicMaterial({color: 0x0f2342}));
    oceanMaterial.push(new THREE.MeshBasicMaterial({color: 0x0f1e38}));

    var createScene = function(radius, divisions, tileSize){
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }
        var hexasphere = new Hexasphere(radius, divisions, tileSize);
        for(var i = 0; i< hexasphere.tiles.length; i++){
            var t = hexasphere.tiles[i];
            var latLon = t.getLatLon(hexasphere.radius);

            var geometry = new THREE.Geometry();

            for(var j = 0; j< t.boundary.length; j++){
                var bp = t.boundary[j];
                geometry.vertices.push(new THREE.Vector3(bp.x, bp.y, bp.z));
            }
            geometry.vertices.push(new THREE.Vector3(t.boundary[0].x, t.boundary[0].y, t.boundary[0].z));

            geometry.faces.push(new THREE.Face3(0,1,2));
            geometry.faces.push(new THREE.Face3(0,2,3));
            geometry.faces.push(new THREE.Face3(0,3,4));
            geometry.faces.push(new THREE.Face3(0,4,5));

            if(isLand(latLon.lat, latLon.lon)){
                material = meshMaterials[Math.floor(Math.random() * meshMaterials.length)]
            } else {
                material = oceanMaterial[Math.floor(Math.random() * oceanMaterial.length)]
            }


            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

        }

        window.hexasphere = hexasphere;
    };

    createScene(30, 25, .95);


    var startTime = Date.now();
    var lastTime = Date.now();
    var cameraAngle = -Math.PI/1.5;

    var tick = function(){


        var dt = Date.now() - lastTime;

        var rotateCameraBy = (2 * Math.PI)/(200000/dt);
        cameraAngle += rotateCameraBy;

        lastTime = Date.now();

        camera.position.x = cameraDistance * Math.cos(cameraAngle);
        camera.position.y = Math.sin(cameraAngle)* 10;
        camera.position.z = cameraDistance * Math.sin(cameraAngle);
        camera.lookAt( scene.position );

        renderer.render( scene, camera );

        requestAnimationFrame(tick);

    }

    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function clamp(val, min, max){
        return Math.min(Math.max(min, val), max);
    }

    $('.generateButton').click(function(){

        var radius = $('#radius').val();
        var subdivisions = $('#subdivisions').val();
        var tileSize = $('#tileSize').val();

        if ($.isNumeric(radius) && $.isNumeric(subdivisions) && $.isNumeric(tileSize)){
            $('#generateError').hide();
            radius = parseInt(clamp(radius, .1, 10000));
            subdivisions = parseInt(clamp(subdivisions, 1, 100));
            tileSize = parseFloat(clamp(tileSize, 0.0001, 1))

            $('#radius').val(radius);
            $('#subdivisions').val(subdivisions);
            $('#tileSize').val(tileSize);

            createScene(radius, subdivisions, tileSize);

            if($(this).prop('id') === 'generate'){
                var blob = new Blob([hexasphere.toObj()], {type: "text/plain;charset=utf-8"});
                saveAs(blob, 'hexasphere.obj')
            }
        } else {
            $('#generateError').show();
        }


    });

    window.addEventListener( 'resize', onWindowResize, false );

    $("#container").append(renderer.domElement);
    requestAnimationFrame(tick);
    window.scene = scene;
    window.createScene = createScene;

});
