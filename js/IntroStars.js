/*
 * Creates random placed, rotating color-changing particles.
 */
var introStars = function(options) {
    var that = {};
    var scene = options.scene;
    var stars = options.stars;
    var size = options.size;

    // Create stars
    var geometry = new THREE.Geometry();

    for (i=0; i<stars; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 1000 - 500;
        vertex.y = Math.random() * 1000 - 500;
        vertex.z = Math.random() * 1000 - 500;
        geometry.vertices.push(vertex);
    }

    var material = new THREE.ParticleBasicMaterial({
        color: '0xffffff',
        map: THREE.ImageUtils.loadTexture(
                SNAKE.IMAGES + '/bubble.png'
                ),
        depthTest:false,
        blending: THREE.AdditiveBlending,  // Transparent
        transparent: 1,
        opacity: 1,
        size:size
    });
    material.color.setHSV(Math.random(), 1, 1);

    var particles = new THREE.ParticleSystem(geometry, material);
    particles.rotation.x = Math.random() * 15;
    particles.rotation.y = Math.random() * 15;
    particles.rotation.z = Math.random() * 15;

    scene.add(particles);

    // Create beams
    var BEAMS = 10;
    var ROTATION = 0.003;
    // PlaneGeometry(width, height, segments width, sements height)
    var beamGeometry = new THREE.PlaneGeometry(5000, 5, 1, 1);
    var beamGroup = new THREE.Object3D();

    for (var i=0; i<BEAMS; i++) {
        var beamMaterial = new THREE.MeshBasicMaterial({
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        beamMaterial.color = new THREE.Color();
        beamMaterial.color.setHSV(Math.random(), 1.0, 1.0);
        // Make beam with above created material
        var beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.doubleSided = true;
        beam.rotation.x = Math.random() * Math.PI;
        beam.rotation.y = Math.random() * Math.PI;
        beam.rotation.z = Math.random() * Math.PI;
        beamGroup.add(beam);
    }

    scene.add(beamGroup);

    /*
     * Update
     */
    that.update = function() {
        var time = Date.now() * 0.00001;
        particles.rotation.y = Date.now() * 0.00005;
        material.color.setHSV(time % 1, 1, 1);

        beamGroup.rotation.x += ROTATION;
        beamGroup.rotation.y += ROTATION;

    };

    return that;
};