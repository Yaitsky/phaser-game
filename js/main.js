const isMobile = navigator.userAgent.indexOf('Mobile') > -1 ? true : false;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0055d6',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [ TitleScene, GameScene ]
}

const game = new Phaser.Game(config);