import './main.css'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
let camera, scene, renderer, controls;


let mouseX = 0, mouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;


init();
animate();


function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    if (window.innerWidth < 600) {
        camera.fov = 90;
        camera.position.x = 0;
        camera.position.y = 0.1;
        camera.position.z = 11;
    } else {
        camera.position.x = 0;
        camera.position.y = 1;
        camera.position.z = 10;
    }
    scene = new THREE.Scene();


   

   

   


    let displayText = document.createElement('p');
    displayText.id = "my-p";
    document.body.appendChild(displayText);
    let displayText1 = document.createElement('p');
    displayText1.id = "my-p1";
    document.body.appendChild(displayText1);
    let displayText2 = document.createElement('p');
    displayText2.id = "my-p2";
    document.body.appendChild(displayText2);
    let displayText3 = document.createElement('p');
    displayText3.id = "my-p3";
    document.body.appendChild(displayText3);


    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();


    function onMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    function onClick(event) {
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(scene.children);

        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object == sphere1) {
                cameraTween1.start();
            }
            if (intersects[i].object == sphere2) {
                cameraTween2.start();
            }
            if (intersects[i].object == sphere3) {
                cameraTween3.start();
            }
            if (intersects[i].object == sphereAnimation) {
                cameraTweenAnimation.start();
            }
        }
    }


    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onClick, false);

    const svg = new Image();

    


    

    

    let cameraTweenAnimation = new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 1.5, z: 3 }, 500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function () {
            controls.minPolarAngle = Math.PI / 2.8;
            controls.maxAzimuthAngle = Math.PI / 8;
            controls.minAzimuthAngle = -Math.PI / 8;
            controls.target.set(0, 2, 0);
            camera.updateProjectionMatrix();
            displayText3.style.display = "block";
            displayText3.innerHTML = "Sneak peak of Blanks <br> SS/001 <br> Get first access to Blanks:<br> <form id='form'  method='post'>Name: <input type='text' name='from_name' id='from_name' style='border-radius: 10px; padding: 2.5px; width: 50%'><br> Phone: <input type='text' name='phone_id' id='phone_id' style='border-radius: 10px; padding: 2.5px; width: 50%'><br> Email: <input type='text' name='email_id' id='email_id' style='border-radius: 10px; padding: 2.5px; width: 50%'> <br><input id='buttonid' type='submit' value='Send Email'> </form>";
            displayText.style.display = "none";
            let form = document.getElementById("form");
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                sendEmail();
            });
        });


    
    let cameraReturnTween = new TWEEN.Tween(camera.position)
       
        .onUpdate(function () {
            controls.maxAzimuthAngle = Math.PI / 8;
            controls.minAzimuthAngle = -Math.PI / 8;
            controls.target.set(0, 0.35, 0);
            camera.updateProjectionMatrix();
            controls.minPolarAngle = Math.PI / 2.3;
            displayText.style.display = "none";
            displayText1.style.display = "none";
            displayText2.style.display = "none";
            displayText3.style.display = "none";

        });
        cameraReturnTween.start();

    let button = document.getElementById("goBack");
    button.addEventListener("click", function () {
        cameraReturnTween.start();
    });

    document.getElementById("info-icon").addEventListener("click", function () {
        document.getElementById("instructions").classList.toggle("hidden");
    });

    // Add event listener for when the right mouse button is clicked
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        cameraReturnTween.start();
    });

    //Loading Page

    //loadingManager.onLoad = function() {
    //console.log(`Just Finished loading`);
    //};
    //loadingManager.onError = function(url) {
    //console.error(`Problem Loading this shit,just quit: ${url}`);
    //}; 

    const loadingManager = new THREE.LoadingManager();

    const progressBar = document.getElementById('loader');

    loadingManager.onProgress = function (url, loaded, total) {
        progressBar.value = (loaded / total) * 100;
    };

    const progressBarContainer = document.querySelector('.progress-bar-container');

    loadingManager.onLoad = function () {
        progressBarContainer.style.display = 'none';
    };


    //model

    let mixer;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const ktx2Loader = new KTX2Loader()
        .setTranscoderPath('jsm/libs/basis/')
        .detectSupport(renderer);

    const loader = new GLTFLoader().setPath('models/gltf/');
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load('storefront.glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        loadingManager.onLoad();
        mixer = new THREE.AnimationMixer(model);
        const clips = gltf.animations;

        clips.forEach(function (clip) {
            const action = mixer.clipAction(clip);
            // Find the sphere object by name
            if (clip.name === 'sphereAnimation') {
                // Add an event listener to the sphere object
                const sphere = gltf.scene.getObjectByName('sphere');
                sphere.addEventListener('click', function () {
                    action.setLoop(THREE.LoopRepeat);
                    action.play();
                });
            } else {
                action.play();
            }
        });
        scene.add(gltf.scene);
        const object = gltf.scene.getObjectByName('Scene');
        object.matrixAutoUpdate = false;
        document.getElementById("app-cover").style.display = "block";
    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();
    function animate() {
        if (mixer)
            mixer.update(clock.getDelta());
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);



    //Environment, HDRI, Background lighting
    const environment = new RoomEnvironment();
    scene.background = new THREE.Color(0xbbbbbb);


    //Lighting 
    RectAreaLightUniformsLib.init();

    

    const rectLight3 = new THREE.RectAreaLight(0xffffff, 10, 0.13, 4.66);
    rectLight3.position.set(-3.6, 3.34, 3);
    rectLight3.rotation.set(-Math.PI / 2, 0, 0); // Rotate 90 degrees on the x-axis
    scene.add(rectLight3);
    
    const boxLight3 = new THREE.RectAreaLight(0xffffff, 7, 0.52, 0.29);
    boxLight3.position.set(-4.97, 1.4, 3.4);
    boxLight3.rotation.set(-Math.PI / 4, );
    scene.add(boxLight3);
    
    const light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);
    




   
    scene.add(new RectAreaLightHelper(rectLight3));
    
    scene.add(new RectAreaLightHelper(boxLight3));

    //OrbitControls,pov
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxAzimuthAngle = Math.PI / 1.45;
    controls.minAzimuthAngle = -Math.PI / 1.45;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 3;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.maxDistance = 10,
        controls.target.set(0, 0.4, 0);
    controls.update();


    //events
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);

    //animation

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

}
function animate() {

    TWEEN.update()
    requestAnimationFrame(animate);

    controls.update(); // required if damping enabled

    render();

    controls.update();

    camera.position.x += (mouseX - camera.position.x) * 0.00001;
    camera.position.y += (- (mouseY - 1) - camera.position.y) * 0.00001;

    camera.lookAt(scene.position);

}

function render() {
    renderer.gammaFactor = 2.2;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.render(scene, camera);



}
