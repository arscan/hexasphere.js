$(window).load(function(){

    var hexasphere = new Hexasphere(30, 25, .95);
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
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x7cfc00}));
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x397d02}));
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x77ee00}));
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x61b329}));
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x83f52c}));
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x83f52c}));
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x4cbb17}));
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x00ee00}));
    meshMaterials.push(new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x00aa11}));

    var lineMaterial = new THREE.LineBasicMaterial( { color: 0x00eeee, opacity: .1, linewidth: 1, transparent: true} );

    for(var i = 0; i< hexasphere.tiles.length; i++){
        var t = hexasphere.tiles[i];
        var latLon = t.getLatLon(hexasphere.radius);

        var geometry = new THREE.Geometry();

        for(var j = 0; j< t.boundary.length; j++){
            var bp = t.boundary[j];
            geometry.vertices.push(new THREE.Vector3(bp.x, bp.y, bp.z));
        }
        geometry.vertices.push(new THREE.Vector3(t.boundary[0].x, t.boundary[0].y, t.boundary[0].z));

        if(isLand(latLon.lat, latLon.lon)){

            geometry.faces.push(new THREE.Face3(0,1,2));
            geometry.faces.push(new THREE.Face3(0,2,3));
            geometry.faces.push(new THREE.Face3(0,3,4));
            geometry.faces.push(new THREE.Face3(0,4,5));

            var mesh = new THREE.Mesh(geometry, meshMaterials[Math.floor(Math.random() * meshMaterials.length)]);
            mesh.doubleSided = true;
            scene.add(mesh);
         } else {
             scene.add(new THREE.Line(geometry, lineMaterial));
         
         }

    }

    var startTime = Date.now();
    var lastTime = Date.now();
    var cameraAngle = 0;

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

    window.addEventListener( 'resize', onWindowResize, false );

    $("#container").append(renderer.domElement);
    requestAnimationFrame(tick);
    window.hexasphere = hexasphere;

});
