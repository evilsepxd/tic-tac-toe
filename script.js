'use strict';

document.addEventListener('DOMContentLoaded', () => {

	const cells = document.querySelectorAll('.cell'),
		 players = document.querySelectorAll('.player'),
		 overlay = document.querySelector('.gameover-overlay'),
		 resetBtn = document.querySelector('.reset'),
		 winnerElem = document.querySelector('.winner'),
		 winnerNameElem = document.querySelector('.winner span'),
		 drawElem = document.querySelector('.draw');

	let playerTurn = 0,
		totalTurns = 0;

	cells.forEach(cell => cell.addEventListener('click', () => {
		if (!cell.classList.contains('clicked')) {
			cell.classList.add('clicked');

			const mark = document.createElement('div');
			if (playerTurn === 0) {
				createX(cell, mark);
			} else createO(cell, mark);
			cell.append(mark);

			totalTurns++;
			changeTurn();
			
			let {check: checkForX, sign} = checkForWin('x');
			if (checkForX) {
				gameOver(sign);
			} else {
				let {check: checkForO, sign} = checkForWin('o');
				if (checkForO) {
					gameOver(sign);
				} else if (totalTurns === 9) {
					gameOver();
				}
			}
		}
	}));

	resetBtn.addEventListener('click', () => {
		totalTurns = 0;
		resetCells();
		resetOverlay();
		clearField();
		overlay.classList.remove('overlay_active');
	});


	function resetCells() {
		cells.forEach(cell => {
			cell.classList.remove('clicked', 'clicked_x', 'clicked_o');
		});
	}


	function clearField() {
		const xArr = document.querySelectorAll('.x'),
			 oArr = document.querySelectorAll('.o');

		[...xArr, ...oArr].forEach(mark => mark.remove());
	}


	function gameOver(winnerSign = 0) {
		resetOverlay();
		if (!winnerSign) {					// если ничья
			drawElem.classList.add('draw_active');
		} else {							// если кто-то выиграл
			winnerNameElem.textContent = winnerSign;
			winnerElem.classList.add('winner_active');
		}
		overlay.classList.add('overlay_active');
	}


	function resetOverlay() {
		winnerElem.classList.remove('winner_active');
		drawElem.classList.remove('draw_active');
	}


	function changeTurn() {
		if (playerTurn === 0) {
			playerTurn = 1;
			players.forEach(player => player.classList.remove('player_active'));
			players[1].classList.add('player_active');
		} else {
			playerTurn = 0;
			players.forEach(player => player.classList.remove('player_active'));
			players[0].classList.add('player_active');
		}
	}


	function checkForWin(sign) {
		let lines = [];
		for (let i = 0; i < 9; i += 3) {			// проверка на строки
			for (let j = i; j < i + 3; j++) {
				lines.push(cells[j]);
			}
			if (checkEveryLine(lines, sign)) {
				return {check: true, sign: sign};
			} else {
				lines = [];
			}
		}

		for (let i = 0; i < 3; i++) {				// проверка на ряды
			for (let j = i; j < i + 7; j += 3) {
				lines.push(cells[j]);
			}
			if (checkEveryLine(lines, sign)) {
				return {check: true, sign: sign};
			} else {
				lines = [];
			}
		}

		for (let i = 0; i < 9; i += 4) {			// главная диагональ
			lines.push(cells[i]);
		}
		if (checkEveryLine(lines, sign)) {
			return {check: true, sign: sign};
		} else {
			lines = [];
		}

		for (let i = 2; i < 7; i += 2) {			// побочная диагональ
			lines.push(cells[i]);
		}
		if (checkEveryLine(lines, sign)) {
			return {check: true, sign: sign};
		} else {
			lines = [];
			return {check: false, sign: sign};
		}
	}


	function checkEveryLine(lines, sign) {
		return lines.every((elem) => {
			return elem.classList.contains(`clicked_${sign}`);
		})
	}


	function createX(parent, elem) {
		const x_left = document.createElement('span'),
			 x_right = document.createElement('span');
		
		elem.classList.add('x');
		x_left.classList.add('x_left');
		x_right.classList.add('x_right');

		if (parent.classList.contains('cell_black')) {
			x_left.style.backgroundColor = 'white';
			x_right.style.backgroundColor = 'white';
		} else {
			x_left.style.backgroundColor = 'black';
			x_right.style.backgroundColor = 'black';
		}

		elem.append(x_left, x_right);
		parent.classList.add('clicked_x');
	}


	function createO(parent, elem) {
		elem.classList.add('o');

		if (parent.classList.contains('cell_black')) {
			elem.style.borderColor = 'white';
		} else {
			elem.style.borderColor = 'black';
		}
		parent.classList.add('clicked_o');
	}
});