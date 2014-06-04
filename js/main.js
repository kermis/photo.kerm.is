var scene, camera, renderer, material, texture;
var unicorn, stage, clouds, gordijn, wall;
var photoBoothActive = false;
var currentScene = 'booth';
var colorLoopTick = 0;
init();
animate();

var camPositions = [{
    for: 'unicorn',
    rotation: {
        x: 0,
        y: 4,
        z: 0
    },
    position: {
        x: 0,
        y: 5,
        z: 0
    }
}, {
    for: 'stage',
    rotation: {
        x: 0,
        y: 1.32,
        z: 0
    },
    position: {
        x: 0,
        y: 8.5,
        z: 0
    }
}, {
    for: 'booth',
    rotation: {
        x: 0,
        y: 1.57,
        z: 0
    },
    position: {
        x: 13,
        y: 4.7,
        z: -19.8
    }
}]


    function init() {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        // renderer.setClearColor(0xd8e7ff);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.setAttribute("class", "three-js-renderer");
        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2010);
        camera.position.y = 5;
        camera.rotation.y = 4;


        scene = new THREE.Scene();

        light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1);
        light.position.set(0.75, 1, 0.25);
        scene.add(light);

        var skyGeometry = new THREE.SphereGeometry(2000, 60, 40);
        var skyMaterial = new THREE.MeshBasicMaterial({
            color: 0xd8e7ff,
            doubleSided: true
        })
        var sky = new THREE.Mesh(skyGeometry, skyMaterial);
        sky.scale.set(-1, 1, 1);
        scene.add(sky);

        // scene.fog = new THREE.FogExp2(0xd000f0, 0.025);


        scene.add(camera);



        var canvas = document.getElementById('inputCanvas');
        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        material = new THREE.MeshBasicMaterial({
            map: texture,
            name: 'webcam'
        });
        material.needsUpdate = true;
        // material.doubleSided = true;

        // var material = new THREE.MeshBasicMaterial( {color: 0xFF0000} );

        // var mesh = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), material);
        // mesh.position.set(0,0,0)
        // // mesh.overdraw = true;
        // mesh.doubleSided = true;

        /* Unicorn Scene */

        // for Unicorn -->
        camera.position.y = 5;
        camera.rotation.y = 4;
        var loader = new THREE.ObjectLoader()
        loader.load('js/Unicorn_with_castle.js', function(mesh) {
            // console.log('mesh Unicorn -->', mesh)
            mesh.position.set(30, -4.05, 30);
            mesh.scale.set(3, 3, 3)
            mesh.rotation.y = 1.4
            unicorn = mesh;
            scene.add(unicorn);
        })

        //cube is the globe which is supposed to represent the face
        cube = new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 10), material);
        cube.position.y = 12.3;
        cube.position.z = 31.7;
        cube.position.x = 30;
        cube.rotation.y = 2.4;

        scene.add(cube);

        // scene.fog = new THREE.FogExp2(0xd0e0f0, 0.00025);

        var stageLoader = new THREE.ObjectLoader();
        stageLoader.load('js/stage.js', function(mesh) {

            stage = mesh;

            stage.rotation.y = -0.25;

            //( width, height, depth, widthSegments, heightSegments, depthSegments )
            var scherm = new THREE.Mesh(new THREE.BoxGeometry(0, 10, 15), material);
            var scherm2 = scherm.clone();
            scherm.position.set(0, 9, -9);

            scherm2.scale.set(0.5, 0.5, 0.5);
            scherm2.position.set(0, 14, 10);

            var scherm3 = scherm2.clone();
            scherm3.position.set(0, 14, -30)

            stage.add(scherm);
            stage.add(scherm2);
            stage.add(scherm3);

            stage.position.set(-55, 0, -3.5);
            scene.add(stage);

            for (var i = 0; i < stage.children[0].children.length; i++) {

                scene.updateMatrixWorld();


                var headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 10), material)

                var headPos = new THREE.Vector3();
                headPos.setFromMatrixPosition(stage.children[0].children[i].matrixWorld);

                headSphere.position.set(headPos.x, headPos.y, headPos.z);

                scene.add(headSphere);
            };



            // camera.rotation.y = 7.6;
            // camera.position.y = 8.5;
            // camera.rotation.set(0.2, 7.6, -0.2)

        })

        stageLoader.load('js/photoscape.js', function(mesh) {
            // console.log(mesh);

            clouds = mesh.children[2];

            var scale = 1;
            mesh.scale.set(scale, scale, scale);
            mesh.position.y = -5;
            mesh.rotation.y = 2.64;
            scene.add(mesh);
        })

        stageLoader.load('js/booth.js', function(mesh) {
            // console.log(mesh);

            var scale = 0.03;
            mesh.scale.set(scale, scale, scale);
            // mesh.position.y = -5;
            // mesh.rotation.y = 2.64;
            mesh.position.set(0, 0, -20)
            scene.add(mesh);


            var tv = mesh.children[0].children[0];

            scene.updateMatrixWorld();

            var TVcube = new THREE.Mesh(new THREE.BoxGeometry(3, 2.8, 4), material)
            var TVpos = new THREE.Vector3();

            TVpos.setFromMatrixPosition(tv.matrixWorld)

            TVcube.position.set(TVpos.x + 1, TVpos.y, TVpos.z)

            scene.add(TVcube);


            gordijn = new THREE.Mesh(
                new THREE.BoxGeometry(20, 20, 0.2),
                new THREE.MeshLambertMaterial({
                    color: 0xA1000E,
                    doubleSided: true,
                    transparent: true,
                    opacity: 1
                })
            )

            gordijn.position.z = -17.25;

            scene.add(gordijn);

            photoBoothActive = true;

        })

        stageLoader.load('js/kerm.is.js', function(mesh) {

            var castleText = mesh.clone();

            var scale = 0.25;
            mesh.scale.set(scale, scale, scale);
            for (var i = 0; i < mesh.children.length; i++) {
                mesh.children[i].children[0].material = new THREE.MeshLambertMaterial({
                    color: getRandomColor()
                })

            };
            mesh.rotation.y = 1.57;
            mesh.position.set(1.2, 2.7, -19.8)
            scene.add(mesh);

            // var txt2 = mesh.clone();
            // for (var i = 0; i < txt2.children.length; i++) {
            //     txt2.children[i].children[0].material = new THREE.MeshLambertMaterial({
            //         color: getRandomColor()
            //     })

            // };
            // // txt2.scale.x = 0.35;
            // txt2.rotation.y = 0;
            // txt2.position.set(5,5,-22.35)
            // scene.add(txt2);

            // var txt3 = txt2.clone();
            // txt3.rotation.z = 1;
            // txt3.position.set(5,3,-22.35)
            // scene.add(txt3);

            // var txt4 = txt3.clone();
            // txt4.position.set(5,7,-22.35)
            // scene.add(txt4);

            //muurtje in hokje
            wall = new THREE.Mesh(
                new THREE.BoxGeometry(1, 12, 10),
                new THREE.MeshLambertMaterial({
                    color: '#FFFFFF'
                })
            )
            wall.rotation.y = 1.57;
            wall.position.set(6.2, 5.5, -22.82)
            ls = wall;
            scene.add(wall);

            var scale = 1.5;
            castleText.scale.set(scale, scale, scale);
            castleText.rotation.y = -1.77;
            castleText.position.set(72, 4, 29)
            scene.add(castleText)

            var castleText2 = castleText.clone();
            castleText2.rotation.y = -1.22;
            castleText2.position.set(56, 4, 115);
            scene.add(castleText2)

        })

        camera.rotation.y = 7.85;
        camera.position.set(13, 4.7, -19.8);
        // camera.position.set(-19.2, 7, 13.8);
        //
        // switchScene('booth');


        var winW = window.innerWidth;
        var winH = window.innerHeight;

    }

var ls;

window.addEventListener('resize', function() {
    if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}, true);

function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // camera.rotation.y = 4;

    // cube.rotation.y += 0.01;
    // cube.rotation.x += 0.01;
    // cube.rotation.z += 0.01;
    //
    if (clouds) {
        clouds.rotation.y += 0.001;
    }

    if (gordijn) {
        if (photoBoothActive && gordijn.material.opacity <= 1) {
            gordijn.material.opacity += 0.02;

        } else if (gordijn.material.opacity >= 0) {
            gordijn.material.opacity -= 0.05;
        }

        if (gordijn.material.opacity > 1) {
            gordijn.material.opacity = 1;
        }
    }

    if (wall) {
        colorLoopTick += 0.001;
        wall.material.color.setHSL(colorLoopTick, 1, 0.8);
    }

    texture.needsUpdate = true;

    TWEEN.update();

}

function nextScene() {
    switch (currentScene) {
        case 'booth':
            switchScene('unicorn');
            break;
        case 'unicorn':
            switchScene('stage');
            break;
        case 'stage':
            switchScene('booth');
            break;
    }
}

function previousScene() {
    switch (currentScene) {
        case 'booth':
            switchScene('stage');
            break;
        case 'unicorn':
            switchScene('booth');
            break;
        case 'stage':
            switchScene('unicorn');
            break;
    }
}

function switchScene(what) {
    photoBoothActive = false;
    currentScene = what;
    switch (what) {
        case 'stage':
            // camera.position.set(camPositions[1].position.x, camPositions[1].position.y, camPositions[1].position.z)
            // camera.rotation.set(camPositions[1].rotation.x, camPositions[1].rotation.y, camPositions[1].rotation.z)
            moveCam(
                camPositions[1].position.x, camPositions[1].position.y, camPositions[1].position.z,
                camPositions[1].rotation.x, camPositions[1].rotation.y, camPositions[1].rotation.z,
                1
            )
            break;
        case 'unicorn':
            moveCam(
                camPositions[0].position.x, camPositions[0].position.y, camPositions[0].position.z,
                camPositions[0].rotation.x, camPositions[0].rotation.y, camPositions[0].rotation.z,
                1
            )
            break;
        case 'booth':
            photoBoothActive = true;
            moveCam(
                camPositions[2].position.x, camPositions[2].position.y, camPositions[2].position.z,
                camPositions[2].rotation.x, camPositions[2].rotation.y, camPositions[2].rotation.z,
                1
            )
            break;
    }
}

function moveCam(x, y, z, rotX, rotY, rotZ, speed) {
    new TWEEN.Tween(camera.position).to({
        x: x,
        y: y,
        z: z
    }, speed).easing(TWEEN.Easing.Sinusoidal.InOut).start();

    new TWEEN.Tween(camera.rotation).to({
        x: rotX,
        y: rotY,
        z: rotZ
    }, speed).easing(TWEEN.Easing.Sinusoidal.InOut).start();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function takeAPicture() {
    window.open(renderer.domElement.toDataURL('image/png'), 'screenshot_' + Date.now());
}

document.getElementsByClassName('arrow-l')[0].addEventListener('click', function() {
    previousScene();
}, false);

document.getElementsByClassName('picture-button')[0].addEventListener('click', function() {
    takeAPicture();
}, false);

document.getElementsByClassName('arrow-r')[0].addEventListener('click', function() {
    nextScene();
}, false);

var fxBtns = document.getElementsByClassName('btn-effect')
for (var i = 0; i < fxBtns.length; i++) {
    fxBtns[i].addEventListener('click', function() {
        var effect = this.innerHTML.toLowerCase();
        switchEffect(effect);
    }, false);
};
