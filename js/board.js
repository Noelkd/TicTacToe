"use strict";

var board = function (game) {
	this.canvas = document.getElementById("board");
	this.ctx = this.canvas.getContext("2d");
	this.game = game;
	this.render_board();
	this.game.make_computer_move();
	this.render_board();
	var _this = this;
	function onClickDown(e) {
		// http://stackoverflow.com/a/1338622/1663352
		// keeps the same this for the event listener and board
		_this.mouseDown(e);
	}
	function onClickUp(e) {
		_this.mouseUp(e);
	}
	this.canvas.addEventListener("mousedown", onClickDown, false);
	this.canvas.addEventListener("mouseup", onClickUp, false);
};

board.prototype.mouseDown = function (e) {
	var width = this.canvas.width;
	var height = this.canvas.height;
	var third_width = width / 3;
	var third_height = height / 3;
	var x;
	var y;
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
	}
	x -= this.canvas.offsetLeft;
	y -= this.canvas.offsetTop;
	var box_y = Math.floor(y / third_width);
	var box_x = Math.floor(x / third_height);
	this.game.try_move(box_y, box_x);
};

board.prototype.mouseUp = function (event) {
	this.game.make_computer_move();
	this.render_board();
};

board.prototype.render_board = function () {
	this.clear_ctx();
	this.draw_lines();
	this.draw_x_o();
};

board.prototype.set_player = function (player) {
	this.game.set_player(player);
	this.game.make_computer_move();
	this.render_board();
};

board.prototype.clear_ctx = function () {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

board.prototype.draw_lines = function () {
	var width = this.canvas.width;
	var height = this.canvas.height;
	var third_h = height / 3;
	var third_w = width / 3;
	this.ctx.beginPath();
	this.ctx.moveTo(0, third_h);
	this.ctx.lineTo(width, third_h);
	this.ctx.moveTo(0, third_h * 2);
	this.ctx.lineTo(width, third_h * 2);
	this.ctx.moveTo(third_w, 0);
	this.ctx.lineTo(third_w, height);
	this.ctx.moveTo(third_w * 2, 0);
	this.ctx.lineTo(third_w * 2, height);
	this.ctx.stroke();
};

board.prototype.draw_x_o = function () {
	var width = this.canvas.width;
	var height = this.canvas.height;
	var third_width = width / 3;
	var third_height = height / 3;
	var half_single_width = third_width / 2;
	var half_single_height = third_height / 2;
	for (var i = 0; i < this.game.board_size; i++) {
		if (this.game.board[i] === this.game.player
				|| this.game.board[i] === this.game.comp) {
			var w = half_single_width + (third_width * (i % 3));
			var h = half_single_height + (third_height * Math.floor(i / 3));
			this.ctx.fillText(this.game.board[i], w, h);
		}
	}
};
