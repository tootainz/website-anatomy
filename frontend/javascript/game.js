function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Tile {
    // Properties
    #coin = false

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

class Grid {
    // Properties
    #tiles = [];
    #dimensions;

    // Constructor
    constructor(width, height) {

        this.#dimensions = {
            width: width,
            height: height
        };

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

class Player {
    // Properties
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

class Game {
    #player;
    #grid;
    #coins = 0;
    
    constructor () {
        this.#player = new Player();
        this.#grid = new Grid(10,10);
        this.#spawnRandomCoin();
    }

    #spawnRandomCoin() {
        const x = getRandomNumber(0, this.#grid.getDimensions().width);
        const y = getRandomNumber(0, this.#grid.getDimensions().height);
        const tile = this.#grid.getTile(x,y);
        tile.addCoin();
    }

    getPlayerCoords() {
        return this.#player.getCoords();
    }

    movePlayer(direction) {
        const oldCoords = this.#player.getCoords();

        const checkForCoin = (coords) => {
            const tile = this.#grid.getTile(coords.x, coords.y)
            if (tile.hasCoin()) {
                this.#coins++;
                tile.removeCoin();
                this.#spawnRandomCoin();
            }
        };

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

class Renderer {
    #game;

    constructor(game) {
        this.#game = game;
        this.render();

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
              case 'ArrowUp':
                this.#game.movePlayer("up");
                this.render();
                break;
              case 'ArrowDown':
                this.#game.movePlayer("down");
                this.render();
                break;
              case 'ArrowLeft':
                this.#game.movePlayer("left");
                this.render();
                break;
              case 'ArrowRight':
                this.#game.movePlayer("right");
                this.render();
                break;
            }
          });
    }

    render() {
        const gridDiv = document.getElementById("grid");
        gridDiv.replaceChildren(); // Clears the pervious frame

        const score = document.createElement("p");
        score.textContent = `Coins: ${this.#game.getScore()}`;
        gridDiv.appendChild(score);

        const playerCoords = this.#game.getPlayerCoords();

        for (let y = 0; y < this.#game.getGrid().getDimensions().height; y++) {

            const row = document.createElement("p");

            for (let x = 0; x < this.#game.getGrid().getDimensions().width; x++) {
                const tile = document.createElement("span")
                tile.classList.add("gameTile");
                const tileEntity = this.#game.getGrid().getTile(x,y);
                if (y === playerCoords.y && x === playerCoords.x) {
                    tile.textContent = "A";
                }
                else if (tileEntity.hasCoin()) {
                    tile.textContent = "o";
                }
                else {
                    tile.textContent = ".";
                }
                row.appendChild(tile);
            }

            gridDiv.appendChild(row);
        }
    }
}

const game = new Game();
const renderer = new Renderer(game);