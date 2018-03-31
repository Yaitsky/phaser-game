class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
    this.game = game;
  }

  preload() {
    this.load.image('logo', 'images/logo.png');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.logo = this.add.image(this.game.canvas.width / 2, 100, 'logo').setOrigin(0.5, 0);
    this.add.text(this.game.canvas.width / 2, 400,
      'Phaser 3 HTML5 Game', { fontSize: '36px', fill: 'rgb(255,255,255)' }).setOrigin(0.5, 0);
    this.add.text(this.game.canvas.width / 2, 450,
      'Press SPACEBAR to start', { fontSize: '24px', fill: 'rgb(255,255,255)' }).setOrigin(0.5, 0);
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start('GameScene');
    }
  }
}