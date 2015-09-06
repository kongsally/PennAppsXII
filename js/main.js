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
        

          // Particles
          particles = new THREE.Object3D(),
          totalParticles = 200,
          maxParticleSize = 200,
          particleRotationSpeed = 0,
          particleRotationDeg = 0,
          lastColorRange = [0, 0.3],
          currentColorRange = [0, 0.3];

      init();

      function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(90, window.innerWidth /    window.innerHeight, 0.001, 700);
        camera.position.set(0, 0, -50);
        camera.lookAt(0, 0, 25 );
        scene.add(camera);
        
          
          // Create a sphere to make visualization easier.
        var geometry = new THREE.IcosahedronGeometry( 30, 1);
        var material = new THREE.MeshPhongMaterial({
            color: 0x333333,
            wireframe: false,
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
          
        var pointLight = new THREE.PointLight( 0xDDDDDD, 2.0 ); // soft white light
        pointLight.position.x = 60;
        pointLight.position.y = 100;
        pointLight.position.z = 60;
        scene.add(pointLight);
          
        var ambLight = new THREE.AmbientLight( 0xDDDDDD, 1.0 ); // soft white light

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

        // Lighting
          
        //

//        var floorTexture = THREE.ImageUtils.loadTexture('img/wood.jpg');
//        floorTexture.wrapS = THREE.RepeatWrapping;
//        floorTexture.wrapT = THREE.RepeatWrapping;
//        floorTexture.repeat = new THREE.Vector2(50, 50);
//        floorTexture.anisotropy = renderer.getMaxAnisotropy();
//
//        var floorMaterial = new THREE.MeshPhongMaterial({
//          color: 0xffffff,
//          specular: 0xffffff,
//          shininess: 20,
//          shading: THREE.FlatShading,
//          map: floorTexture
//        });

        var geometry = new THREE.PlaneBufferGeometry(1000, 1000);

//        var floor = new THREE.Mesh(geometry, floorMaterial);
//        floor.rotation.x = -Math.PI / 2;
//        scene.add(floor);

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

//        adjustToWeatherConditions();

        clock = new THREE.Clock();

        animate();
      }

//      function adjustToWeatherConditions() {
//        var cityIDs = '';
//        for (var i = 0; i < cities.length; i++) {
//          cityIDs += cities[i][1];
//          if (i != cities.length - 1) cityIDs += ',';
//        }
//        getURL('http://api.openweathermap.org/data/2.5/group?id=' + cityIDs + '&APPID=b5c0b505a8746a1b2cc6b17cdab34535', function(info) {
//          cityWeather = info.list;
//          
//          lookupTimezones(0, cityWeather.length);
//        });
//      }

//      function lookupTimezones(t, len) {
//        var tz = new TimeZoneDB;
//        
//        tz.getJSON({
//            key: "GPH4A5Q6NGI1",
//            lat: cityWeather[t].coord.lat,
//            lng: cityWeather[t].coord.lon
//        }, function(timeZone){
//            cityTimes.push(new Date(timeZone.timestamp * 1000));
//
//            t++;
//            if (t < len) lookupTimezones(t, len);
//            else applyWeatherConditions();
//        });
//      }

//      function applyWeatherConditions() {
//        displayCurrentCityName(cities[currentCity][0]);
//
//        var info = cityWeather[currentCity];
//
//        particleRotationSpeed = info.wind.speed / 2; // dividing by 2 just to slow things down 
//        particleRotationDeg = info.wind.deg;
//
//        var timeThere = cityTimes[currentCity] ? cityTimes[currentCity].getUTCHours() : 0,
//            isDay = timeThere >= 6 && timeThere <= 18;
//
//        if (isDay) {
//          switch (info.weather[0].main) {
//            case 'Clouds':
//              currentColorRange = [0, 0.01];
//              break;
//            case 'Rain':
//              currentColorRange = [0.7, 0.1];
//              break;
//            case 'Clear':
//            default:
//              currentColorRange = [0.6, 0.7];
//              break;
//          }
//        } else {
//          currentColorRange = [0.69, 0.6];
//        }
//
//        if (currentCity < cities.length-1) currentCity++;
//        else currentCity = 0;
//
//        setTimeout(applyWeatherConditions, 5000);
//      }

//      function displayCurrentCityName(name) {
//        scene.remove(currentCityTextMesh);
//
//        currentCityText = new THREE.TextGeometry(name, {
//          size: 4,
//          height: 1
//        });
//        currentCityTextMesh = new THREE.Mesh(currentCityText, new THREE.MeshBasicMaterial({
//          color: 0xffffff, opacity: 1
//        }));
//
//        currentCityTextMesh.position.y = 10;
//        currentCityTextMesh.position.z = 20;
//        currentCityTextMesh.rotation.x = 0;
//        currentCityTextMesh.rotation.y = -180;
//
//        scene.add(currentCityTextMesh);
//      }

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
          
          temp = Math.random() < 0.5 ? -1 : 1;
          console.log(temp);
          
          console.log(vertices_of_sphere.length);
                vertices_of_sphere[0].x += temp;
                vertices_of_sphere[0].y += temp;
                vertices_of_sphere[0].z += temp;
                vertices_of_sphere[1].x += temp;
                vertices_of_sphere[1].y += temp;
                vertices_of_sphere[1].z += temp;
                vertices_of_sphere[2].x += temp;
                vertices_of_sphere[2].y += temp;
                vertices_of_sphere[2].z += temp;
                vertices_of_sphere[3].x += temp;
                vertices_of_sphere[3].y += temp;
                vertices_of_sphere[3].z += temp;
                vertices_of_sphere[4].x += temp;
                vertices_of_sphere[4].y += temp;
                vertices_of_sphere[4].z += temp;
                vertices_of_sphere[5].x += temp;
                vertices_of_sphere[5].y += temp;
                vertices_of_sphere[5].z += temp;
                vertices_of_sphere[6].x += temp;
                vertices_of_sphere[6].y += temp;
                vertices_of_sphere[6].z += temp;

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