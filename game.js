const wordLists = {

    animals: [
        "TIGER",
        "MONKEY",
        "ELEPHANT",
        "GIRAFFE",
        "LION",
        "RABBIT",
        "ZEBRA",
        "PANDA"
    ],

    food: [
        "PIZZA",
        "BURGER",
        "NOODLES",
        "SANDWICH",
        "BIRYANI",
        "PASTA",
        "PANEER",
        "CHOCOLATE"
    ],

    movies: [
        "AVATAR",
        "TITANIC",
        "FROZEN",
        "INCEPTION",
        "JOKER",
        "DUNE",
        "GLADIATOR",
        "BATMAN"
    ],

    countries: [
        "INDIA",
        "CANADA",
        "JAPAN",
        "FRANCE",
        "GERMANY",
        "BRAZIL",
        "AUSTRALIA",
        "ITALY"
    ],

    technology: [
        "LAPTOP",
        "ROBOT",
        "INTERNET",
        "KEYBOARD",
        "SOFTWARE",
        "MOBILE",
        "CODING",
        "SERVER"
    ],

    sports: [
        "CRICKET",
        "FOOTBALL",
        "TENNIS",
        "HOCKEY",
        "BOXING",
        "BADMINTON",
        "BASEBALL",
        "VOLLEYBALL"
    ]

};


const params = new URLSearchParams(window.location.search);

let category = params.get("category") || "animals";

let words = wordLists[category] || wordLists.animals;

let selectedWord =
    words[Math.floor(Math.random() * words.length)];


let guessedLetters = [];
let wrongAttempts = 0;
let score = 0;
let timeLeft = 45;
let gameOver = false;


const wordDisplay = document.querySelector(".word");
const keyboard = document.querySelector(".keyboard");

const statBoxes = document.querySelectorAll(".stat strong");

const attemptsDisplay = statBoxes[0];
const scoreDisplay = statBoxes[1];
const timeDisplay = statBoxes[2];

const categoryLabel = document.querySelector(".category-label");


const hangmanParts = [

    document.querySelector(".head"),
    document.querySelector(".body"),
    document.querySelector(".arm-left"),
    document.querySelector(".arm-right"),
    document.querySelector(".leg-left"),
    document.querySelector(".leg-right")

];


hangmanParts.forEach(part => {

    part.style.visibility = "hidden";

});


const categoryNames = {

    animals: "ANIMALS",
    food: "FOOD",
    movies: "MOVIES",
    countries: "COUNTRIES",
    technology: "TECHNOLOGY",
    sports: "SPORTS"

};


categoryLabel.textContent =
    "CATEGORY: " + categoryNames[category];


function displayWord() {

    let display = "";

    for (let letter of selectedWord) {

        if (guessedLetters.includes(letter)) {

            display += letter + " ";

        } else {

            display += "_ ";

        }

    }

    wordDisplay.textContent = display.trim();

}


function updateStats() {

    attemptsDisplay.textContent =
        `${wrongAttempts} / 6`;

    scoreDisplay.textContent =
        score;

    timeDisplay.textContent =
        `${timeLeft}s`;

}


function handleGuess(letter, button) {

    if (gameOver) {
        return;
    }

    if (guessedLetters.includes(letter)) {
        return;
    }

    guessedLetters.push(letter);

    button.disabled = true;


    if (selectedWord.includes(letter)) {

        button.style.opacity = "0.5";

        score += 20;

        displayWord();

        updateStats();

        checkWin();

    } else {

        button.style.opacity = "0.5";

        button.style.textDecoration =
            "line-through";

        wrongAttempts++;


        if (wrongAttempts <= 6) {

            hangmanParts[
                wrongAttempts - 1
            ].style.visibility = "visible";

        }


        updateStats();

        checkLose();

    }

}


function checkWin() {

    let won = true;


    for (let letter of selectedWord) {

        if (!guessedLetters.includes(letter)) {

            won = false;

            break;

        }

    }


    if (won) {

        gameOver = true;

        localStorage.setItem(
            "gameResult",
            "You Won!"
        );

        localStorage.setItem(
            "gameWord",
            selectedWord
        );

        localStorage.setItem(
            "gameScore",
            score
        );


        setTimeout(() => {

            window.location.href =
                "result.html";

        }, 1000);

    }

}


function checkLose() {

    if (wrongAttempts >= 6) {

        gameOver = true;

        localStorage.setItem(
            "gameResult",
            "Game Over"
        );

        localStorage.setItem(
            "gameWord",
            selectedWord
        );

        localStorage.setItem(
            "gameScore",
            score
        );


        setTimeout(() => {

            window.location.href =
                "result.html";

        }, 1000);

    }

}


function startTimer() {

    const timer = setInterval(() => {

        if (gameOver) {

            clearInterval(timer);

            return;

        }


        timeLeft--;

        updateStats();


        if (timeLeft <= 0) {

            clearInterval(timer);

            gameOver = true;


            localStorage.setItem(
                "gameResult",
                "Time Up!"
            );

            localStorage.setItem(
                "gameWord",
                selectedWord
            );

            localStorage.setItem(
                "gameScore",
                score
            );


            setTimeout(() => {

                window.location.href =
                    "result.html";

            }, 500);

        }

    }, 1000);

}


document.querySelectorAll(".key").forEach(button => {

    button.addEventListener("click", () => {

        const letter =
            button.textContent.trim();

        handleGuess(letter, button);

    });

});


displayWord();

updateStats();

startTimer();