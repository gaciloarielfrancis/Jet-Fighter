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