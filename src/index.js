import GameScene from "./scenes/GameScene";

window.onload = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: "#cdcdcd",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scale: {
        parent: "gameContainer",
        width: 800,
        height: 800,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
    scene: [GameScene],
});
