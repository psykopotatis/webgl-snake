/*
 * GameScreen
 */
var GameScreen = Class.extend({
    /*
     * Init
     */
    init: function(game, scene, camera) {
        this.game = game;
        this.scene = scene;
        this.camera = camera;
        this.level = 1;  // start at level 1
        this.lastLevel = 4;
        this.cameraUpdate = false;
        this.setup();
    },

    /*
     * Setup
     */
    setup: function() {
        this.clearLevel();

        switch (this.level) {
            case 1:
                this.size = {x_min:-100, x_max:100, y_min:-80, y_max:80};
                this.stars = starField({
                    scene: this.scene,
                    stars: 40000,
                    size:3
                });
                this.fruitsToEat = 15;
                this.randomFruitSize = true;
                this.cameraPosition = {x:-120, y:-50, z:250};
                break;
            case 2:
                this.cameraPosition = {x:0, y:0, z:120};
                this.size = {
                    x_min: - this.getXMax() + SNAKE.TILE_SIZE,
                    x_max: this.getXMax() - SNAKE.TILE_SIZE,
                    y_min: - this.getYMax() + SNAKE.TILE_SIZE,
                    y_max: this.getYMax() - SNAKE.TILE_SIZE
                };
                this.stars = starField({
                    scene: this.scene,
                    stars: 50000,
                    size:2
                });
                this.fruitsToEat = 15;
                this.randomFruitSize = false;
                this.cameraUpdate = true;
                break;
            case 3:
                this.size = {x_min:-100, x_max:100, y_min:-40, y_max:40};
                this.stars = starField({
                    scene: this.scene,
                    stars: 30000,
                    size:2
                });
                this.fruitsToEat = 15;
                this.randomFruitSize = true;
                this.cameraPosition = {x:20, y:-120, z:300};
                this.cameraUpdate = true;
                break;
            case 4:
                this.size = {x_min:-100, x_max:100, y_min:-40, y_max:40};
                this.stars = starField({
                    scene: this.scene,
                    stars: 30000,
                    size:2
                });
                this.fruitsToEat = 15;
                this.randomFruitSize = false;
                this.cameraPosition = {x:20, y:50, z:340};
                this.cameraUpdate = true;
                break;
        }

        $('#info .level').html('Level ' + this.level);
        if (this.cameraUpdate) {
            this.updateCamera();
        }

        this.createWalls();
        this.player = player(this.scene, {
            x: this.size.x_min + 32, // Needs to be % 4 == 0
            y: this.size.y_min + 16
        });

        this.addObstacles();

        // Set valid fruit positions
        this.xPositions = [];
        this.yPositions = [];
        for (var x=this.size.x_min+SNAKE.TILE_SIZE; x<this.size.x_max; x=x+SNAKE.TILE_SIZE) {
            this.xPositions.push(x);
        }
        for (var y=this.size.y_min+SNAKE.TILE_SIZE; y<this.size.y_max; y=y+SNAKE.TILE_SIZE) {
            this.yPositions.push(y);
        }

        // Then create the fruit, so it spawns inside level walls
        this.fruit = this.createFruit();
        this.score = 0;
        this.fruitsEaten = 0;

        $('#info').show();
        this.setScore(0);
        this.levelFinished = false;
        this.updateLevelGoal();
    },

    getXMax: function(x) {
        var DISPLAY_HEIGHT = 2 * this.cameraPosition.z * Math.tan(45 / 2 * (Math.PI / 180));
        var DISPLAY_WIDTH = DISPLAY_HEIGHT * (SNAKE.WIDTH / SNAKE.HEIGHT);

        var X_MAX = DISPLAY_WIDTH / 2;
        var Y_MAX = DISPLAY_HEIGHT / 2;

        var x = Math.round(X_MAX);
        while(x--) {
            if (x % 4 == 0) {
                return x;
            }
        }
    },

    getYMax: function(x) {
        var DISPLAY_HEIGHT = 2 * this.cameraPosition.z * Math.tan(45 / 2 * (Math.PI / 180));
        var DISPLAY_WIDTH = DISPLAY_HEIGHT * (SNAKE.WIDTH / SNAKE.HEIGHT);

        var X_MAX = DISPLAY_WIDTH / 2;
        var Y_MAX = DISPLAY_HEIGHT / 2;

        var y = Math.round(Y_MAX);
        while(y--) {
            if (y % 4 == 0) {
                return y;
            }
        }
    },

    /*
     * Add wallbits as level obstacles
     */
    addObstacles: function() {
        this.obstacles = [];
        if (this.level > 1) {
            return;
        }
        // bottom
        for (var x=-52; x<52; x=x+SNAKE.TILE_SIZE) {
            var position = {x:x, y:-40};
            this.obstacles.push(position);
            this.createWall(position);
        }
        // right
        for (var y=-40; y<8; y=y+SNAKE.TILE_SIZE) {
            var position = {x:52, y:y};
            this.obstacles.push(position);
            this.createWall(position);
        }
        // left
        for (var y=-40; y<8; y=y+SNAKE.TILE_SIZE) {
            var position = {x:-52, y:y};
            this.obstacles.push(position);
            this.createWall(position);
        }
        // left eye
        for (var y=0; y<36; y=y+SNAKE.TILE_SIZE) {
            var position = {x:20, y:y};
            this.obstacles.push(position);
            this.createWall(position);
        }
        // right eye
        for (var y=0; y<36; y=y+SNAKE.TILE_SIZE) {
            var position = {x:-20, y:y};
            this.obstacles.push(position);
            this.createWall(position);
        }
    },

    /*
     * Update camera
     */
    updateCamera: function() {
        this.camera.position.x = this.cameraPosition.x;
        this.camera.position.y = this.cameraPosition.y;
        this.camera.position.z = this.cameraPosition.z;
        this.camera.lookAt(this.scene.position);
    },

    /*
     * Removes all THREE objects from scene
     */
    clearLevel: function() {
        var length = this.scene.children.length;
        var removeMe = [];
        for (var i=0; i<length; i++) {
            var child = this.scene.children[i];
            // Don't delete camera, lightning and grid
            if (child.name !== 'save-me') {
                removeMe.push(child);
            }
        }
        for (var i=0; i<removeMe.length; i++) {
            this.scene.remove(removeMe[i]);
        }
    },

    /*
     * Creates a random colored bit of wall at position (x, y)
     */
    createWall: function(position) {
        var color24 = Math.random()*255 << 16 | Math.random()*255 << 8 | Math.random()*255;
        var geometry = new THREE.CubeGeometry(SNAKE.TILE_SIZE, SNAKE.TILE_SIZE, Math.random() * SNAKE.TILE_SIZE + 2);
        var material = new THREE.MeshLambertMaterial({color: color24});
        var wallBit = new THREE.Mesh(geometry, material);
        wallBit.position.x = position.x;
        wallBit.position.y = position.y;
        this.scene.add(wallBit);

        return wallBit;
    },

    /*
     * Creates a random colored square
     */
    createWalls: function() {
        // Top and bottom wall
        for (var x=this.size.x_min; x<this.size.x_max; x=x+SNAKE.TILE_SIZE) {
            this.createWall({x:x, y:this.size.y_max});
            this.createWall({x:x, y:this.size.y_min});
        }

        // Left and right wall
        for (var y=this.size.y_min; y<this.size.y_max; y=y+SNAKE.TILE_SIZE) {
            this.createWall({x:this.size.x_min, y:y});
            this.createWall({x:this.size.x_max, y:y});
        }
    },

    /*
     * Returns random fruit postion, inside walls
     */
    getRandomPosition: function() {
        var x = this.xPositions[Math.round(Math.random() * (this.xPositions.length-1))];
        var y = this.yPositions[Math.round(Math.random() * (this.yPositions.length-1))];

        return {x:x, y:y};
    },

    /*
     * Returns fresh fruit
     */
    createFruit: function() {
        // Check obstacle positions
        var pos;
        while(true) {
            pos = this.getRandomPosition();
            if (this.okPosition(pos)) {
                break;
            }
        }

        return sphere({
            scene: this.scene,
            radius: this.randomFruitSize ? Math.random() * 5 + 5 : 2,
            mesh: Math.random() > 0.5 ? true : false,
            x: pos.x,
            y: pos.y
        });
    },

    okPosition: function(pos) {
        var length = this.obstacles.length;
        var obstacle;
        for (var i=0; i<length; i++) {
            obstacle = this.obstacles[i];
            if (obstacle.x == pos.x && obstacle.y == pos.y) {
                return false;
            }
        }

        return true;
    },

    /*
     * Check collisions with outer walls.
     */
    checkBounds: function() {
        var pos = this.player.getPosition();

        if (pos.x < (this.size.x_min+SNAKE.TILE_SIZE) || pos.x > (this.size.x_max-SNAKE.TILE_SIZE) ||
                pos.y < (this.size.y_min+SNAKE.TILE_SIZE) || pos.y > this.size.y_max-SNAKE.TILE_SIZE) {

            this.player.die();
        }

        // indexOf?
        var length = this.obstacles.length;
        var obstacle;
        for (var i=0; i<length; i++) {
            obstacle = this.obstacles[i];
            if (obstacle.x == pos.x && obstacle.y == pos.y) {
                this.player.die();
            }
        }
    },

    /*
     * Pad zeros. (1123, 9) Returns 000001123
     */
    zeroPad: function(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    },

    /*
     * Sets user score. Both in info and game over box
     */
    setScore: function(score) {
        $('.score').html(this.zeroPad(score, 9));
    },

    /*
     * Updates fruits eaten
     */
    updateLevelGoal: function() {
        var current = this.fruitsToEat - this.fruitsEaten;
        if (current == 0) {
            this.levelFinished = true;
            $('#goal').html('Woo! Done! :D');
            if (this.level == this.lastLevel) {
                $('#done').html('Well done! Game clear! Congratulations! :DD').show('slow');
            } else {
                $('#done').html('Well done! Level cleared! <a href="javascript:;">Play next?</a>').show('slow');
                var that = this;
                $('#done a').click(function() {
                    $('#done').hide('slow');
                    that.level++;
                    that.setup();
                });
            }
        } else {
            $('#goal').html('Eat ' + current + ' fruits!');
        }
    },

    /*
     * Update
     */
    update: function() {
        this.stars.update();

        if (! this.levelFinished) {
            this.fruit.update();
            this.player.update();

            if (this.player.collidesWith(this.fruit)) {
                this.score += Math.round(this.fruit.getRadius() * 1000);
                this.setScore(this.score);
                this.fruitsEaten++;
                this.player.addBody(3);
                this.scene.remove(this.fruit.getMesh());
                this.updateLevelGoal();

                if (! this.levelFinished) {
                    this.fruit = this.createFruit();
                }
            }

            this.checkBounds();
        }
    }
});