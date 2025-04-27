import { database } from "./firebase.js";
import {
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

const links = document.querySelectorAll(".tab-link");
const logoutBtn = document.getElementById("logoutBtn");
const darkToggle = document.getElementById("darkToggle");

let score = 0;
let rewards = [];
let questions = [];

// TAB SWITCHING
links.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    links.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");

    const pageId = this.dataset.tab;
    showPage(pageId);
  });
});

// LOGOUT
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// DARK MODE
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".sidebar").classList.toggle("dark-mode");
  document
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.toggle("dark-mode"));
});

// SHOW PAGE FUNCTION
function showPage(pageId) {
  const contentSections = document.querySelectorAll(".content-section");
  const pages = document.querySelectorAll(".page");

  contentSections.forEach((section) => section.classList.remove("active"));
  pages.forEach((page) => (page.style.display = "none"));

  if (pageId === "quiz") {
    document.getElementById("page-quiz").style.display = "block";
    fetchQuizzes();
  } else {
    const targetSection = document.getElementById(pageId);
    if (targetSection) {

      targetSection.classList.add("active");
      targetSection.style.display="block";
    }
  }

  document.getElementById("quiz-section").style.display = "none";
}

// FETCH QUIZZES
function fetchQuizzes() {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "<p>Loading quizzes...</p>";

  fetch("quizdata.json")
    .then((response) => response.json())
    .then((data) => {
      quizContainer.innerHTML = "";
      if (data.length === 0) {
        quizContainer.innerHTML = "<p>No quizzes available right now.</p>";
        return;
      }

      data.forEach((quiz) => {
        const card = document.createElement("div");
        card.className = "quiz-card";
        card.innerHTML = `
          <h3>${quiz.title}</h3>
          <p>Subject: ${quiz.subject}</p>
          <p>Difficulty: ${quiz.difficulty}</p>
        `;

        const startButton = document.createElement("button");
        startButton.textContent = "Start Quiz";
        startButton.addEventListener("click", () => startQuiz(quiz.title));

        card.appendChild(startButton);
        quizContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching quiz data:", error);
      quizContainer.innerHTML =
        "<p>Error loading quizzes. Please try again later.</p>";
    });
}

// START QUIZ
function startQuiz(title) {
  score = 0;
  rewards = [];

  const quizSection = document.getElementById("quiz-section");
  const quizTitle = document.getElementById("quiz-title");
  const quizQuestions = document.getElementById("quiz-questions");

  document.getElementById("page-quiz").style.display = "none";
  quizSection.style.display = "block";

  quizTitle.textContent = `Quiz: ${title}`;
  quizQuestions.innerHTML = "<p>Loading questions...</p>";

  fetch("quizquestions.json")
    .then((res) => res.json())
    .then((data) => {
      questions = data[title];
      if (!questions || questions.length === 0) {
        quizQuestions.innerHTML = "<p>No questions found for this quiz.</p>";
        return;
      }

      let currentQuestionIndex = 0;
      showQuestion(currentQuestionIndex);

      function showQuestion(index) {
        quizQuestions.innerHTML = "";

        let questionTimer = 10;
        let questionInterval;

        const q = questions[index];
        const questionDiv = document.createElement("div");
        questionDiv.className = "quiz-card";

        const optionsHTML = q.options
          .map(
            (opt) => `
          <button class="option-btn" data-answer="${q.answer}" data-selected="${opt}">
            ${opt}
          </button>`
          )
          .join("");

        questionDiv.innerHTML = `
          <p><strong>Q${index + 1}:</strong> ${q.question}</p>
          <div class="options">${optionsHTML}</div>
          <div class="timer">Time Left: <span id="time-left">${questionTimer}</span>s</div>
        `;

        quizQuestions.appendChild(questionDiv);

        const nextBtn = document.createElement("button");
        nextBtn.textContent =
          index === questions.length - 1 ? "Submit Quiz" : "Next";
        nextBtn.className = "submit-btn";
        nextBtn.disabled = true;
        quizQuestions.appendChild(nextBtn);

        const optionButtons = questionDiv.querySelectorAll(".option-btn");
        let answered = false;

        optionButtons.forEach((btn) => {
          btn.addEventListener("click", function () {
            if (answered) return;
            answered = true;
            clearInterval(questionInterval);

            optionButtons.forEach((opt) => {
              opt.disabled = true;
              opt.classList.add(
                opt.dataset.selected === opt.dataset.answer
                  ? "correct"
                  : "incorrect"
              );
            });

            if (this.dataset.selected === this.dataset.answer) {
              score++;
            }

            nextBtn.disabled = false;
          });
        });

        nextBtn.addEventListener(
          "click",
          () => {
            clearInterval(questionInterval);
            if (currentQuestionIndex < questions.length - 1) {
              currentQuestionIndex++;
              showQuestion(currentQuestionIndex);
            } else {
              showResults();
            }
          },
          { once: true }
        );

        function startTimer() {
          const timeLeftDisplay = document.getElementById("time-left");
          questionInterval = setInterval(() => {
            questionTimer--;
            timeLeftDisplay.textContent = questionTimer;
            if (questionTimer <= 0) {
              clearInterval(questionInterval);
              autoSubmitAnswer();
            }
          }, 1000);
        }

        function autoSubmitAnswer() {
          optionButtons.forEach((btn) => {
            btn.disabled = true;
            btn.classList.add(
              btn.dataset.selected === btn.dataset.answer
                ? "correct"
                : "incorrect"
            );
          });
          nextBtn.disabled = false;
        }

        startTimer();
      }
    });
}

// SHOW RESULTS
function showResults() {
  let feedback = "";
  if (score === questions.length) {
    rewards.push("🏆 Perfect Score Trophy");
    feedback = "Outstanding! You got all the questions right!";
  } else if (score >= questions.length * 0.7) {
    rewards.push("🏅 Gold Star");
    feedback = "Great job! You performed really well.";
  } else if (score >= questions.length * 0.5) {
    rewards.push("🥈 Silver Star");
    feedback = "Good effort! Keep practicing to improve";
  } else {
    rewards.push("🥉 Participation Badge");
    feedback = "Don't give up! Pratice makes perfect.";
  }

  const userId = localStorage.getItem("userID") || "guest";
  const timestamp = Date.now();

  set(ref(database, `scores/${userId}/${timestamp}`), {
    score: score,
    totalQuestions: questions.length,
    feedback: feedback,
    time: new Date().toLocaleString(),
  })
    .then(() => {
      console.log("Score  and feedback saved successfully to Firebase!");
      displayScores(true);
    })
    .catch((error) => {
      console.error("Error saving score:", error);
      alert("Error saving score. Please try again.");
    });
}

// DISPLAY SCORES
function displayScores(showReward = false) {
  const userId = localStorage.getItem("userID") || "guest";
  const scoreSection = document.getElementById("score");
  const allSections = document.querySelectorAll(".content-section, .page");

  allSections.forEach((section) => {
    section.classList.remove("active");
    section.style.display = "none";
  });

  scoreSection.classList.add("active");
  scoreSection.style.display = "block";

  scoreSection.innerHTML = `
    <h1>Scoreboard</h1>
    <div id="score-list">
      <p>Loading your scores...</p>
    </div>
  `;

  get(ref(database, `scores/${userId}`))
    .then((snapshot) => {
      const scoreList = document.getElementById("score-list");
      scoreList.innerHTML = "";

      if (snapshot.exists()) {
        const scores = snapshot.val();
        const entries = Object.entries(scores).sort((a, b) => b[0] - a[0]);

        entries.forEach(([timestamp, data], index) => {
          const scoreItem = document.createElement("div");
          scoreItem.className = "score-entry";
          scoreItem.innerHTML = `
            <p><strong>Attempt ${index + 1}:</strong></p>
            <p>Score: ${data.score} / ${data.totalQuestions}</p>
            <p>Feedback:${data.feedback || "No feedback available"}</p>
            <p>Time: ${data.time}</p>
            <hr/>
          `;
          scoreList.appendChild(scoreItem);
        });

        if (showReward && rewards.length > 0) {
          const rewardMsg = document.createElement("div");
          rewardMsg.innerHTML = `
            <h3>🏅 Reward Earned: ${rewards.join(", ")}</h3>
            <button id="play-again" class="submit-btn">Play Again</button>
          `;
          scoreList.appendChild(rewardMsg);

          document
            .getElementById("play-again")
            .addEventListener("click", () => {
              rewards = [];
              score = 0;
              showPage("quiz");
            });
        }
      } else {
        scoreList.innerHTML = "<p>No quiz attempts found yet!</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching scores:", error);
      document.getElementById("score-list").innerHTML =
        "<p>Error loading scores. Please try again.</p>";
    });
}
displayScores();
