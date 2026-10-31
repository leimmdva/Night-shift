import './style.css'
import { startGame } from './game/game'
import { preloadMonaco } from './editor/monacoLoader'

// Start Monaco loading in the background immediately.
// By the time the player opens the laptop, it will be ready.
preloadMonaco()

// Boot the Phaser game
startGame()
