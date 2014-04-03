$(function(){
    

        var renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( 600, 500);

        var points = getPoints();
        console.log(points);
        var cameraDistance = 60;

        var geometry = new THREE.Geometry();
        for(var i = 0; i< points.length; i++){
            var vertex = new THREE.Vector3(points[i][0] * 10, points[i][1] * 10, points[i][2] * 10);
            geometry.vertices.push(vertex);
        }

        var material = new THREE.ParticleSystemMaterial({size: 2});

        var particles = new THREE.ParticleSystem(geometry, material);



        $("#container").append(renderer.domElement);

        var camera = new THREE.PerspectiveCamera( 50, 600 / 500, 1, 200);
        camera.position.z = -cameraDistance;
        var scene = new THREE.Scene();
        scene.add(particles); 




        var startTime = Date.now();
        var lastTime = Date.now();
        var cameraAngle = 0;

        var tick = function(){


            var dt = Date.now() - lastTime;

            var rotateCameraBy = (2 * Math.PI)/(10000/dt);
            cameraAngle += rotateCameraBy;

            lastTime = Date.now();

            camera.position.x = cameraDistance * Math.cos(cameraAngle);
            camera.position.y = Math.sin(cameraAngle)* 10;
            camera.position.z = cameraDistance * Math.sin(cameraAngle);
            camera.lookAt( scene.position );

            renderer.render( scene, camera );

            requestAnimationFrame(tick);


        }

        requestAnimationFrame(tick);



});
