export class Tile {

    constructor(gridElement) {

        this.tileElement = document.createElement('div');
        this.tileElement.classList.add('tile')

        // присваиваем рендомное значение от 2 до 4 и записываем в плитку
        //this.value = Math.random() > 0.5 ? 2 : 4;
        //this.tileElement.textContent = this.value;
        this.setValue(Math.random() > 0.5 ? 2 : 4);
        gridElement.append(this.tileElement);
    }

    setXY(x, y) {

        this.x = x;
        this.y = y;
        this.tileElement.style.setProperty('--x-pos', x);
        this.tileElement.style.setProperty('--y-pos', y);
    }

    // меняем значение плитки, цвет и цвет текста
    setValue(value) {

        this.value = value;
        this.tileElement.textContent = value;
        const power = Math.log2(value);
        const bgLightness = 100 - power * 9;
        this.tileElement.style.setProperty("--bg-lightness", `${bgLightness}%`);
        this.tileElement.style.setProperty("--text-lightness", `${bgLightness < 50 ? 90 : 10}%`);
    }

    removeFromDOM() {

        this.tileElement.remove();
    }

    waitForTransitionEnd() {

        return new Promise(resolve => {
          this.tileElement.addEventListener(
            'transitionend', resolve, { once: true });
        });
      }
    
    waitForAnimationEnd() {

        return new Promise(resolve => {
            this.tileElement.addEventListener(
            'animationend', resolve, { once: true });
        });
    }

}