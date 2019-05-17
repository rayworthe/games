var config = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade'
    },
    scale: {
        parent: "gameContainer",
        width: 960,
        height: 600,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ Scene1 ]
}

var game = new Phaser.Game(config);
