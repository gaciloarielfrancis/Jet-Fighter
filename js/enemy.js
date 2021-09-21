const Enemy = {
	enemy_1 : function() {
		var count = [1, 3, 5].sort(() => Math.random() - 0.5)[0];
		var x = [50, app.screen.width - 50, 1].sort(() => Math.random() - 0.5)[0], y = -100;
		if(x === 1) {
			x = Math.floor(Math.random() * app.screen.width);
		}
		for(var i = 0; i < count; i++) {
			let e = PIXI.Sprite.from("images/enemy_1.png");
			e.x = x;
			e.y = y;
			e.Life = 1;
			e.anchor.set(0.5);
	  		e.scale.set(.3);
	  		e.id = Date.now();
	  		e.enemyType = 1;

	  		app.stage.addChild(e);

	  		app.ticker.add(move);
	  		function move() {
				if(!e.visible || e.y > app.screen.height) {
					app.ticker.remove(move);
					e.x = 2000;
					e.y = 2000;
					app.stage.removeChild(e);
					return false;
				}
				e.y += 0.1 * _vars.ememy1Speed;
			}
			_vars.enemyArr.push(e);
	  		(x < (app.screen.width / 2)) ? x += 100 : x -= 100;
		}
	},

	enemy_2 : function() {
		let e = PIXI.Sprite.from("images/enemy_2.png");
		e.x = Math.floor(Math.random() * app.screen.width);
		e.y = -100;
		e.Life = 1;
		e.anchor.set(0.5);
		e.scale.set(.3);
		e.id = Date.now();
		e.enemyType = 2;
		let reverse = false;

		let firing = setInterval(function() {
			if([1, 2, 3].sort(() => Math.random() - 0.5)[0] === 2) {
				Enemy.fire(e.x, e.y);
			}
		}, 1000);

		app.stage.addChild(e);
		app.ticker.add(move);
		function move() {
			if(!e.visible) {
				app.ticker.remove(move);
				e.x = 2000;
				e.y = 2000;
				app.stage.removeChild(e);
				clearInterval(firing)
				return false;
			}
			if(e.y > (app.screen.height / 3)) {
				if(!reverse) {
					(e.x < 0) ? reverse = true : e.x -= 0.1 * (_vars.ememy1Speed / 2);
				}else{
					(e.x > app.screen.width) ? reverse = false : e.x += 0.1 * (_vars.ememy1Speed / 2);
				}
			}else{
				e.y += 0.1 * (_vars.ememy1Speed / 2);
			}
		}
		_vars.enemyArr.push(e);
	},

	fire : function(x, y) {
		const fireSprite = PIXI.Loader.shared.resources["images/sprites/t1.json"].spritesheet;
		let fire = new PIXI.AnimatedSprite(fireSprite.animations["tile"]);
		fire.animationSpeed = 1;
		fire.anchor.set(0.5);
	  	fire.scale.set(.5);
	  	fire.x = x;
	  	fire.y = y + fire.height;
	  	fire.play();
		app.stage.addChild(fire);

		app.ticker.add(move);
		function move() {
			if(fire.y > app.screen.height) {
				app.ticker.remove(move);
				app.stage.removeChild(fire);
				fire.x = 2000;
				return false;
			}
			fire.y += 0.1 * _vars.fireSpeed;

			if(Misc.isColliding(fire, _vars.player)) {
				app.ticker.remove(move);
				fire.x = 2000;
				app.stage.removeChild(fire);
				Player.explode();
				_vars.isGameOver = true;
				return false;
				
			}
		}
	}
}