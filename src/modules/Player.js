export default class Player{

	constructor(scene )
	{
		this.scene = scene;
		//this.load.image("honk","assets/honkhonksnippet.png" )
	}

	//this.load.image("honk", "assets/honkhonksnippet.png");
	createPlayer()
	{
		this.honk = this.physics.add.sprite(400, 400, "honk");
        this.honk.setScale(0.1);
        this.honk.setCollideWorldBounds(true);
       	this.cursors = this.input.keyboard.createCursorKeys();
       	this.doublePresses = [];
        this.playerBaseSpeed = 300;
        this.screenBounds = this.physics.add.staticGroup();
        var arrowKeys = {
            "up" : this.cursors.up,
            "left" : this.cursors.left,
            "right" : this.cursors.right,
            "down" : this.cursors.down
        };
        const arrowKeyVals = Object.values(arrowKeys);
        for (const key of arrowKeyVals) {
            this.doublePress(key, 500, () => {
                this.playerBaseSpeed = 600;
            }, () => {
                this.playerBaseSpeed = 300;
            });
        }

	}
} 