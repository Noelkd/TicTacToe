"use strict";

var ticTacToe = function (player) {
    this.board_size = 9;
    // Options are the win states
    this.win_states = [[0, 1, 2],
                       [3, 4, 5],
                       [6, 7, 8],
                       [0, 4, 8],
                       [2, 4, 6],
                       [1, 4, 7],
                       [0, 3, 6],
                       [2, 5, 8]];
    // Setup empty board
    this.set_player(player);
};

ticTacToe.prototype.set_player = function (player) {
    this.player = player;
    if (player === "X") {
        this.comp = "O";
    } else {
        this.comp = "X";
    }
    this.start_game();
};

ticTacToe.prototype.start_game = function () {
    this.turn = "X";
    this.over = false;
    this.new_board();
};

ticTacToe.prototype.new_board = function () {
    this.board = [];
    for (var i = 0; i < this.board_size; i++) {
        this.board.push("-");
    }
};

ticTacToe.prototype.get_available_moves = function (nxt_move, nxt_player) {
    var moves = [];
    for (var i = 0; i < this.board_size;i++) {
        if (nxt_move[i] === "-") {
            var move = nxt_move.slice(0, i);
            move.push(nxt_player);
            move = move.concat(nxt_move.slice(i + 1, this.board_size));
            moves.push(move);
        }
    }
    return moves;
};

ticTacToe.prototype.rate_move = function (move, depth) {
    var score = 0;
    for (var i = 0; i < this.win_states.length; i++) {
        var current_row = this.win_states[i];
        if (move[current_row[0]] === move[current_row[1]] &&
            move[current_row[1]] === move[current_row[2]]) {
            if (move[current_row[0]] !== "-") {
                score = move[current_row[0]] === this.player ?  -10 : 10;
                score = score - depth;
                return score;
            }
        }
    }
    return score;
};

ticTacToe.prototype.game_over = function (move) {

    for (var i = 0; i < this.win_states.length; i++) {
        var current_row = this.win_states[i];
        if (move[current_row[0]] === move[current_row[1]] &&
            move[current_row[1]] === move[current_row[2]]) {
            if (move[current_row[0]] !== "-") {
                return true;
            }
        }
    }

    for (i = 0; i < move.length; i++) {
        if (move[i] === "-") {
            return false;
        }
    }
    return true;

};

ticTacToe.prototype.try_move = function (row, col) {
    var board_pos = row * 3 + col;
    if (this.board[board_pos] === "-") {
        var new_move = this.board.slice(0, board_pos);
        new_move.push(this.player);
        new_move = new_move.concat(this.board.slice(board_pos + 1, this.board_size));
        this.make_move(new_move);
    }
};

var array_eql = function (arr1, arr2) {
    // basically copied from http://stackoverflow.com/a/6315198/1663352
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};

ticTacToe.prototype.make_move = function (move) {
    var possible_moves = this.get_available_moves(this.board, this.turn);
    for (var i = 0;  i < possible_moves.length; i++) {
        if (array_eql(move, possible_moves[i])) {
            this.board = move;
            this.turn = this.turn === "X" ? "O" : "X";
        }
    }
    return false;
};

ticTacToe.prototype.make_computer_move = function () {
    if (this.turn === this.comp) {
        var move, score, arr;
        arr = this.maximised_move(this.board, 0);
        move = arr[0];
        score = arr[1];
        //console.log(move, score);
        this.make_move(move);
    }
};
ticTacToe.prototype.maximised_move = function (board, depth) {
    depth = depth + 1;

    var best_score = -11;
    var best_move  = null;
    var move = null;
    var score = null;
    if (this.game_over(board)) {
        return [board, this.rate_move(board, depth)];
    }

    var possible_moves = this.get_available_moves(board, this.comp);
    for (var i = 0; i < possible_moves.length; i++) {
        var new_board_state = possible_moves[i];
        var arr = this.maximised_move(new_board_state, depth);
        move = arr[0];
        score = arr[1];

        if (best_score === null || score > best_score) {
            best_score = score;
            best_move = new_board_state;
        }
    }

    return [best_move, best_score];
};

ticTacToe.prototype.minimized_move = function (board, depth) {
    depth = depth + 1;
    var best_move = null;
    var best_score = 11;

    if (this.game_over(board)) {
        return [board, this.rate_move(board, depth)];
    }

    var possible_moves = this.get_available_moves(board, this.player);

    for (var i = 0; i < possible_moves.length;i++) {
        var new_board_state = possible_moves[i];
        var move, score, arr;
        arr = this.maximised_move(new_board_state, depth);
        move = arr[0];
        score = arr[1];

        if (best_score === null || score < best_score) {
            best_score = score;
            best_move = new_board_state;
        }
    }
    return [best_move, best_score];

};
