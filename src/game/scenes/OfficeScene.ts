import Phaser from 'phaser'

/**
 * OfficeScene — the main 2D top-down office.
 * Player moves, hides, and encounters monsters here.
 * Placeholder implementation: colored rectangle as player, WASD movement.
 */
export class OfficeScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: {
    up: Phaser.Input.Keyboard.Key
    down: Phaser.Input.Keyboard.Key
    left: Phaser.Input.Keyboard.Key
    right: Phaser.Input.Keyboard.Key
  }

  private readonly SPEED = 160

  constructor() {
    super({ key: 'OfficeScene' })
  }

  create(): void {
    // Placeholder floor
    this.add.rectangle(480, 270, 960, 540, 0x1a1f2e)

    // Placeholder desks
    for (let i = 0; i < 4; i++) {
      this.add.rectangle(150 + i * 200, 200, 120, 60, 0x2d333b)
      this.add.rectangle(150 + i * 200, 350, 120, 60, 0x2d333b)
    }

    // Player
    this.player = this.add.rectangle(480, 270, 20, 28, 0x58a6ff)
    this.physics.add.existing(this.player)

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }

    // Temp: press E to open laptop
    this.input.keyboard!.addKey('E').on('down', () => {
      this.scene.launch('LaptopScene')
      this.scene.pause()
    })

    // HUD hint
    this.add.text(10, 10, 'WASD / Arrow keys: move   E: open laptop', {
      fontSize: '12px',
      color: '#484f58',
    })
  }

  update(): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0)

    const left = this.cursors.left.isDown || this.wasd.left.isDown
    const right = this.cursors.right.isDown || this.wasd.right.isDown
    const up = this.cursors.up.isDown || this.wasd.up.isDown
    const down = this.cursors.down.isDown || this.wasd.down.isDown

    if (left) body.setVelocityX(-this.SPEED)
    else if (right) body.setVelocityX(this.SPEED)

    if (up) body.setVelocityY(-this.SPEED)
    else if (down) body.setVelocityY(this.SPEED)
  }
}
