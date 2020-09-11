class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }
    preload() {
        this.load.image('bg', 'assets/sprites/background.png');

        this.load.image('card', 'assets/sprites/card.png');
        this.load.image('card1', 'assets/sprites/card1.png');
        this.load.image('card2', 'assets/sprites/card2.png');
        this.load.image('card3', 'assets/sprites/card3.png');
        this.load.image('card4', 'assets/sprites/card4.png');
        this.load.image('card5', 'assets/sprites/card5.png');
        this.load.image('card6', 'assets/sprites/card6.png');
        this.load.image('card7', 'assets/sprites/card7.png');
        this.load.image('card8', 'assets/sprites/card8.png');
        this.load.image('card9', 'assets/sprites/card9.png');
        this.load.image('card10', 'assets/sprites/card10.png');
        this.load.image('card11', 'assets/sprites/card11.png');
        this.load.image('card12', 'assets/sprites/card12.png');
        this.load.image('card13', 'assets/sprites/card13.png');
        this.load.image('card14', 'assets/sprites/card14.png');
        this.load.image('card15', 'assets/sprites/card15.png');
        this.load.image('card16', 'assets/sprites/card16.png');
        this.load.image('card17', 'assets/sprites/card17.png');
        this.load.image('card18', 'assets/sprites/card18.png');
        this.load.image('card19', 'assets/sprites/card19.png');
        this.load.image('card20', 'assets/sprites/card20.png');
        this.load.image('card21', 'assets/sprites/card21.png');
        this.load.image('card22', 'assets/sprites/card22.png');
        this.load.image('card23', 'assets/sprites/card23.png');
        this.load.image('card24', 'assets/sprites/card24.png');

        this.load.audio('again', 'assets/sounds/again.wav');
        this.load.audio('card', 'assets/sounds/card.mp3');
        this.load.audio('theme', 'assets/sounds/theme.mp3');

    }

    createText() {
        let introText = this.add.text(200, 100, 'Let runes give you an answer', {
            font: '60px Norse',
            fill: '#ffffff',
        });
        introText.anchor = Math.round(introText.width * 0.5) / introText.width; //must be center
    }

    createGoodbyText() {
        let endText = this.add.text(330, 570, 'That is your answer', { font: '50px Norse', fill: '#ffffff' });
        endText.anchor = Math.round(endText.width * 0.5) / endText.width;
        this.restartText = this.scaleRestartText(430, 620, 'Ask more', { font: '40px Norse', fill: '#ffffff' })
            .on('pointerdown', (pointer, targets) => {
                this.sounds.again.play({
                    volume: 0.4
                });
                this.restartGame();
                endText.setVisible(false);
            });
    }

    createSounds() {
        this.sounds = {
            card: this.sound.add('card'),
            theme: this.sound.add('theme'),
            again: this.sound.add('again')
        };

        this.sounds.theme.play({
            volume: 0.3
        });
    }

    create() {
        this.timeout = config.timeout;
        this.createSounds();
        this.createBackground();
        this.createText();
        this.createCards();
        this.startGame();
    }

    restartGame() {
        let count = 0; //для замыкания
        let onCardMoveComplete = () => {
            //будет выполнятся после отлета каждой карты
            ++count;
            if (count >= this.cards.length) { //значит все карты улетели
                //когда все карты улетели
                this.startGame();
            }
        };
        //отлет карт с поля
        this.cards.forEach(card => {
            card.moveCard({
                x: this.sys.game.config.width + card.width, //this.sys.game.config.width - координата правого нижнего угла
                y: this.sys.game.config.height + card.height,
                delay: card.position.delay, //для задержки отлета каждой карты относительно остальных
                callback: onCardMoveComplete
            });
        });
    }

    startGame() {
        this.initCardsPositions();
        this.timeout = config.timeout;
        this.openedCard = null; //создаем переменную для открытой карты
        this.openedCardsCount = 0; //переменная для проверки открытых пар карт
        this.initCards(); //перемешанные карты закрытые
        this.showCards();
    }

    //переворачиваем и перемешиваем все карты
    initCards() {
        let positions = Phaser.Utils.Array.Shuffle(this.positions); //random через метод Фэйзера Shuffle

        this.cards.forEach(card => {
            card.init(positions.pop());
        });
    }

    //чтобы каждая карты вылетала из-за угла на экран
    showCards() {
        this.cards.forEach(card => {
            card.depth = card.position.delay; //уровень слоя чем больше значение, тем выше будет карта
            card.moveCard({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay //для задержки вылета каждой карты относительно остальных
            });
        });
    }

    createBackground() {
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    }

    createCards() {
        this.cards = []; //массив явл св-вом объекта GameScene
        //перебираем не по позиции, а по значению - value - карт из config
        for (let value of config.cards) {
            //создаем по 1 экземпляра карт для каждого идентификатора из массива config.cards
            for (let i = 0; i < 1; i++) {
                this.cards.push(new Card(this, value)); //создаем экземпляры класса Card
            }
        }
        this.input.on('gameobjectdown', this.onCardClicked, this);
    }

    onCardClicked(pointer, card) {
        
        if (card.openedFlag) { //исключаем ошибки при кликах на уже открытую карту
            return false; //если карта открыта - ничего не делаем
        }

        this.sounds.card.play({
            volume: 0.2
        });


        ++this.openedCardsCount;
        card.openCard();

        if (this.openedCardsCount === 3) {
            //  card.closeCard();
            this.createGoodbyText();
        }

    }

    initCardsPositions() {
        let positions = [];
        let cardTexture = this.textures.get('card').getSourceImage();  //чтобы не цифры писать, а динамически задать размер карт
        let cardWidth = cardTexture.width + 4;  //4 - расстояние между картами
        let cardHeight = cardTexture.height + 4;
        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

        let id = 0;

        for (let col = 0; col < config.cols; col++) {
            for (let row = 0; row < config.rows; row++) {  //циклом карты расставляем           
                positions.push({
                    delay: ++id * 100, //на каждую позицию 100 миллисекунд задержки
                    x: offsetX + col * cardWidth, //расстояние от краев до рядов карт
                    y: offsetY + row * cardHeight,
                });
            }
        }

        this.positions = positions;
    }
}
