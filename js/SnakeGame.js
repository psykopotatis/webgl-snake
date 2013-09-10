var startGame = function() {
    var that = {};

    // Add Stats.js - https://github.com/mrdoob/stats.js
    var stats = new Stats();
    stats.domElement.style.position	= 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '5px';
    document.body.appendChild(stats.domElement);

    var WIDTH = window.innerWidth - 5;
    var HEIGHT = window.innerHeight - 5;

    // Create a WebGL renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true	// to get smoother output?
    });
    renderer.setSize(WIDTH, HEIGHT);
    $('#container').append(renderer.domElement);

    // Create foggy scene
    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0011);

    // Set camera attributes
    var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;
    var CAMERA_POSITION = 250;
    var TILE_SIZE = 4;
    // Camera yo
    var camera =
            new THREE.PerspectiveCamera(
                    VIEW_ANGLE,
                    ASPECT,
                    NEAR,
                    FAR);
    camera.name = "save-me";
    // the camera starts at 0,0,0 so pull it back
    camera.position.x = -74;
    camera.position.y = 22;
    camera.position.z = CAMERA_POSITION;
    camera.lookAt(scene.position);  // Look at scene bit from side
    // Add the camera to the scene
    scene.add(camera);

    // Height is 2 x since (0, 0) is in the middle of the screen
    var DISPLAY_HEIGHT = 2 * CAMERA_POSITION * Math.tan(VIEW_ANGLE / 2 * (Math.PI / 180));
    var DISPLAY_WIDTH = DISPLAY_HEIGHT * (WIDTH / HEIGHT);

    var X_MAX = DISPLAY_WIDTH / 2;
    var X_MIN = 0 - (DISPLAY_WIDTH / 2);
    var Y_MAX = DISPLAY_HEIGHT / 2;
    var Y_MIN = 0 - (DISPLAY_HEIGHT / 2);

    // Global vars
    SNAKE = {};
    SNAKE.WIDTH = WIDTH;
    SNAKE.HEIGHT = HEIGHT;
    SNAKE.DISPLAY_WIDTH = DISPLAY_WIDTH;
    SNAKE.DISPLAY_HEIGHT = DISPLAY_HEIGHT;
    SNAKE.X_MAX = X_MAX;
    SNAKE.X_MIN = X_MIN;
    SNAKE.Y_MAX = Y_MAX;
    SNAKE.Y_MIN = Y_MIN;
    SNAKE.TILE_SIZE = 4;
    SNAKE.CAMERA_DEBUG = true;
    SNAKE.IMAGES = '/images/';

    // Create point light
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.name = "save-me";
    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    // add to the scene
    scene.add(pointLight);

    // Moar lights!
    var light = new THREE.DirectionalLight(Math.random() * 0xffffff);
    light.name = "save-me";
    light.position.set(Math.random(), Math.random(), Math.random()).normalize();
    scene.add(light);
    var light = new THREE.DirectionalLight(Math.random() * 0xffffff);
    light.name = "save-me";
    light.position.set(Math.random(), Math.random(), Math.random()).normalize();
    scene.add(light);

    // Draw a partial white grid
    var gridMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.2
    });
    // Horizontal lines
    var x_geometry = new THREE.Geometry();
    x_geometry.vertices.push(new THREE.Vector3(X_MIN, 0, 0));
    x_geometry.vertices.push(new THREE.Vector3(X_MAX, 0, 0));

    var grid = new THREE.Object3D();
    grid.name = "save-me";
    for (var y=2; y<Y_MAX; y=y+TILE_SIZE) {
        var line = new THREE.Line(x_geometry, gridMaterial);
        line.position.y = y;
        grid.add(line);
    }
    // Vertical lines
    var y_geometry = new THREE.Geometry();
    y_geometry.vertices.push(new THREE.Vector3(0, Y_MAX, 0));
    y_geometry.vertices.push(new THREE.Vector3(0, Y_MIN, 0));
    for (var x=2; x<X_MAX; x=x+TILE_SIZE) {
        var line = new THREE.Line(y_geometry, gridMaterial);
        line.position.x = x;
        grid.add(line);
    }

    scene.add(grid);

    $('#intro').show();

    // Camera movement <-------------------------------------------------------
    if (SNAKE.CAMERA_DEBUG) {
        var mouseX;
        var mouseY;
        var mouseWheel = 0;
        var updateCameraPosition = false;
        var updateCameraZoom = false;

        $('canvas').mousemove(function() {
            mouseX = event.clientX - (WIDTH/2);
            mouseY = event.clientY - (HEIGHT/2);
        });

        $('canvas').mousedown(function() {
            document.body.style.cursor = "move";
            updateCameraPosition = true;
            return false;  // Disable text selection on the canvas
        });

        $('canvas').mouseup(function() {
            document.body.style.cursor = "default";
            updateCameraPosition = false;
        });

        $('canvas').mousewheel(function(objEvent, intDelta){
            updateCameraZoom = true;
            mouseWheel += intDelta;
        });
    }

    that.setScreen = function(newScreen) {
        screen = newScreen;
    };

    var updateCamera = function() {
        $('#debug').html('Camera: (' + camera.position.x.toFixed(2) + ', ' + camera.position.y.toFixed(2) + ', ' + camera.position.z.toFixed(2) + ')');
    };

    $('#gameover a').click(function() {
        $('#gameover').hide('slow');
        that.setScreen(new GameScreen(that, scene, camera));
    });

    // Updates at 60 FPS
    var update = function() {
        requestAnimationFrame(update);

        screen.update();

        if (SNAKE.CAMERA_DEBUG) {
            if (updateCameraPosition) {
                camera.position.x += (mouseX - camera.position.x) * 0.01;
                camera.position.y += (- mouseY - camera.position.y) * 0.01;
                camera.lookAt(scene.position);
                updateCamera();
            }

            // Zoom camera
            if (updateCameraZoom) {
                camera.position.z = CAMERA_POSITION + mouseWheel;
                updateCamera();
            }
        }

        renderer.render(scene, camera);
        stats.update();
    };

    var screen = new IntroScreen(that, scene, camera);
    updateCamera();
    requestAnimationFrame(update);

    return that;
};

$(document).ready(function() {
    // Check WebGL
    if (! Detector.webgl){
        Detector.addGetWebGLMessage();
        return;
    }
    
    startGame();
});
