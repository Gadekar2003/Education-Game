const links = document.querySelectorAll('.tab-link');
const sections = document.querySelectorAll('.content-section');
const logoutBtn = document.getElementById('logoutBtn');
const darkToggle = document.getElementById('darkToggle');

// TAB SWITCHING
links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    links.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    const pageId=this.dataset.tab;
    showPage(pageId);
    // sections.forEach(section => section.classList.remove('active'));
    // document.getElementById(this.dataset.tab).classList.add('active');
  });
});

// LOGOUT FUNCTIONALITY
logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = "home.html"; // Redirect to home page
});
// quiz section 
function fetchQuizzes(){
  fetch('quizdata.json')
  .then(response=>response.json())
  .then(data=>{
    const quizContainer=document.getElementById('quiz-container');
    quizContainer.innerHTML='';
    data.forEach(quiz=>{
      const card=document.createElement('div');
      card.className='quiz-card';
      card.innerHTML=`
      <h3>${quiz.title}</h3>
      <p>Subject:${quiz.subject}</p>
      <p>Difficulty:${quiz.difficulty}</p>
      <button onclick="startQuiz('${quiz.title}')">Start Quiz</button>
      `;
      console.log(quiz)
      quizContainer.appendChild(card);
    });
  })
  .catch(error=>{
    console.error('Error fetching quiz data:',error);
  });
}
//call this when 'Quiz' page is selected
function showPage(pageId){
  const pages=document.querySelectorAll(".page");
  pages.forEach((page)=>page.style.display="none");
  const selectedPage=document.getElementById(`page-${pageId}`);
  if(selectedPage){
    selectedPage.style.display
    ="block";
    if(pageId=='quiz'){
      fetchQuizzes();
    }
  }
}
//add quiz questions
function startQuiz(title) {
  const quizSection = document.getElementById('quiz-section');
  const quizTitle = document.getElementById('quiz-title');
  const quizQuestions = document.getElementById('quiz-questions');

  // Show quiz section
  document.getElementById('page-quiz').style.display = 'none';
  quizSection.style.display = 'block';

  quizTitle.textContent = `Quiz: ${title}`;
  quizQuestions.innerHTML = '';

  fetch('quizquestions.json')
    .then(res => res.json())
    .then(data => {
      const questions = data[title];
      let score = 0;
      let total = questions.length;

      questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');

        const optionsHTML = q.options.map(opt => `
          <button class="option-btn" data-answer="${q.answer}" data-selected="${opt}">
            ${opt}
          </button>
        `).join('');

        questionDiv.innerHTML = `
          <p><strong>Q${index + 1}:</strong> ${q.question}</p>
          <div class="options">${optionsHTML}</div>
          <hr/>
        `;

        quizQuestions.appendChild(questionDiv);
      });

      // Add submit button
      const submitBtn = document.createElement('button');
      submitBtn.textContent = 'Submit Quiz';
      submitBtn.classList.add('submit-btn');
      quizQuestions.appendChild(submitBtn);

      // Handle answer selection
      quizQuestions.addEventListener('click', function (e) {
        if (e.target.classList.contains('option-btn')) {
          const parent = e.target.parentNode;
          const allOptions = parent.querySelectorAll('.option-btn');

          allOptions.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.selected === btn.dataset.answer) {
              btn.style.backgroundColor = '#28a745'; // green
              btn.style.color = 'white';
            } else {
              btn.style.backgroundColor = '#dc3545'; // red
              btn.style.color = 'white';
            }
          });

          // Increase score if correct
          if (e.target.dataset.selected === e.target.dataset.answer) {
            score++;
          }
        }
      });

      // Handle quiz submission
      submitBtn.addEventListener('click', () => {
        alert(`🎉 Quiz Completed!\nYou scored ${score} out of ${total}`);
        location.reload(); // reloads dashboard
      });
    });
}


// DARK MODE TOGGLE
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
