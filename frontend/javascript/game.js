/* ------------------------------------------------------------------------

A JAVASCRIPT EXAMPLE GAME

This is a program that resembles a simple game of a grid that you can move
around in using the arrow keys. Your goal is to get as many coins as possible.

The game looks like this:

Coins: 0

A.........
..........
..........
..........
..........
..........
..........
...o......
..........
..........

The program is represented by different objects. The main two objects are
Game and Renderer.

The Game contains a Player and a Grid objects and the Grid
is built out of Tile objects. The Game object takes care of keeping score of
collected coins, spawning new ones, moving the player and checking the
positions from the grid and its tiles. The Player keeps track of its
position and can move around. The Grid is used to store and access the
individual tiles. The Tiles just represent positions on the grid and keep track
of whether they have a coin or not.

The Renderer object takes care of displaying the game by accessing the HTML
documents grid container. It also listens to button press events and updates
the Game accordingly by calling the Game's move player method.

As a part of Simple Anatomy Of A Website you can look through this code for fun
and try to understand it. I won't thoroughly explain it as the concepts of classes
and objects woudl need a lot of text. But basically classes are ways to tell the
code to generate objects taht can store values and functions. These objects are
used to make it easier for us humans to understand relations between different
parts of the code and to make the program easier for us to comprehend in general.
Object oriented programming or OOP is in itself only one paradigm among multiple
different ways to write code.

And as for terms:
Properties = The objects internal variables.
Constructor = A function that is called when the object is created.
Methods = The objects internal functions.
Private = Can only be accessed inside the object.

by Joonatan Koponen

------------------------------------------------------------------------- */

// -------------------------------------------------------------------------
// HELPER FUNCTIONS
// -------------------------------------------------------------------------

// Global helper function to get random integer between min and max, excluding max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// -------------------------------------------------------------------------
// CLASSES
// -------------------------------------------------------------------------

// -----------------------------------
// TILE CLASS

class Tile {

    // Private properties
    #coin = false;

    // Constructor
    constructor(coin) {
        this.#coin = coin;
    }

    // Methods
    hasCoin() {
        return this.#coin;
    }

    addCoin() {
        this.#coin = true;
    }

    removeCoin() {
        this.#coin = false;
    }
}

// -----------------------------------
// GRID CLASS

class Grid {

    // Pivate properties
    #tiles = []; // Stores a 2 dimensional array of tiles
    #dimensions = {}; // Object that Stores the grid's dimensions in width and height

    // Constructor
    constructor(width, height) {

        // Set up dimensions
        this.#dimensions = {
            width: width,
            height: height
        };

        // generate teh grid from the given dimensions and populate it with Tiles without coins
        for (let x = 0; x < this.#dimensions.width; x++) {
            const column = [];
            for (let y = 0; y < this.#dimensions.height; y++) {
                column.push(new Tile(false));
            }
            this.#tiles.push(column);
        };
    }

    // Methods
    getTile(x, y) {
        return this.#tiles[x][y];
    }

    getDimensions() {
        return {...this.#dimensions}
    }
}

// -----------------------------------
// PLAYER CLASS

class Player {

    // Private properties
    // Store the player's position
    #x = 0;
    #y = 0;

    // Constructor
    constructor() {
    }

    // Methods
    up() {
        this.#y--;
        return this.getCoords();
    }
    down() {
        this.#y++;
        return this.getCoords();
    }
    left() {
        this.#x--;
        return this.getCoords();
    }
    right() {
        this.#x++;
        return this.getCoords();
    }
    getCoords() {
        return {
            x: this.#x,
            y: this.#y
        };
    }
}

// -----------------------------------
// GAME CLASS

class Game {

    // Private properties
    #player; // Stores Player object
    #grid; // Stores Grid object
    #coins = 0; // Keeps count of the player's score
    
    // Constructor
    constructor () {
        // Initialize the objects
        this.#player = new Player();
        this.#grid = new Grid(10,10);
        // Spawn a random coin for the start
        this.#spawnRandomCoin();
    }

    // Private Methods

    // Puts a random coin somewhere on the grid
    #spawnRandomCoin() {
        const x = getRandomNumber(0, this.#grid.getDimensions().width); // Uses the global helper function
        const y = getRandomNumber(0, this.#grid.getDimensions().height);
        const tile = this.#grid.getTile(x,y);
        tile.addCoin();
    }

    // Public methods

    getPlayerCoords() {
        return this.#player.getCoords();
    }

    // Moves the player and updates teh game state accordingly
    movePlayer(direction) {

        // Store the players old coords to check if moving would result outside of grid boundaries
        const oldCoords = this.#player.getCoords();

        // Check if the Tile in the given coordinates has a coin. If true, remove it and spawn a random new one.
        const checkForCoin = (coords) => {
            const tile = this.#grid.getTile(coords.x, coords.y)
            if (tile.hasCoin()) {
                this.#coins++;
                tile.removeCoin();
                this.#spawnRandomCoin();
            }
        };

        // Check the direction and check if we can move there or if it would be out of bounds. Also check for coin in the new position.
        switch (direction) {
            case "up":
                if (oldCoords.y > 0) {
                    const newCoords = this.#player.up();
                    checkForCoin(newCoords);
                }
                break;
            case "down":
                if (oldCoords.y < this.#grid.getDimensions().height-1) {
                    const newCoords = this.#player.down();
                    checkForCoin(newCoords);
                }
                break;
            case "left":
                if (oldCoords.x > 0) {
                    const newCoords = this.#player.left();
                    checkForCoin(newCoords);
                }
                break;
            case "right":
                if (oldCoords.x < this.#grid.getDimensions().width-1) {
                    const newCoords = this.#player.right();
                    checkForCoin(newCoords);
                }
                break;
        }
    }

    getPlayer() {
        return this.#player;
    }

    getGrid() {
        return this.#grid;
    }

    getScore() {
        return this.#coins;
    }

}

// -----------------------------------
// RENDERER CLASS

class Renderer {

    // Private properties
    #game;

    // Constructor
    constructor(game) {
        this.#game = game;

        // Render the initial start state
        this.render();

        // Assing event listeners for keypresses to move the player
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
              case 'ArrowUp':
                event.preventDefault(); // Prevents the arrow from scrolling the page
                this.#game.movePlayer("up");
                this.render();
                break;
              case 'ArrowDown':
                event.preventDefault();
                this.#game.movePlayer("down");
                this.render();
                break;
              case 'ArrowLeft':
                event.preventDefault();
                this.#game.movePlayer("left");
                this.render();
                break;
              case 'ArrowRight':
                event.preventDefault();
                this.#game.movePlayer("right");
                this.render();
                break;
            }
        });

        document.addEventListener('keydown', function(event) {
            // List of arrow key codes: 37 (left), 38 (up), 39 (right), 40 (down)
            if ([37, 38, 39, 40].includes(event.keyCode)) {
                event.preventDefault();
            }
        });
    }

    // Methods
    // Renders the game to the HTML document
    render() {
        // Get the grid div for the game
        const gridDiv = document.getElementById("grid");
        // Clears the previous frame
        gridDiv.replaceChildren();

        // Create a paragraph for displaying the score
        const score = document.createElement("p");
        score.id = "score";
        score.textContent = `Coins: ${this.#game.getScore()}`;
        gridDiv.appendChild(score);

        // Get the players coords for rendering
        const playerCoords = this.#game.getPlayerCoords();

        // Render the game grid by rows, as opposed to columns
        for (let y = 0; y < this.#game.getGrid().getDimensions().height; y++) {

            const row = document.createElement("p");

            for (let x = 0; x < this.#game.getGrid().getDimensions().width; x++) {

                // Create a span element for a Tile
                const tile = document.createElement("span")
                tile.classList.add("gameTile");
                const tileEntity = this.#game.getGrid().getTile(x,y);

                // Check if Tile has a player
                if (y === playerCoords.y && x === playerCoords.x) {
                    tile.textContent = "A";
                }
                // Check if Tile has a coin
                else if (tileEntity.hasCoin()) {
                    tile.textContent = "o";
                }
                // Default tile rendering
                else {
                    tile.textContent = ".";
                }
                row.appendChild(tile);
            }

            gridDiv.appendChild(row);
        }
    }
}

// -------------------------------------------------------------------------
// ACTUAL PROGRAM
// -------------------------------------------------------------------------

// Initialize the game and renderer and pass the game as a reference to the renderer
// Then just listen for key presses

const game = new Game();
const renderer = new Renderer(game);