import { Cell } from './cell.js';

const gridSize = 4;
const cellsCount = gridSize * gridSize;

export class Grid {

    constructor(gridElement) {

        this.cells = [];

        for(let i=0; i < cellsCount; i++) {

            // this.cells.push(new cellsCount(gridElement, x, y));
            this.cells.push(new Cell(gridElement, i % gridSize, Math.floor(i / gridSize)));


            // Игровое поле
            // | i = 0  | i = 1  | i = 2  | i = 3  |
            // | x = 0  | x = 1  | x = 2  | x = 3  |
            // | y = 0  | y = 1  | y = 2  | y = 3  |
            // ------------------------------------
            // | i = 4  | i = 5  | i = 6  | i = 7  |
            // | x = 0  | x = 1  | x = 2  | x = 3  |
            // | y = 1  | y = 1  | y = 1  | y = 1  |
            // ------------------------------------
            // | i = 8  | i = 9  | i = 10 | i = 11 |
            // | x = 0  | x = 1  | x = 2  | x = 3  |
            // | y = 2  | y = 2  | y = 2  | y = 2  |
            // ------------------------------------
            // | i = 12 | i = 13 | i = 14 | i = 15 |
            // | x = 0  | x = 1  | x = 2  | x = 3  |
            // | y = 3  | y = 3  | y = 3  | y = 3  |
        }

        // группировка для передвижения плитки
        this.cellsGroupedByColumn = this.groupCellsByColumn();
        this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column => [...column].reverse());
        this.cellsGroupedByRow = this.groupCellsByRow();
        this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(raw => [...raw].reverse());
    }

    // ищем все пустые ячейки
    getRandomEmptyCell() {

        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);

        return emptyCells[randomIndex];
    }

    groupCellsByColumn() {

        return this.cells.reduce((groupedCells, cell) => {

            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;
            
            return groupedCells;

        }, []);
    }

    groupCellsByRow() {

        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;

            return groupedCells;
        }, []);
    }
}