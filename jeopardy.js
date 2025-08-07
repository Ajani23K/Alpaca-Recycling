const questions = {
    Recycling: {
        100: {
            question: "What is the most commonly recycled material?",
            options: ["Plastic", "Aluminum", "Glass", "Paper"],
            correct: "Aluminum"
        },
        200: {
            question: "What symbol represents recycling?",
            options: ["Circle", "Triangle", "Star", "Square"],
            correct: "Triangle"
        },
        300: {
            question: "Name a benefit of recycling aluminum.",
            options: ["It can be reused infinitely", "It's biodegradable", "It turns into paper", "It requires no energy"],
            correct: "It can be reused infinitely"
        },
        400: {
            question: "Which number plastic is most commonly accepted in recycling programs?",
            options: ["#1", "#2", "#5", "#7"],
            correct: "#1"
        }
    },
    Enviornment: {
        100: {
            question: "What gas do trees absorb?",
            options: ["Oxygen", "Carbon Dioxide", "Methane", "Nitrogen"],
            correct: "Carbon Dioxide"
        },
        200: {
            question: "Name one effect of climate change.",
            options: ["Increased snowfall", "Melting ice caps", "Fewer clouds", "More trees"],
            correct: "Melting ice caps"
        },
        300: {
            question: "What is the ozone layer?",
            options: ["A layer of rock", "A protective atmospheric layer", "A wind belt", "A water layer"],
            correct: "A protective atmospheric layer"
        },
        400: {
            question: "What is the main cause of deforestation?",
            options: ["Tree planting", "Logging and agriculture", "Urban gardening", "Volcanoes"],
            correct: "Logging and agriculture"
        }
    },
    History: {
        100: {
            question: "Who invented the first recycling program?",
            options: ["USA", "Germany", "India", "Canada"],
            correct: "USA"
        },
        200: {
            question: "In what year did Earth Day start?",
            options: ["1990", "1970", "2000", "1960"],
            correct: "1970"
        },
        300: {
            question: "What ancient civilization reused broken pottery?",
            options: ["Romans", "Egyptians", "Chinese", "Greeks"],
            correct: "Romans"
        },
        400: {
            question: "When did plastic recycling begin in the US?",
            options: ["1995", "1980", "1975", "1965"],
            correct: "1980"
        }
    }
};

let score = 0;

document.addEventListener("DOMContentLoaded", function () {
    const state = document.getElementById("questionstate");
    const questionText = document.getElementById("questionText");
    const answerButtons = document.getElementById("answerbtns");
    const feedback = document.getElementById("feedback");
    const closeButton = document.querySelector(".closebtn");
    const buttons = document.querySelectorAll(".clue");
    const scoreboard = document.getElementById("score");

    const categories = ["Recycling", "Enviornment", "History"];

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const value = button.getAttribute("data-value");
            const col = index % 3;
            const category = categories[col];
            const questionData = questions[category][value];

            if (!questionData) {
                questionText.textContent = "Question not found.";
                return;
            }

            // Reset state
            questionText.textContent = questionData.question;
            feedback.textContent = "";
            answerButtons.innerHTML = "";
            

            // Shuffle answer options
            const shuffled = [...questionData.options].sort(() => 0.5 - Math.random());

            shuffled.forEach(option => {
                const btn = document.createElement("button");
                btn.classList.add("answer-btn");
                btn.textContent = option;
                btn.addEventListener("click", () => {
                    if (option === questionData.correct) {
                        feedback.textContent = "✅ Correct!";
                        feedback.style.color = "green";
                       
                        score = score + parseInt(value);
                    } else {
                        feedback.textContent = `❌ Incorrect! Correct answer: ${questionData.correct}`;
                        feedback.style.color = "red";

                        score = score - parseInt(value);
                    }
                    // Disable all buttons
                    const all = document.querySelectorAll(".answer-btn");
                    all.forEach(b => b.disabled = true);
                    scoreboard.textContent = score;
                    button.style.visibility = "hidden";
                });
                answerButtons.appendChild(btn);
            });

            state.style.display = "block";
        });
    });

    closeButton.addEventListener("click", () => {
        state.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === state) {
            state.style.display = "none";
        }
    });
});
