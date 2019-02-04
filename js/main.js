// HTML elements
let gridContainerHTML = null;
let playButtonHTML = null;
let addPlayerButtonHTML = null;
let timerHTML = null;
let firstScreenContainerHTML = null;
let secondScreenContainerHTML = null;
let playerNameInputHTML = null;

// Global variables
let rows = 4;
let cols = 5;
let numberOfColors = rows * cols / 2;
let selectedSquares = [];
let colorPairs = new Map();
let flipCardsDelayId = null;
let timerIntervalId = null;
let gridElements = [];
let hours = 0;
let minutes = 0;
let seconds = 0;
let playerName = '';
// let colors = generateRandomColors(numberOfColors);
let colors = ['hotpink', 'darkorchid ', 'purple', 'crimson', 'salmon', 'orange', 'orangered', 'yellow', 'khaki', 'lime', 'green', 'cyan', 'blue', 'maroon', 'black'];

function addPlayerButtonClickHandler (event) {
    event.preventDefault();
    if (playerNameInputHTML.value) {
        playerName = playerNameInputHTML.value;
        window.localStorage.setItem(playerName, '');
        firstScreenContainerHTML.classList.add('hidden-section');
        secondScreenContainerHTML.classList.remove('hidden-section');
    }
}

function playButtonClickHandler (event) {
    event.preventDefault();
    if (playButtonHTML.innerHTML === 'Start Game' || playButtonHTML.innerHTML === 'Resume Game') {
        setColorsToGrid();
        enableGrid();
        startTimer();
        playButtonHTML.innerHTML = 'Pause Game';
    } else {
        stopTimer();
        disableGrid();
        playButtonHTML.innerHTML = 'Resume Game';
    }
}

function startTimer() {
    timerIntervalId = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerIntervalId);
}

function updateTimer() {
    if (seconds + 1 === 60) {
        if (minutes + 1 === 60) {
            hours++;
        }
        minutes = minutes < 59 ? minutes + 1 : 0;
    }
    seconds = seconds < 59 ? seconds + 1 : 0;
    timerHTML.innerHTML = formatTimerOutput(hours, minutes, seconds);
}

function formatTimerOutput(hh, mm, ss) {
    if (ss < 10) {
        ss = `0${ss}`;
    }
    if (mm < 10) {
        mm = `0${mm}`;
    }
    if (hh < 10) {
        hh = `0${hh}`;
    }
    return `${hh}:${mm}:${ss}`;
}

function flipperCardOnClickHandler (event) {
    event.preventDefault();
    if (!event.target.parentElement.classList.contains('rotate-onclick')) {
        event.target.parentElement.classList.toggle('rotate-onclick');
        selectedSquares.push(Number(event.target.id.split('-')[2]));
        let selectedSquaresHTML = [];
        clearTimeout(flipCardsDelayId);
        if (selectedSquares.length === 2) {
            if ((colorPairs.has(selectedSquares[0]) && colorPairs.get(selectedSquares[0]) === selectedSquares[1]) 
                || (colorPairs.has(selectedSquares[1]) && colorPairs.get(selectedSquares[1]) === selectedSquares[0])) {
                // colors matched! keep them flipped
                selectedSquaresHTML = [gridElements[selectedSquares[0]], gridElements[selectedSquares[1]]];
                selectedSquaresHTML.map(el => el.lastElementChild.disabled = true);
                selectedSquares = [];
                if (hasWonGame()) {
                    // user won the game!
                    stopTimer();
                    // add time to scoreboard, check if current time is better than the one saved
                    const savedTime = window.localStorage.getItem(playerName);
                    const currentTime = timerHTML.innerHTML;
                    if (savedTime < currentTime) {
                        window.localStorage.setItem(playerName, currentTime);
                    }
                }
            } else {
                selectedSquaresHTML = [gridElements[selectedSquares[0]], gridElements[selectedSquares[1]]];
                // wrong color pair selection, flip both cards
                flipCardsDelayId = setTimeout(() => {
                    toggleCards(...selectedSquaresHTML);
                }, 600);
            }
            selectedSquares = [];
        }
    }
}

/**
 * Checks if all the cards are flipped, meaning the user has won the game
 */
function hasWonGame() {
    // check if all cards are flipped
    return gridElements.every(flipperEl => flipperEl.classList.contains('rotate-onclick'));
}

/**
 * Utility function used to flip two cards simultaneously
 * @param {Element} elem1 - HTML element representing the first card to be flipped
 * @param {Element} elem2 - HTML element representing the second card to be flipped
 */
function toggleCards(elem1, elem2) {
    elem1.classList.toggle('rotate-onclick');
    elem2.classList.toggle('rotate-onclick');
}

/**
 * Creates an array of random colors to be used as pairs in the grid
 * @param {Number} amount - Number of random colors to generate
 */
function generateRandomColors(amount) {
    let randomColors = [];
    for (let i = 0; i < amount; i++) {
        randomColors.push(`#${((1<<24) * Math.random() | 0).toString(16)}`);
    }
    return randomColors;
}

/**
 * Generates an arbitrary number between two numbers
 * @param {Number} min - Lower bound to generate a random number between
 * @param {Number} max - Upper bound to generate a random number between
 * @returns {Number} a random number
 */
function getRandomNumber(min, max) {
    var randomFloat = Math.random() * (max - min) + min;
    return Math.floor(randomFloat);
}

/**
 * Creates a squared grid of 'length' rows and columns
 * @param {Number} length - the number of rows and columns of the grid
 */
function createGrid (rows, cols) {
    let index = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const flipContainer = document.createElement('div');
            const flipper = document.createElement('div');
            flipContainer.classList.add('flip-container');
            flipper.classList.add('flipper');
            flipper.onclick = flipperCardOnClickHandler;

            const frontCard = document.createElement('button');
            frontCard.id = `front-card-${index}`;
            frontCard.innerHTML = '?';
            frontCard.classList.add('square-btn__base', 'square-btn__front-card', 'front-card');
            frontCard.disabled = true;
            flipper.appendChild(frontCard);

            const backCard = document.createElement('button');
            backCard.id = `back-card-${index}`;
            backCard.classList.add('square-btn__base', 'back-card');
            flipper.appendChild(backCard);
            gridElements.push(flipper);

            flipContainer.appendChild(flipper);
            gridContainerHTML.appendChild(flipContainer);
            index++;
        }
    }
}

/**
 * Shuffles the elements of an array using random indexes
 * @param {Array} array - the array whose elements will be shuffled
 */
function shuffleNumbersInArray(array) {
    let tmp = -1; 
    let current = -1; 
    let top = array.length;
    if(top) {
        while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
          }
    }
    return array;
}

function setColorsToGrid() {
    const gridIndexes = shuffleNumbersInArray([...Array(numberOfColors * 2).keys()]);
    let index = 0;
    for (let i = 0; i < numberOfColors; i++) {
        gridElements[gridIndexes[index]].lastElementChild.style.cssText = `border: 1px solid ${colors[i]}; background: ${colors[i]};`;
        gridElements[gridIndexes[index + 1]].lastElementChild.style.cssText = `border: 1px solid ${colors[i]}; background: ${colors[i]};`;
        colorPairs.set(gridIndexes[index], gridIndexes[index + 1]);
        index += 2;
    }
}

function buildScoresTable() {
    const users = window.localStorage;
    const table = document.getElementsByTagName('table')[0];
    for (let i = 0, length = users.length; i < length; i++) {
        const row = document.createElement('tr');
        const col1 = document.createElement('td');
        const player = users.key(i);
        col1.innerHTML = player;
        const col2 = document.createElement('td');
        col2.innerHTML = users.getItem(player);
        row.appendChild(col1);
        row.appendChild(col2);
        table.appendChild(row);
    }
}

function enableGrid() {
    gridElements.map(square => square.firstChild.disabled = false);
}

function disableGrid() {
    gridElements.map(square => square.firstChild.disabled = true);
}

/**
 * Initializes all variables that manipulate the DOM
 */
function initHTMLVariables () {
    gridContainerHTML = document.querySelector('.grid-container');
    playButtonHTML = document.querySelector('.play-btn');
    timerHTML = document.querySelector('#timer');
    firstScreenContainerHTML = document.querySelector('.first-screen-container');
    secondScreenContainerHTML = document.querySelector('.second-screen-container');
    addPlayerButtonHTML = document.querySelector('.add-player-btn');
    playerNameInputHTML = document.querySelector('.player-name-input');
    playButtonHTML.onclick = playButtonClickHandler;
    addPlayerButtonHTML.onclick = addPlayerButtonClickHandler;
}

document.addEventListener("DOMContentLoaded", function (event) {
    initHTMLVariables();
    buildScoresTable();
    createGrid(rows, cols);
});
