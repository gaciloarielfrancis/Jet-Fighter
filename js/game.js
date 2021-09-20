const Game = {
	load : function() {
		Player.render();
		Score.render();
		Game.start();
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