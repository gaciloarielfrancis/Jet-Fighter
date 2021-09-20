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