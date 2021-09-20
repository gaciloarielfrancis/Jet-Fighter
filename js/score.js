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