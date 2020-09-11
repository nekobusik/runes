let config = {
    type: Phaser.AUTO, // webgl or canvas
    width: 1000, //размер канваса
    height: 720,
    rows: 4, //for cards in rows
    cols: 6, //for cards in columns
    cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], //заводим индентификатор карт айди дадим по номеру в названии карт  
    timeout: 30, //30 секунд
    scene: new GameScene()
};

let game = new Phaser.Game(config);