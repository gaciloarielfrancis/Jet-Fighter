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

let _vars = Global.getInstance();

function onLoad() {
	Game.load();
	Events.init();
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