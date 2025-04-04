// select elements
const chosenOption = document.querySelector(".control_container .chosen_option"),
      chosenWords = document.querySelector(".control_container .chosen_words"),
      chosenTimer = document.querySelector(".control_container .chosen_timer"),
      optionsBox = document.querySelector(".control_container .options_box"),
      optionsList = document.querySelector(".control_container .options_list");
const timer = document.querySelector(".info_container .timer"),
      currentWordNumb = document.querySelector(".info_container .current_word_numb"),
      totalWordsNumb = document.querySelector(".info_container .total_words_numb");
const startGameBtn = document.querySelector(".start_container .start_game_btn"),
      currentWord = document.querySelector(".start_container .current_word");
const mainInput = document.querySelector(".input_container .main_input");
const text = document.querySelector(".words_container .text"),
      wordsBox = document.querySelector(".words_container .words_box");
const resultContainer = document.querySelector(".result_container"),
      result = document.querySelector(".result_container .result"),
      resetBtn = document.querySelector(".result_container .reset_btn");


// array of levels
let levels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard", "Difficult", "Very Difficult", "Impossible", "Mixed"];
// the chosen duration time for timer
let timerNumb;
// the chosen array of words
let words = [];
// setInterval function
let setIntervalTimer;

// empty the input on load
mainInput.value = "";

// handle chosenOption select
chosenOption.addEventListener("click", _ => {
  optionsBox.classList.toggle("active_options_box");
});

// unactive optionsBox when click anywhere out of the box
document.addEventListener("click", e => {
  // if the clicked target not one of those three elements unactive the optionsBox
  if (!e.target.classList.contains("options_box") &&
      !e.target.classList.contains("chosen_option") &&
      !e.target.classList.contains("options_title")) {
    optionsBox.classList.remove("active_options_box");
  };
});

createLvlOption();
function createLvlOption() {
  // create option item (levels)
  for (let i = 0; i < levels.length; i++) {
    // create li item, add class, add content, print it on the page
    const optionItem = document.createElement("li");
    optionItem.classList.add("option_item");
    optionItem.setAttribute("data-level", levels[i]);
    optionItem.innerHTML = levels[i];
    optionsList.appendChild(optionItem);
  };
  clickLvlOption();
};

function clickLvlOption() {
  // make array from optionItem
  const optionItems = Array.from(document.querySelectorAll(".control_container .option_item"));

  // as defult active the first option and print it
  optionItems[0].classList.add("active_option_item");
  chosenOption.innerHTML = optionItems[0].getAttribute("data-level");

  chosenArray(optionItems[0].getAttribute("data-level"));

  // add click event on all option items
  optionItems.forEach(item => {
    item.addEventListener("click", e => {
      // unactive all option items
      optionItems.forEach(option => {
        option.classList.remove("active_option_item");
      });

      // active the clicked option and print it
      e.target.classList.add("active_option_item");
      chosenOption.innerHTML = e.target.getAttribute("data-level");

      // empty words array before print the new words
      words = [];

      chosenArray(e.target.getAttribute("data-level"));
    });
  });
};

// choose game info depends on level
function chosenArray(level) {
  // number of words that will print depends on chosen level
  let wordsNumb;
  if (level === "Very Easy") { // 3
    timerNumb = 3;
    wordsNumb = 10;
    getData(level, wordsNumb);
  } else if (level === "Easy") { // 5
    timerNumb = 3;
    wordsNumb = 20;
    getData(level, wordsNumb);
  } else if (level === "Medium") { // 7
    timerNumb = 4;
    wordsNumb = 30;
    getData(level, wordsNumb);
  } else if (level === "Hard") { // 9
    timerNumb = 5;
    wordsNumb = 40;
    getData(level, wordsNumb);
  } else if (level === "Very Hard") { // 11
    timerNumb = 5;
    wordsNumb = 50;
    getData(level, wordsNumb);
  } else if (level === "Difficult") { // 13
    timerNumb = 6;
    wordsNumb = 60;
    getData(level, wordsNumb);
  } else if (level === "Very Difficult") { // 15
    timerNumb = 6;
    wordsNumb = 70;
    getData(level, wordsNumb);
  } else if (level === "Impossible") { // 17
    timerNumb = 7;
    wordsNumb = 80;
    getData(level, wordsNumb);
  } else if (level === "Mixed") { // all (2 => 25)
    timerNumb = 5;
    wordsNumb = 100;
    getData(level, wordsNumb);
  }
};

// get words from json file
async function getData(level, wordsNumb) {
  try {
    let response = await fetch("../data/words.json");
    let data = await response.json();
    // get the array depends on chosen level
    let dataLevel = data[level];
    
    // put the unrepeated random numbers in it
    let randomNumbs = [];
    // repeat the loop depends on number of words that need to print
    for (let i = 0; i < wordsNumb; i++) {
      random();
      function random() {
        // get random number from chosen array
        let randomNumb = Math.floor(Math.random() * dataLevel.length);
        // check if this random number already exist or not
        if (!randomNumbs.includes(randomNumb)) { // if not
          // put it in the array
          randomNumbs.push(randomNumb);
          // get the word that own this index
          let randomWord = dataLevel[randomNumb];
          // put this word in the words array
          words.push(randomWord);
        } else { // if yes
          // run the function again until get new number
          random();
        };
      };
    };
    controlInfo();
  } catch (error) {
    startGameBtn.classList.remove("active_start_game_btn");
    console.log(error);
  };
};

// print the chosen info in the control_container
function controlInfo() {
  chosenWords.innerHTML = words.length;
  chosenTimer.innerHTML = timerNumb;
};

startGameBtn.addEventListener("click", _ => {
  createGame();
});

// the current word number
let currentIndex = 0;

function createGame() {
  // unactive chosenOption button
  chosenOption.classList.remove("active_chosen_option");

  // print numb of words and current index in info container
  totalWordsNumb.innerHTML = words.length;
  currentWordNumb.innerHTML = currentIndex;

  // unactive text
  text.classList.remove("active_text");

  printWords();

  // unactive start button, show first word
  startGameBtn.classList.remove("active_start_game_btn");
  currentWord.classList.add("active_current_word");

  // print first word
  currentWord.innerHTML = words[currentIndex];

  // make array from printed words
  const printedWords = Array.from(document.querySelectorAll(".words_container .word"));
  
  // active the current word
  printedWords[currentIndex].classList.add("active_word");

  // active main input, focus on it
  mainInput.classList.add("active_main_input");
  mainInput.focus();

  downTimer();

  // add input event while writing
  mainInput.addEventListener("input", _ => {
    // when input value = current word
    if (mainInput.value === words[currentIndex]) {
      // empty the input
      mainInput.value = "";
      // hide the finished word
      printedWords[currentIndex].classList.add("hide_word");
      // add 1 for current index
      currentIndex++;
      // print the new index
      currentWordNumb.innerHTML = currentIndex;
      
      // check if player won
      if (currentIndex === words.length) {
        // empty currentWord box
        currentWord.innerHTML = "";
        // unactive input
        mainInput.classList.remove("active_main_input");
        // unfocus input
        mainInput.blur();
        // active result
        resultContainer.classList.add("active_result_container");
        // winning data
        result.classList.add("result_won_clr");
        result.innerHTML = `Congratz`;
        // stop timer
        clearInterval(setIntervalTimer);
      } else {
        // print the new word
        currentWord.innerHTML = words[currentIndex];
        // active the new word
        printedWords[currentIndex].classList.add("active_word");
        // reset timer
        clearInterval(setIntervalTimer);
        downTimer();
      };
    };
  });
};

function printWords() {
  for (let i = 0; i < words.length; i++) {
    // create span, print word
    const word = document.createElement("span");
    word.classList.add("word");
    word.innerHTML = words[i];
    wordsBox.appendChild(word);
  };
};

function downTimer() {
  // set start timer number and print it
  let counterTimer = timerNumb;
  timer.innerHTML = counterTimer;

  setIntervalTimer = setInterval(() => {
    // -1 the timer every 1s and print it
    counterTimer--;
    timer.innerHTML = counterTimer;
    // check if player lost
    if (counterTimer === 0) {
      // unactive input
      mainInput.classList.remove("active_main_input");
      // unfocus input
      mainInput.blur();
      // active result
      resultContainer.classList.add("active_result_container");
      // lossing data
      result.classList.add("result_lost_clr");
      result.innerHTML = `Game Over`;
      // stop timer
      clearInterval(setIntervalTimer);
    };
  }, 1000);
};

// reload the page
resetBtn.addEventListener("click", _ => {
  location.reload();
});



/* ===== close console ===== */
closeConsole();
function closeConsole() {
  const stopMsg = document.querySelector(".stop_msg");

  // stop mouse right click
  document.addEventListener("contextmenu", e => {
    stopMsgConsole(e);
  });
  // stop F12
  document.addEventListener("keydown", e => {
    stopConsole(e);
  });
  document.addEventListener("keyup", e => {
    stopConsole(e);
  });
  
  // stop F12 key from work
  function stopConsole(e) {
    if (e.key === "F12") {
      stopMsgConsole(e);
    };
  };
  
  function stopMsgConsole(e) {
    e.preventDefault();
    stopMsg.classList.add("active_stop_msg");
    setTimeout(() => {
      stopMsg.classList.remove("active_stop_msg");
    }, 1000);
  };
};
/* ===== close console ===== */
