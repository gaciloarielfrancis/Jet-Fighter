const Player = {

	render : function() {
		_vars.playerSprite = PIXI.Loader.shared.resources["images/sprites/p.json"].spritesheet;
	  	_vars.player = new PIXI.AnimatedSprite(_vars.playerSprite.animations["idle"]);
	  	_vars.player.animationSpeed = .1;
	  	_vars.player.anchor.set(0.5);
	  	_vars.player.scale.set(.5);
	  	_vars.player.x = app.screen.width / 2;
	    _vars.player.y = app.screen.height - (_vars.player.height / 1.5);
	  	_vars.player.play();

	  	this.onUpdate();

		app.stage.addChild(_vars.player);
	},

	idle : function() {
		_vars.player.textures = _vars.playerSprite.animations["idle"];
		_vars.player.loop = true;
		_vars.player.play();
	},

	move : function(direction) {
		if(_vars.isGameOver) {
			return false;
		}
		_vars.player.textures = _vars.playerSprite.animations[direction];
		_vars.player.loop = false;
		_vars.player.play();
	},

	fire : function(key) {
		if(_vars.isGameOver) {
			return false;
		}
		if(_vars.fireCount >= _vars.fireMaxCount) {
			return false;
		}

		const fireSprite = PIXI.Loader.shared.resources["images/sprites/f.json"].spritesheet;
		let fire = new PIXI.AnimatedSprite(fireSprite.animations["fire"]);
		fire.animationSpeed = .1;
		fire.anchor.set(0.5);
	  	fire.scale.set(.5);
	  	fire.x = _vars.player.x;
	  	fire.id = Date.now();
	  	fire.isCollide = false;
	  	fire.y = _vars.player.y - fire.height;
	  	fire.zIndex = 1;
	  	fire.play();
		app.stage.addChild(fire);

		app.ticker.add(move);
		function move() {
			if(fire.y < 0) {
				app.ticker.remove(move);
				_vars.fireCount--;
				app.stage.removeChild(fire);
				return false;
			}
			fire.y -= 0.1 * _vars.fireSpeed;

			for(var i = _vars.enemyArr.length - 1; i > -1 ; i--) {
				if(Misc.isColliding(fire, _vars.enemyArr[i])) {
					if(_vars.enemyArr[i].visible === false) {
						return false;
					}
					_vars.enemyArr[i].Life -= _vars.fireDamage;
					if(_vars.enemyArr[i].Life <= 0) {
						app.ticker.remove(move);
						_vars.enemyArr[i].visible = false;
						app.stage.removeChild(_vars.enemyArr[i]);
						Misc.explosion(_vars.enemyArr[i].x, _vars.enemyArr[i].y);
						_vars.enemyArr[i].x = 2000;
						_vars.enemyArr[i].y = 2000;
						app.stage.removeChild(fire);
						_vars.fireCount--;
						Score.add();
						return false;
					}else{
						app.ticker.remove(move);
						_vars.fireCount--;
						app.stage.removeChild(fire);
						return false;
					}
					
				}
			}
		}
		_vars.fireCount++;
	}, 

	onUpdate : function() {
		app.ticker.add(explode);
		function explode() {
			for(var i = _vars.enemyArr.length - 1; i > -1; i--) {
				if(Misc.isColliding(_vars.player, _vars.enemyArr[i])) {
					app.ticker.remove(explode);
					app.stage.removeChild(_vars.enemyArr[i]);
					Player.explode();
					_vars.isGameOver = true;
					return false;
				}
			}
			
		}
	},

	explode : function() {
		Misc.explosion(_vars.player.x, _vars.player.y);
		app.stage.removeChild(_vars.player);
	}

}