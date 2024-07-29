export class Cell {

    constructor(gridElement, x, y) {

        // создаем ячейку
        const cell = document.createElement('div');

        // добавляем ячейка класс
        cell.classList.add('cell');

        gridElement.append(cell);
        this.x = x;
        this.y = y;
    }

    linkTile(tile) {

        tile.setXY(this.x, this.y);
        this.linkedTile = tile;
    }

    unlinkTile() {

        this.linkedTile = null;
    }

    isEmpty() {

        return !this.linkedTile;
    }

    // меняем координаты плитки
    linkTileForMerge(tile) {

        tile.setXY(this.x, this.y);
        this.linkedTileForMerge = tile;
    }

    unlinkTileForMerge() {
        this.linkedTileForMerge = null;
    }

    hasTileForMerge() {
        return !!this.linkedTileForMerge;
    }

    // проверяем, можно ли переместить плитку
    canAccept(newTile) {

        return (this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value));
    }

    mergeTiles() {
        this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
        this.linkedTileForMerge.removeFromDOM();
        this.unlinkTileForMerge();
    }
}