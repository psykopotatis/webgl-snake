var sphere = function(options) {
    var that = {};
    var scene = options.scene;
    var r = options.radius || Math.random * 20 + 5;
    var mesh = options.mesh || false;
    var x = options.x;
    var y = options.y;
    var rotation = options.rotation || 0.005;

    /*
     * Creates random sized, colored sphere
     */
    var createSphere = function() {
        var radius = r;
        var segments = 30;
        var rings = 30;
        var color24 = Math.random()*255 << 16 | Math.random()*255 << 8 | Math.random()*255;

        var sphereMaterial =
                new THREE.MeshLambertMaterial({
                    color: color24,
                    wireframe: mesh
                });

        var sphere = new THREE.Mesh(
                new THREE.SphereGeometry(
                        radius,
                        segments,
                        rings),
                sphereMaterial);

        sphere.position.x = x;
        sphere.position.y = y;
        sphere.radius = radius;

        scene.add(sphere);

        return sphere;
    };

    /*
     * Returns random (x, y) position minus sphere radius
     */
    var getRandomPosition = function(radius) {
        var x = Math.floor(Math.random() * ((SNAKE.DISPLAY_WIDTH-radius)/2)) * (Math.random() > 0.5 ? -1 : 1);
        var y = Math.floor(Math.random() * ((SNAKE.DISPLAY_HEIGHT-radius)/2)) * (Math.random() > 0.5 ? -1 : 1);

        return {x:x, y:y};
    };

    /*
     * Moves sphere to random (x, y) position
     */
    var moveSphere = function() {
        var pos = getRandomPosition(sphere.radius);

        sphere.position.x = pos.x;
        sphere.position.y = pos.y;
    };

    /*
     * Creates a new sphere
     */
    that.refresh = function() {
        sphere = createSphere();
    };

    /*
     * Update
     */
    that.update = function() {
        sphere.rotation.y += rotation;
    };

    that.getPosition = function() { return sphere.position; }
    that.getRadius = function() { return sphere.radius; }
    that.getMesh = function() { return sphere; }

    var sphere = createSphere();

    return that;
};