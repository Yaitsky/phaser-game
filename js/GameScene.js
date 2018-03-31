class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.game = game;
  }

  preload() {
    this.load.image('sky', 'images/sky.png');
    this.load.image('ground', 'images/platform.png');
    this.load.image('star', 'images/star.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.spritesheet('dude', 'images/dude.png', 
      { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    const collectStar = (player, star) => {
      star.disableBody(true, true);
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);

      if (this.stars.countActive(true) === 0) {
        this.physics.pause();
        this.successText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2,
          'THANK YOU!', { fontSize: '54px', fill: '#056600' }).setOrigin(0.5, 0.5);
        
      }

      if (this.stars.countActive(true) % 2 === 0) {
        const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
      }
    }
    const hitBomb = (player, bomb) => {
      this.physics.pause();
      var graphics = this.add.graphics();
      var color = 0xffff00;
      var thickness = 2;
      var alpha = 0.5;

      graphics.lineStyle(thickness, color, alpha);

      graphics.fillRect(0, 0, 800, 600);

      this.player.setTint(0xff0000);
      this.player.anims.play('turn');
      this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2,
        'GAME OVER', { fontSize: '54px', fill: 'rgb(255,0,0)' }).setOrigin(0.5, 0.5);
      this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 50,
        'Try again (press SPACEBAR)', { fontSize: '24px', fill: 'rgb(255,0,0)' }).setOrigin(0.5, 0.5);
      this.gameOver = true;
    }

    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ]
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 })
    });
    

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 19,
      setXY: { x: 12, y: 0, stepX: 40 }
    });
    this.stars.children.iterate(child => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: 'rgb(224, 209, 0)' });

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.space.isDown && this.gameOver) {
      this.cleanScene();
      this.scene.start('GameScene');
      this.physics.resume();
      this.gameOver = false;
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  cleanScene() {
    this.anims.remove('left');
    this.anims.remove('right');
    this.anims.remove('turn');
    this.scene.destroy();
    this.physics.destroy();
  }
}