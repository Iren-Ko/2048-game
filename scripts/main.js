import { Grid } from './grid.js';
import { Tile } from './tile.js';

const board = document.getElementById('board');

const grid = new Grid(board);

// помещаем плитку с числом на свободное место
grid.getRandomEmptyCell().linkTile(new Tile(board));
grid.getRandomEmptyCell().linkTile(new Tile(board));

// передвижение плитки по нажатию на кнопки, пересчет значения плитки
setupInputOnce();

function setupInputOnce() {
    window.addEventListener("keydown", handleKeydown, { once: true });
    window.addEventListener("touchstart", handleTouchStart, { once: true, passive: false });
  }
  
  function stopInput() {
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("touchstart", handleTouchStart);
  }
  
  function handleKeydown(e) {
    handleInput(e.key);
  }
  
  async function handleInput(key) {
    stopInput();

    switch(key) {

        case 'ArrowUp':
            if (!canMoveUp()) {
                setupInputOnce();
                return;
            }
            await moveUp();
            break;

        case 'ArrowDown':
            if (!canMoveDown()) {
                setupInputOnce();
                return;
            }
            await moveDown();
            break;

        case 'ArrowLeft':
            if (!canMoveLeft()) {
                setupInputOnce();
                return;
            }
            await moveLeft();
            break;

        case 'ArrowRight':
            if (!canMoveRight()) {
                setupInputOnce();
                return;
            }
            await moveRight();
            break;

        default:
            setupInputOnce();
            return;
    }

    // добавляем новую плитку
    const newTile = new Tile(board);
    grid.getRandomEmptyCell().linkTile(newTile);

    // if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {

    //     await newTile.waitForAnimationEnd()
    //     alert("Try again!")
    //     return;
    // }

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd()
        alert("F5")
        return;
    }

    setupInputOnce();
}

async function moveUp() {

    await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
    await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {

    // дожидаемся окончания анимации перемещения плитки
    const promises = [];

    //console.log(groupedCells);
    groupedCells.forEach(group => slideTilesInGroup(group, promises));

    await Promise.all(promises);

    // объединяем плитки
    grid.cells.forEach(cell => {

        cell.hasTileForMerge() && cell.mergeTiles();
    })
}

function slideTilesInGroup(group, promises) {

    for(let i=1; i < group.length; i++) {

        if (group[i].isEmpty()) {

            continue;
        }

        const cellWithTile = group[i];

        let targetCell;
        let j = i - 1;

        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {

            targetCell = group[j];
            j--;
        }
    
        if (!targetCell) {
            continue;
        }

        promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

        // объединение плитки
        if (targetCell.isEmpty()) {

            targetCell.linkTile(cellWithTile.linkedTile);

        } else {

            targetCell.linkTileForMerge(cellWithTile.linkedTile);
        }

        // освобождаем плитку от значения после перемещения
        cellWithTile.unlinkTile();

    }
}

function canMoveUp() {
    
    return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
    
    return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveLeft() {

    return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {

    return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {

    return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {

    return group.some((cell, index) => {

        if (index === 0) {
            
            return false;
        }

        if (cell.isEmpty()) {
            
            return false;
        }

        const targetCell = group[index - 1];
        return targetCell.canAccept(cell.linkedTile);
    });
}

// mobile
function handleTouchStart(e) {
    stopInput();
    e.preventDefault();

    let touchStartData = e.changedTouches[0];
    let touchStartDate = new Date;

    window.addEventListener("touchend", async evt => {
        evt.preventDefault();
        let touchEndData = evt.changedTouches[0];

        if (new Date - touchStartDate > 500) {
            setupInputOnce();
            return;
        }

        let deltaX = touchEndData.pageX - touchStartData.pageX;
        let deltaY = touchEndData.pageY - touchStartData.pageY;

        if (Math.abs(deltaX) >= 55) {

            await handleInput(deltaX > 0 ? 'ArrowRight' : 'ArrowLeft')

        } else if (Math.abs(deltaY) >= 55) {
            await handleInput(deltaY > 0 ? 'ArrowDown' : 'ArrowUp');
        }
        setupInput();
    }, { once: true })
}