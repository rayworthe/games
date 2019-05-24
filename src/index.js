import GameScene from "./scenes/GameScene";

window.onload = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: "#000",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scale: {
        parent: "gameContainer",
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
    scene: [GameScene],
});
