import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { OfficeScene } from './scenes/OfficeScene'
import { LaptopScene } from './scenes/LaptopScene'

export function startGame(): void {
  new Phaser.Game({
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    backgroundColor: '#0d1117',
    scene: [BootScene, OfficeScene, LaptopScene],
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  })
}
