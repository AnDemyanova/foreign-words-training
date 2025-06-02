const words = [
    { foreign: 'apple', translation: 'яблоко', example: 'I eat an apple every day.' },
    { foreign: 'banana', translation: 'банан', example: 'Bananas are rich in potassium.' },
    { foreign: 'orange', translation: 'апельсин', example: 'She likes orange juice.' },
    { foreign: 'grape', translation: 'виноград', example: 'Grapes can be fermented to make wine.' },
    { foreign: 'pear', translation: 'груша', example: 'Pears are sweet and juicy.' },
    { foreign: 'peach', translation: 'персик', example: 'Peaches are my favorite fruit.' }
];

let currentIndex = 0;


const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const currentWordDisplay = document.getElementById('current-word');
const totalWordDisplay = document.getElementById('total-word');
const nextButton = document.getElementById('next');
const backButton = document.getElementById('back');
const shuffleButton = document.getElementById('shuffle-words');
const flipCard = document.querySelector('.flip-card');
const examButton = document.getElementById('exam');
const examCardsContainer = document.getElementById('exam-cards');


totalWordDisplay.textContent = words.length;


function displayCard() {
    const word = words[currentIndex];
    cardFront.querySelector('h1').textContent = word.foreign;
    cardBack.querySelector('h1').textContent = word.translation;
    cardBack.querySelector('span').textContent = word.example;
    currentWordDisplay.textContent = currentIndex + 1;


    backButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === words.length - 1;
}


flipCard.addEventListener('click', () => {
    flipCard.classList.toggle('active');
});


shuffleButton.addEventListener('click', () => {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    currentIndex = 0;
    displayCard();
});


nextButton.addEventListener('click', () => {
    if (currentIndex < words.length - 1) {
        currentIndex++;
        flipCard.classList.remove('active');
        displayCard();
    }
});


backButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        flipCard.classList.remove('active');
        displayCard();
    }
});


displayCard();


let isExamMode = false;
let selectedCards = [];

examButton.addEventListener('click', () => {
    isExamMode = true;
    currentIndex = 0;
    currentWordDisplay.textContent = '';
    totalWordDisplay.textContent = '';
    document.getElementById('study-mode').classList.add('hidden');
    document.getElementById('exam-mode').classList.remove('hidden');
    startExam();
});

function startExam() {
    let shuffledWords = [...words];
    shuffledWords = shuffleArray(shuffledWords);
    examCardsContainer.innerHTML = '';

    shuffledWords.forEach((word) => {
        createCard(word.foreign, 'foreign');
        createCard(word.translation, 'translation');
    });

    addCardClickHandlers();
}

function createCard(text, type) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = text;
    card.dataset.type = type;
    examCardsContainer.appendChild(card);
}

function addCardClickHandlers() {
    const cards = document.querySelectorAll('#exam-cards .card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            handleCardClick(card);
        });
    });
}

function handleCardClick(card) {

    if (selectedCards.length >= 2) return;


    selectedCards.push(card);


    if (selectedCards.length === 1) {
        card.classList.add('correct');
    }


    if (selectedCards.length === 2) {
        const [firstCard, secondCard] = selectedCards;

        const firstType = firstCard.dataset.type;
        const secondType = secondCard.dataset.type;


        const foreignWord = firstType === 'foreign' ? firstCard.textContent : secondCard.textContent;
        const translationWord = firstType === 'translation' ? firstCard.textContent : secondCard.textContent;


        const matched = words.find(word => word.foreign === foreignWord && word.translation === translationWord);

        if (matched) {

            firstCard.classList.add('fade-out');
            secondCard.classList.add('fade-out');
            selectedCards = [];


            setTimeout(() => {
                if (document.querySelectorAll('.card:not(.fade-out)').length === 0) {
                    alert('Поздравляю! Тестирование завершено.');
                    resetExam();
                }
            }, 500);
        } else {

            secondCard.classList.add('wrong');
            setTimeout(() => {
                secondCard.classList.remove('wrong');
                selectedCards = [firstCard];
            }, 1000);
        }
    }
}

function resetExam() {
    isExamMode = false;
    selectedCards = [];
    document.getElementById('exam-mode').classList.add('hidden');
    document.getElementById('study-mode').classList.remove('hidden');
    examCardsContainer.innerHTML = '';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}