class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, value) {
        super(scene, 0, 0, 'card');
        this.scene = scene; //устанавливаем ссылку на сцену
        this.value = value; //изображения карт
        this.scene.add.existing(this); //добавляем спрайт на экран
        this.setInteractive();       //отслеживать события нажатия на карты и переворот карт
        this.openedFlag = false; //флаг проверки, что карта закрыта
    }

    //инициализация карт
    init(position) {
        this.position = position;
        this.closeCard();
        this.setPosition(-this.width, -this.height);
    }

    moveCard(params) {
        //плавный вылет карт
        this.scene.tweens.add({
           // text: config.sliceText,
            targets: this,
            x: params.x,
            y: params.y,
            delay: params.delay,
            ease: 'Linear',
            duration: 250,
            onComplete: () => {
                if (params.callback) {
                    params.callback();
                }
            }
        });
    }

    //переворот карт
    flip(callback) {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: 'Linear',
            duration: 150,
            onComplete: () => {
                this.show(callback);
            }
        });
    }

    show(callback) {
        let texture = this.openedFlag ? 'card' + this.value : 'card';
        this.setTexture(texture);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: 'Linear',
            duration: 150,
            onComplete: () => {
                if (callback) {
                    callback();
                }
            }
        });
    }

    openCard() {
        this.openedFlag = true;
        this.flip();
    }

    closeCard(callback) {
        if (this.openedFlag) {
            this.openedFlag = false;
            this.flip(callback);
        }
    }
}