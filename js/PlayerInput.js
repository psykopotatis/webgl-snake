var playerInput = function() {
    var that = {};

    that.buttons = [false, false, false, false];
    oldButtons = [false, false, false, false];

    // System keys
    var KEY_W = 87;
    var KEY_A = 65;
    var KEY_S = 83;
    var KEY_D = 68;
    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_ESACPE = 27;
    var KEY_ENTER = 13;
    var KEY_SPACE = 32;

    that.BUTTON_LEFT = 0;
    that.BUTTON_RIGHT = 1;
    that.BUTTON_UP = 2;
    that.BUTTON_DOWN = 3;

    // Sets button pressed or not pressed
    var set = function(keynr, pressed) {
        var button = -1;

        if (keynr === KEY_A) { button = that.BUTTON_LEFT; }
        if (keynr === KEY_D) { button = that.BUTTON_RIGHT; }
        if (keynr === KEY_W) { button = that.BUTTON_UP; }
        if (keynr === KEY_S) { button = that.BUTTON_DOWN; }

        if (keynr === KEY_UP) { button = that.BUTTON_UP; }
        if (keynr === KEY_DOWN) { button = that.BUTTON_DOWN; }
        if (keynr === KEY_LEFT) { button = that.BUTTON_LEFT; }
        if (keynr === KEY_RIGHT) { button = that.BUTTON_RIGHT; }

        if(button != -1) {
            that.buttons[button] = pressed;
        }
    }

    document.onkeydown = function(event){
        var keynr = event.which;
        set(keynr, true);
    }

    document.onkeyup = function(event){
        var keynr = event.which;
        set(keynr, false);
    }

    that.update = function() {
        for (var i=0; i<that.buttons.length; i++) {
            // Wut?
            oldButtons[i] = that.buttons[i];
        }
    }

    return that;
}