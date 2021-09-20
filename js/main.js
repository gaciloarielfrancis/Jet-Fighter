// alert("hello")
// let app = new PIXI.Application({ width: 414, height: 736 });
const app = new PIXI.Application();
document.body.appendChild(app.view);

app.stage.interactive = true;

PIXI.Loader.shared.add(["images/sprites/p.json", "images/sprites/f.json", "images/sprites/e1.json", "images/sprites/e2.json", "images/sprites/t1.json", "images/sprites/t2.json", "videos/space.mp4", "images/enemy_1.png", "images/enemy_2.png", "images/boss.png"]).load(onLoad);

const domVideo = document.getElementById("video-bg");
const videTexture = PIXI.Texture.from(domVideo);
const bgVideo = new PIXI.Sprite(videTexture);
bgVideo.width = app.screen.width;
bgVideo.height = app.screen.height;
bgVideo.alpha = .4;
app.stage.addChild(bgVideo);

function onLoad() {
	Game.load();
}

let Global = (function(){
    var instance;
    function createInstance() {
        
        return {
        	respawn : undefined,
			respawInterval : 1,
			scoreBoard : 0,
			isGameOver : false,
			player : undefined,
			playerSprite : undefined,
			isPlayerMoving : false,
			fireSpeed : 50,
			fireCount : 0,
			fireDamage : 1,
			fireMaxCount : 10,
			moveSpeed : 50,
			ememy1Speed : 50,
			enemyArr : [],
			keys : [],
			score : undefined,
			gameOverText : undefined,
			tryAgainText : undefined,
			enemyChance : {"Enemy_1" : 25, "Enemy_2" : 70} // Chance by 100
		}

	}
    
    return {
        getInstance : function() {
            if(!instance) {
                instance = createInstance();
            }
            return instance;
        }
    }
})();

let _vars = Global.getInstance();

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

	  	function onUpdate() {
			for(var i = _vars.enemyArr.length - 1; i > -1; i--) {
				if(Misc.isColliding(_vars.player, _vars.enemyArr[i])) {
					window.cancelAnimationFrame(onUpdate);
					app.stage.removeChild(_vars.enemyArr[i]);
					Player.explode();
					_vars.isGameOver = true;
					return false;
				}
			}
			window.requestAnimationFrame(onUpdate);
			
		}
		window.requestAnimationFrame(onUpdate);

		app.stage.addChild(_vars.player);
	  	Game.start();
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
		function move() {
			if(fire.y < 0) {
				// window.cancelAnimationFrame(move);
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
						window.cancelAnimationFrame(move);
						Misc.explosion(_vars.enemyArr[i].x, _vars.enemyArr[i].y);
						_vars.enemyArr[i].x = 2000;
						_vars.enemyArr[i].y = 2000;
						_vars.enemyArr[i].visible = false;
						app.stage.removeChild(_vars.enemyArr[i]);
						app.stage.removeChild(fire);
						_vars.fireCount--;
						Score.add();
						return false;
					}else{
						window.cancelAnimationFrame(move);
						_vars.fireCount--;
						app.stage.removeChild(fire);
						return false;
					}
					
				}
			}
			

			window.requestAnimationFrame(move);
		}
		window.requestAnimationFrame(move);
		_vars.fireCount++;
	},

	onUpdate : function() {
		function explode() {
			for(var i = _vars.enemyArr.length - 1; i > -1; i--) {
				if(isColliding(_vars.player, _vars.enemyArr[i])) {
					window.cancelAnimationFrame(this.explode);
					app.stage.removeChild(_vars.enemyArr[i]);
					this.Explode();
					_vars.isGameOver = true;
					return false;
				}
			}
			window.requestAnimationFrame(explode);
			
		}
		window.requestAnimationFrame(explode);
	},

	explode : function() {
		Misc.explosion(_vars.player.x, _vars.player.y);
		app.stage.removeChild(_vars.player);
	}

}

const Game = {
	load : function() {
		Player.render();
		Score.render();
		Events.init();
	},

	start : function() {
		if(_vars.respawn !== undefined) {
			clearInterval(_vars.respawn);
		}
		_vars.respawn = setInterval(function() {
			if(_vars.isGameOver) {
				Game.over();
				clearInterval(_vars.respawn);
				return false;
			}
			window.onblur = function () { 
				return false;
			}
			var chance = Math.floor(Math.random() * 100) + 1;
			if(chance > _vars.enemyChance.Enemy_2) {
				Enemy.enemy_2();
			}else if(chance > _vars.enemyChance.Enemy_1) {
				Enemy.enemy_1();
			}
		}, 1000 * _vars.respawInterval);
	},

	over : function() {
		for(var i = _vars.enemyArr.length - 1; i > -1; i--) {
			_vars.enemyArr[i].visible = false;
		}
		console.log("GAME OVER")
		const gStyle = new PIXI.TextStyle({
		    fontFamily: "monospace",
		    fontSize: 56,
		    fontWeight: "bold",
		    fill: ["#66b5ff", "#000073"], // gradient
		    stroke: "#ffffff",
		    strokeThickness: 5,
		    dropShadow: true,
		    dropShadowColor: "#000000",
		    dropShadowBlur: 4,
		    dropShadowAngle: Math.PI / 6,
		    dropShadowDistance: 6,
		    wordWrap: true,
		    wordWrapWidth: 800,
		    lineJoin: "round",
		});
		_vars.gameOverText = new PIXI.Text("GAME OVER! \r Your Score:" + _vars.scoreBoard, gStyle);
		_vars.gameOverText.x = (app.screen.width / 2) - (_vars.gameOverText.width / 2);
		_vars.gameOverText.y = (app.screen.height / 2) - (_vars.gameOverText.height / 2);
		app.stage.addChild(_vars.gameOverText);

		const tStyle = new PIXI.TextStyle({
		    fontFamily: "monospace",
		    fontSize: 42,
		    fontWeight: "bold",
		    fill: "#ffffff", // gradient
		    stroke: "#000073",
		    strokeThickness: 5,
		    dropShadow: true,
		    dropShadowColor: "#000000",
		    dropShadowBlur: 4,
		    dropShadowAngle: Math.PI / 6,
		    dropShadowDistance: 6,
		    wordWrap: true,
		    wordWrapWidth: 800,
		    lineJoin: "round",
		});

		_vars.tryAgainText = new PIXI.Text("Click to try again.", tStyle);
		_vars.tryAgainText.interactive = true;
		_vars.tryAgainText.buttonMode = true;
		_vars.tryAgainText.x = (app.screen.width / 2) - (_vars.tryAgainText.width / 2);
		_vars.tryAgainText.y = (app.screen.height / 2) - (_vars.tryAgainText.height / 2) + 100;
		app.stage.addChild(_vars.tryAgainText);

		_vars.tryAgainText.on('pointerdown', function() {
			Game.reset();
		});

		_vars.score.visible = false;
	},

	reset : function() {
		app.stage.removeChild(_vars.player);
		app.stage.removeChild(_vars.score);
		app.stage.removeChild(_vars.gameOverText);
		app.stage.removeChild(_vars.tryAgainText);
		for(var i = _vars.enemyArr.length - 1; i > -1; i--) {
			app.stage.removeChild(_vars.enemyArr[i]);
		}
		_vars.enemyArr = [];
		_vars.isGameOver = false;
		_vars.fireCount = 0;
		this.load();
	}
}

const Score = {
	render : function() {
		_vars.scoreBoard = 0;
		_vars.score = new PIXI.Text("Score: " + _vars.scoreBoard, {fontFamily : 'monospace', fontSize: 24, fill : 0xffffff, align : 'center'});
		_vars.score.x = 10;
		_vars.score.y = 10;
		_vars.score.zIndex = 20;
		app.stage.addChild(_vars.score);
	},

	add : function() {
		_vars.scoreBoard++;
		_vars.score.text = "Score: " + _vars.scoreBoard; 
	}
}

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

	  		app.stage.addChild(e);
	  		function move() {
				if(!e.visible || e.y > app.screen.height) {
					window.cancelAnimationFrame(move);
					e.x = 2000;
					e.y = 2000;
					app.stage.removeChild(e);
					for(var i = _vars.enemyArr.length - 1; i > -1; i--) {
						if(e.id === _vars.enemyArr[i].id) {
							// enemyArr.splice(i, 1);
						}
					}
					return false;
				}
				e.y += 0.1 * _vars.ememy1Speed;
				window.requestAnimationFrame(move);
			}
			window.requestAnimationFrame(move);
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
		let reverse = false;

		let firing = setInterval(function() {
			if([1, 2, 3].sort(() => Math.random() - 0.5)[0] === 2) {
				Enemy.fire(e.x, e.y);
			}
		}, 1000);

		app.stage.addChild(e);
		function move() {
			if(!e.visible) {
				window.cancelAnimationFrame(move);
				e.x = 2000;
				e.y = 2000;
				app.stage.removeChild(e);
				for(var i = _vars.enemyArr.length - 1; i > -1; i--) {
					if(e.id === _vars.enemyArr[i].id) {
						// enemyArr.splice(i, 1);
					}
				}
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
			
			window.requestAnimationFrame(move);
		}

		window.requestAnimationFrame(move);
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

		function move() {
			if(fire.y > app.screen.height) {
				window.cancelAnimationFrame(move);
				app.stage.removeChild(fire);
				fire.x = 2000;
				return false;
			}
			fire.y += 0.1 * _vars.fireSpeed;

			if(Misc.isColliding(fire, _vars.player)) {
				window.cancelAnimationFrame(move);
				fire.x = 2000;
				app.stage.removeChild(fire);
				Player.explode();
				_vars.isGameOver = true;
				return false;
				
			}
			

			window.requestAnimationFrame(move);
		}
		window.requestAnimationFrame(move);
	}
}

const Events = {
	init : function() {
		window.addEventListener("keydown", function(e) {
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

const Misc = {
	explosion : function(x, y) {
		var res = ["images/sprites/e1.json", "images/sprites/e2.json"].sort(() => Math.random() - 0.5)[0];
		const fireSprite = PIXI.Loader.shared.resources[res].spritesheet;
		let explode = new PIXI.AnimatedSprite(fireSprite.animations["tile"]);
		explode.animationSpeed = .1;
		explode.anchor.set(0.5);
	  	explode.scale.set(.5);
	  	explode.x = x;
	  	explode.y = y;
	  	explode.loop = false;
	  	setTimeout(function() {
	  		app.stage.removeChild(explode);
	  	}, 3000)
	  	explode.play();
		app.stage.addChild(explode);
	},

	isColliding : function(a, b) {
		var ab = a.getBounds();
		var bb = b.getBounds();
		return ab.x + (ab.width / 2) > bb.x && ab.x < bb.x + (bb.width / 2) && ab.y + (ab.height / 2) > bb.y && ab.y < bb.y + (bb.height / 2);
	}
}

app.ticker.add((delta) => {
	if(!_vars.isGameOver) {
		if(_vars.keys[37] && _vars.player.x > 0) {
			_vars.player.x -= 0.1 * _vars.moveSpeed;
	    }else if(_vars.keys[39] && _vars.player.x < app.screen.width) {
			_vars.player.x += 0.1 * _vars.moveSpeed;
	    }
	}
	
});