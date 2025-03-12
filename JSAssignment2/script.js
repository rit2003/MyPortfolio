 let questions = [], currentQuestionIndex = 0, score = 0, timer;
        const questionElement = document.getElementById("question");
        const optionsElement = document.getElementById("options");
        const timerElement = document.getElementById("timer");
        const feedbackElement = document.getElementById("feedback");
        const scoreElement = document.getElementById("score");

        function startGame() {
            const category = document.getElementById("category").value;
            const difficulty = document.getElementById("difficulty").value;
            fetch(`https://opentdb.com/api.php?amount=20&category=${category}&difficulty=${difficulty}&type=multiple`)
                .then(response => response.json())
                .then(data => {
                    questions = data.results;
                    document.getElementById("start-screen").style.display = "none";
                    document.getElementById("quiz-screen").style.display = "block";
                    showQuestion();
                });
        }

        function showQuestion() {
            if (currentQuestionIndex >= questions.length) {
                endGame();
                return;
            }

            clearTimeout(timer);
            const questionData = questions[currentQuestionIndex];
            questionElement.innerHTML = questionData.question;
            optionsElement.innerHTML = "";
            feedbackElement.innerHTML = "";

            let answers = [...questionData.incorrect_answers, questionData.correct_answer];
            answers.sort(() => Math.random() - 0.5);

            answers.forEach(answer => {
                const button = document.createElement("button");
                button.innerHTML = answer;
                button.onclick = () => checkAnswer(answer, questionData.correct_answer, button);
                optionsElement.appendChild(button);
            });

            startTimer();
        }

        function startTimer() {
            let timeLeft = 15;
            timerElement.innerHTML = `Time Left: ${timeLeft}s`;
            timer = setInterval(() => {
                timeLeft--;
                timerElement.innerHTML = `Time Left: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    showCorrectAnswer();
                }
            }, 1000);
        }

        function checkAnswer(selected, correct, button) {
            clearInterval(timer);
            if (selected === correct) {
                score++;
                button.classList.add("correct");
                feedbackElement.innerHTML = "Correct!";
            } else {
                button.classList.add("incorrect");
                feedbackElement.innerHTML = `Incorrect! The correct answer was: ${correct}`;
            }
            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion();
            }, 2000);
        }

        function showCorrectAnswer() {
            feedbackElement.innerHTML = `Time's up! The correct answer was: ${questions[currentQuestionIndex].correct_answer}`;
            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion();
            }, 2000);
        }

        function endGame() {
            document.getElementById("quiz-screen").style.display = "none";
            document.getElementById("end-screen").style.display = "block";
            scoreElement.innerHTML = score;
        }