var scene,
  camera, 
  renderer,
  element,
  container,
  effect,
  controls,
  clock,
sphere,
vertices_of_sphere,
pointLight,
ambLight,


  // Particles
  particles = new THREE.Object3D(),
  totalParticles = 200,
  maxParticleSize = 200,
  particleRotationSpeed = 0,
  particleRotationDeg = 0,
  lastColorRange = [0, 0.3],
  currentColorRange = [0, 0.3];

init();

var myFirebaseRef = new Firebase("https://flickering-inferno-5056.firebaseio.com/");
var waves = [];
var lastWave;
var deg4 = 0.01;
var deg7 = 255;

myFirebaseRef.on('child_added', function(snapshot) {
  var rawWaves = snapshot.val();
  console.log("Added");
 
  updateWaves(rawWaves);
});

function updateWaves(rawWaves) {
  for (var at in rawWaves) {
    for (var i = 0; i < rawWaves[at].length; i++) {
      waves.push(rawWaves[at][i]);
    }
  }
  console.log("total waves " + waves.length);
  var cnt = 0;
  while(waves.length > 0 || cnt < 100) {
    tempWave = waves.pop();
    cnt++;
     for (var attribute in tempWave) {
        var deg2 = tempWave[attribute].var2 / 1000;
        deg4 = tempWave[attribute].var4 / 1000;
        deg7 = tempWave[attribute].var7 / 200;
        lastWave = deg2;
        // lastWave = new THREE.Vector3(deg4, deg4, deg4);
        scaleVals();
      }
  }
};

function scaleVals() {
    // vertices_of_sphere[0].add(lastWave);
    // vertices_of_sphere[1].add(lastWave);
    // vertices_of_sphere[2].add(lastWave);
    // vertices_of_sphere[3].add(lastWave);
    // vertices_of_sphere[4].add(lastWave);
    // vertices_of_sphere[5].add(lastWave);
    // vertices_of_sphere[6].add(lastWave);
    // vertices_of_sphere[7].add(lastWave);

    pointLight.color.r = lastWave; 
    ambLight.color.b = deg7;
    renderer.render(scene, camera);
    effect.render(scene, camera);
  }

function init() {
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(90, 
  window.innerWidth /    window.innerHeight, 0.001, 700);
camera.position.set(0, 0, -50);
camera.lookAt(0, 0, 25 );
scene.add(camera);

          
          // Create a sphere to make visualization easier.
        var geometry = new THREE.IcosahedronGeometry( 15, 1);
        var material = new THREE.MeshPhongMaterial({
            color: 0x333333,
            wireframe: true,
            transparent: false,
            morphTargetInfluences: true
        });
        
        sphere = new THREE.Mesh( geometry, material );
        vertices_of_sphere = []
//        var vert_temp_array = [];
        var constant = Math.round(sphere.geometry.vertices.length/8);
//        console.log(constant);
        for (var i = 0; i<=sphere.geometry.vertices.length; i+=constant) {
            vertices_of_sphere.push(sphere.geometry.vertices[i])
//            console.log(i);
        }
        
        console.log(vertices_of_sphere);
        
        sphere.position.set(0, 0, 0);
          
        scene.add( sphere );
        sphere.castShadow = true;
        sphere.receiveShadow = true;
          
        pointLight = new THREE.PointLight( 0xDDDDDD, 2.0 ); // soft white light
        pointLight.position.x = 60;
        pointLight.position.y = 0;
        pointLight.position.z = -60;
        scene.add(pointLight);
          
        ambLight = new THREE.AmbientLight( 0xDDDDDD, 1.0 ); // soft white light

        scene.add(ambLight);

        
        renderer = new THREE.WebGLRenderer();
        element = renderer.domElement;
        container = document.getElementById('webglviewer');
        container.appendChild(element);

        effect = new THREE.StereoEffect(renderer);

        // Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
        controls = new THREE.OrbitControls(camera, element);
        controls.target.set(
          camera.position.x + 0.15,
          camera.position.y,
          camera.position.z
        );
        controls.noPan = true;
        controls.noZoom = true;

        // Our preferred controls via DeviceOrientation
        function setOrientationControls(e) {
          if (!e.alpha) {
            return;
          }

          controls = new THREE.DeviceOrientationControls(camera, true);
          controls.connect();
          controls.update();
            
          element.addEventListener('click', fullscreen, false);

          window.removeEventListener('deviceorientation', setOrientationControls, true);
        }
        window.addEventListener('deviceorientation', setOrientationControls, true);

       
        var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
        var particleTexture = THREE.ImageUtils.loadTexture('img/particle.png'),
            spriteMaterial = new THREE.SpriteMaterial({
            map: particleTexture,
            color: 0xffffff,
          });

        for (var i = 0; i < totalParticles; i++) {
          var sprite = new THREE.Sprite(spriteMaterial);

          sprite.scale.set(2, 2, 1.0);
          sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.75);
          sprite.position.setLength(maxParticleSize * Math.random());

          sprite.material.blending = THREE.AdditiveBlending;
          
          particles.add(sprite);
        }
        particles.position.y = 70;
        scene.add(particles);
        clock = new THREE.Clock();

        animate();
      }

function animate() {
var elapsedSeconds = clock.getElapsedTime(),
    particleRotationDirection = particleRotationDeg <= 180 ? -1 : 1;

    particles.rotation.y = elapsedSeconds * particleRotationSpeed * particleRotationDirection;

    // We check if the color range has changed, if so, we'll change the colours
    if (lastColorRange[0] != currentColorRange[0] && lastColorRange[1] != currentColorRange[1]) {

      for (var i = 0; i < totalParticles; i++) {
        particles.children[i].material.color.setHSL(currentColorRange[0], currentColorRange[1], (Math.random() * (0.7 - 0.2) + 0.2));
      }

      lastColorRange = currentColorRange;
    }
  
  temp = Math.random()  - 0.5;
 var unit_0 = vertices_of_sphere[0].clone().normalize();
  var unit_1 = vertices_of_sphere[1].clone().normalize();
  var unit_2 = vertices_of_sphere[2].clone().normalize();
  var unit_3 = vertices_of_sphere[3].clone().normalize();
  var unit_4 = vertices_of_sphere[4].clone().normalize();
  var unit_5 = vertices_of_sphere[5].clone().normalize();
  var unit_6 = vertices_of_sphere[6].clone().normalize();
  var unit_7 = vertices_of_sphere[7].clone().normalize();

  vertices_of_sphere[0].add(unit_0.multiplyScalar(temp));
  vertices_of_sphere[1].add(unit_1.multiplyScalar(temp));
  vertices_of_sphere[2].add(unit_2.multiplyScalar(temp));
  vertices_of_sphere[3].add(unit_3.multiplyScalar(temp));
  vertices_of_sphere[4].add(unit_4.multiplyScalar(temp));
  vertices_of_sphere[5].add(unit_5.multiplyScalar(temp));
  vertices_of_sphere[6].add(unit_6.multiplyScalar(temp));
  vertices_of_sphere[6].add(unit_7.multiplyScalar(temp));


  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}


function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  resize();
  camera.updateProjectionMatrix();
  controls.update(dt);
  sphere.geometry.verticesNeedUpdate = true;
}

var angle = 1;
var newVal;
var newValx;

function render(dt) {
    
    // console.log(deg4);
    sphere.rotateY(0.01);
    angle++;
    if (angle > 360){ angle = 1;}
    newVal = (Math.cos(angle%30 * Math.PI/180));
    newValx = (Math.sin(angle * Math.PI/180));
    sphere.position.set(newVal, newValx, 0);
    effect.render(scene, camera);
    
}

      function fullscreen() {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      }

      function getURL(url, callback) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4) {
             if (xmlhttp.status == 200){
                 callback(JSON.parse(xmlhttp.responseText));
             }
             else {
                 console.log('We had an error, status code: ', xmlhttp.status);
             }
          }
        }

        xmlhttp.open('GET', url, true);
        xmlhttp.send();
      }