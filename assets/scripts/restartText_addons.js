Phaser.Scene.prototype.scaleRestartText = function (x, y, text, style) {
	// add a text
	let restText = this.add.text(x, y, text, style).setInteractive();
	restText.anchor = Math.round(restText.width * 0.5) / restText.width; //center
	restText.on('pointerover', function (ptr, x, y) { this.setScale(1.2) });
	restText.on('pointerout', function (ptr) { this.setScale(1) });
	restText.on('pointerdown', function (ptr) { this.setVisible(false) });

	return restText;
};