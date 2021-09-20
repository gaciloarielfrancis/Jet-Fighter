const Events = {
	init : function() {
		window.addEventListener("keydown", function(e) {
			if(_vars.isGameOver) {
				return false;
			}
			_vars.keys[e.keyCode] = true;
			if(e.keyCode === 32) {
				Player.fire();
			}else if(e.keyCode === 37 && !_vars.isPlayerMoving) {
				Player.move("left");
			}else if(e.keyCode === 39 && !_vars.isPlayerMoving) {
				Player.move("right");
			}
			_vars.isPlayerMoving = true;
		});
		window.addEventListener("keyup", function(e) {
			_vars.keys[e.keyCode] = false;
			_vars.isPlayerMoving = false;
			if(e.keyCode === 37 || e.keyCode === 39) {
				Player.idle();
			}
		});
	},

	destroy : function() {
		window.removeEventListener("keydown", this.downHandler.bind(this), false);
		window.removeEventListener("keyup", this.upHandler.bind(this), false);
	}
}