class DKSLQuizApp {
    constructor() {
        this.currentTopic = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, incorrect: 0 };
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.selectedTopicId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.showTopicSelection();
    }

    initializeElements() {
        // Containers
        this.topicSelection = document.getElementById('topicSelection');
        this.quizContainer = document.getElementById('quizContainer');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.feedbackModal = document.getElementById('feedbackModal');
        
        // Topic Selection
        this.topicsGrid = document.getElementById('topicsGrid');
        this.startAllTopics = document.getElementById('startAllTopics');
        this.startSelectedTopic = document.getElementById('startSelectedTopic');
        
        // Quiz Elements
        this.currentTopicSpan = document.getElementById('currentTopic');
        this.questionCounter = document.getElementById('questionCounter');
        this.progressFill = document.getElementById('progressFill');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.questionText = document.getElementById('questionText');
        this.answersContainer = document.getElementById('answersContainer');
        this.backToTopics = document.getElementById('backToTopics');
        this.nextQuestion = document.getElementById('nextQuestion');
        
        // Feedback Modal
        this.feedbackIcon = document.getElementById('feedbackIcon');
        this.feedbackText = document.getElementById('feedbackText');
        this.explanation = document.getElementById('explanation');
        this.continueButton = document.getElementById('continueButton');
        
        // Results
        this.finalCorrect = document.getElementById('finalCorrect');
        this.finalIncorrect = document.getElementById('finalIncorrect');
        this.finalPercentage = document.getElementById('finalPercentage');
        this.performanceMessage = document.getElementById('performanceMessage');
        this.restartQuiz = document.getElementById('restartQuiz');
        this.newTopic = document.getElementById('newTopic');
    }

    bindEvents() {
        // Topic Selection Events
        this.startAllTopics.addEventListener('click', () => this.startMixedQuiz());
        this.startSelectedTopic.addEventListener('click', () => this.startSelectedTopicQuiz());
        
        // Quiz Navigation Events
        this.backToTopics.addEventListener('click', () => this.showTopicSelection());
        this.nextQuestion.addEventListener('click', () => this.nextQuestion());
        
        // Feedback Modal Events
        this.continueButton.addEventListener('click', () => this.hideFeedback());
        
        // Results Events
        this.restartQuiz.addEventListener('click', () => this.restartCurrentQuiz());
        this.newTopic.addEventListener('click', () => this.showTopicSelection());
        
        // Keyboard Events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (this.feedbackModal.classList.contains('show')) {
                    this.hideFeedback();
                } else if (this.nextQuestion.style.display !== 'none') {
                    this.nextQuestion();
                }
            }
        });
    }

    showTopicSelection() {
        this.topicSelection.classList.remove('hidden');
        this.quizContainer.classList.add('hidden');
        this.resultsContainer.classList.add('hidden');
        
        this.renderTopics();
        this.resetQuizState();
    }

    renderTopics() {
        const topics = QuizData.getAllTopics();
        this.topicsGrid.innerHTML = '';
        
        topics.forEach(topic => {
            const topicCard = document.createElement('div');
            topicCard.className = 'topic-card';
            topicCard.setAttribute('data-topic-id', topic.id);
            
            topicCard.innerHTML = `
                <div class="topic-title">${topic.title}</div>
                <div class="topic-subtitle">${topic.subtitle}</div>
                <div class="topic-subtitle">${topic.questionCount} Fragen</div>
            `;
            
            topicCard.addEventListener('click', () => this.selectTopic(topic.id, topicCard));
            this.topicsGrid.appendChild(topicCard);
        });
    }

    selectTopic(topicId, cardElement) {
        // Remove previous selection
        document.querySelectorAll('.topic-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select new topic
        cardElement.classList.add('selected');
        this.selectedTopicId = topicId;
        this.startSelectedTopic.disabled = false;
    }

    startMixedQuiz() {
        this.currentQuestions = QuizData.getAllQuestionsMixed();
        this.currentTopic = "Alle Themen gemischt";
        this.startQuiz();
    }

    startSelectedTopicQuiz() {
        if (!this.selectedTopicId) return;
        
        const topic = QuizData.getTopic(this.selectedTopicId);
        this.currentQuestions = QuizData.getTopicQuestions(this.selectedTopicId);
        this.currentTopic = topic.title;
        this.startQuiz();
    }

    startQuiz() {
        if (this.currentQuestions.length === 0) {
            alert('Keine Fragen für dieses Thema verfügbar. Bitte fügen Sie zuerst Fragen aus den PDF-Dateien hinzu.');
            return;
        }
        
        this.topicSelection.classList.add('hidden');
        this.quizContainer.classList.remove('hidden');
        this.resultsContainer.classList.add('hidden');
        
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, incorrect: 0 };
        this.updateQuizHeader();
        this.loadCurrentQuestion();
    }

    updateQuizHeader() {
        this.currentTopicSpan.textContent = this.currentTopic;
        this.questionCounter.textContent = `Frage ${this.currentQuestionIndex + 1} von ${this.currentQuestions.length}`;
        
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        this.scoreDisplay.textContent = `Richtig: ${this.score.correct} | Falsch: ${this.score.incorrect}`;
    }

    loadCurrentQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }
        
        const question = this.currentQuestions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        this.renderAnswers(question.answers);
        this.isAnswered = false;
        this.selectedAnswer = null;
        this.nextQuestion.style.display = 'none';
        
        this.updateQuizHeader();
    }

    renderAnswers(answers) {
        this.answersContainer.innerHTML = '';
        // Multiple-Choice: Checkbox-Logik
        answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-option';
            answerElement.textContent = answer;
            answerElement.setAttribute('data-answer-index', index);
            answerElement.addEventListener('click', () => {
                if (answerElement.classList.contains('selected')) {
                    answerElement.classList.remove('selected');
                } else {
                    answerElement.classList.add('selected');
                }
            });
            this.answersContainer.appendChild(answerElement);
        });
        // Button zum Prüfen einfügen
        const checkBtn = document.createElement('button');
        checkBtn.textContent = 'Antwort prüfen';
        checkBtn.className = 'btn btn-primary';
        checkBtn.style.marginTop = '1.5rem';
        checkBtn.addEventListener('click', () => this.checkMultipleChoiceAnswer());
        this.answersContainer.appendChild(checkBtn);
    }

    selectAnswer(answerIndex, answerElement) {
        // Wird für Single-Choice nicht mehr genutzt
    }

    checkMultipleChoiceAnswer() {
        if (this.isAnswered) return;
        this.isAnswered = true;
        const question = this.currentQuestions[this.currentQuestionIndex];
        // Ausgewählte Antworten sammeln
        const selected = Array.from(this.answersContainer.querySelectorAll('.answer-option.selected'))
            .map(el => parseInt(el.getAttribute('data-answer-index')))
            .sort();
        const correct = (question.correctAnswers || []).slice().sort();
        // Vergleich
        const isCorrect = selected.length === correct.length && selected.every((v, i) => v === correct[i]);
        if (isCorrect) {
            this.score.correct++;
        } else {
            this.score.incorrect++;
        }
        // Feedback anzeigen
        this.showAnswerFeedbackMultiple(selected, correct);
        setTimeout(() => {
            this.showFeedback(isCorrect, question.explanation);
        }, 800);
    }

    showAnswerFeedbackMultiple(selected, correct) {
        const answerElements = this.answersContainer.querySelectorAll('.answer-option');
        answerElements.forEach((element, index) => {
            element.classList.add('disabled');
            if (correct.includes(index)) {
                element.classList.add('correct');
            } else if (selected.includes(index) && !correct.includes(index)) {
                element.classList.add('incorrect');
            }
        });
        this.updateQuizHeader();
    }

    showAnswerFeedback(isCorrect, correctAnswerIndex) {
        const answerElements = this.answersContainer.querySelectorAll('.answer-option');
        
        answerElements.forEach((element, index) => {
            element.classList.add('disabled');
            
            if (index === correctAnswerIndex) {
                element.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                element.classList.add('incorrect');
            }
        });
        
        this.updateQuizHeader();
    }

    showFeedback(isCorrect, explanation) {
        this.feedbackIcon.textContent = isCorrect ? '✓' : '✗';
        this.feedbackIcon.className = `feedback-icon ${isCorrect ? 'correct' : 'incorrect'}`;
        this.feedbackText.textContent = isCorrect ? 'Richtig!' : 'Falsch!';
        this.feedbackText.style.color = isCorrect ? 'var(--success-color)' : 'var(--error-color)';

        // Show explanation if available
        if (explanation && explanation.trim() !== '') {
            this.explanation.textContent = explanation;
            this.explanation.classList.add('show');
        } else {
            this.explanation.classList.remove('show');
        }

        this.feedbackModal.classList.add('show');

        // Timeout-Referenz speichern, damit wir es abbrechen können
        if (this._autoNextTimeout) clearTimeout(this._autoNextTimeout);
        this._autoNextTimeout = setTimeout(() => {
            this._autoNextTimeout = null;
            this.hideFeedback();
        }, 1500);
    }

    hideFeedback() {
        // Timeout abbrechen, falls hideFeedback manuell ausgelöst wird
        if (this._autoNextTimeout) {
            clearTimeout(this._autoNextTimeout);
            this._autoNextTimeout = null;
        }
        this.feedbackModal.classList.remove('show');
        this.explanation.classList.remove('show');
        // Check if this was the last question
        if (this.currentQuestionIndex + 1 >= this.currentQuestions.length) {
            setTimeout(() => this.showResults(), 300);
        } else {
            // Fix: Methodenbindung sicherstellen
            if (typeof this.nextQuestion === 'function') {
                this.nextQuestion();
            } else if (typeof DKSLQuizApp.prototype.nextQuestion === 'function') {
                DKSLQuizApp.prototype.nextQuestion.call(this);
            }
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadCurrentQuestion();
    }

    showResults() {
        this.quizContainer.classList.add('hidden');
        this.resultsContainer.classList.remove('hidden');
        
        const total = this.score.correct + this.score.incorrect;
        const percentage = total > 0 ? Math.round((this.score.correct / total) * 100) : 0;
        
        this.finalCorrect.textContent = this.score.correct;
        this.finalIncorrect.textContent = this.score.incorrect;
        this.finalPercentage.textContent = `${percentage}%`;
        
        // Performance message
        let message = '';
        if (percentage >= 90) {
            message = '🎉 Ausgezeichnet! Sie haben ein sehr gutes Verständnis der DKSL-Themen.';
        } else if (percentage >= 80) {
            message = '👏 Sehr gut! Ihre Kenntnisse sind solide.';
        } else if (percentage >= 70) {
            message = '👍 Gut gemacht! Sie sind auf dem richtigen Weg.';
        } else if (percentage >= 60) {
            message = '📚 Solide Basis. Etwas mehr Übung wird Ihnen helfen.';
        } else {
            message = '💪 Weiter üben! Nutzen Sie die Lernmaterialien für eine bessere Vorbereitung.';
        }
        
        this.performanceMessage.textContent = message;
    }

    restartCurrentQuiz() {
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, incorrect: 0 };
        this.resultsContainer.classList.add('hidden');
        this.quizContainer.classList.remove('hidden');
        this.loadCurrentQuestion();
    }

    resetQuizState() {
        this.currentTopic = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, incorrect: 0 };
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.selectedTopicId = null;
        this.startSelectedTopic.disabled = true;
    }
}

// Quiz starten wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    // Prüfen ob Quiz-Daten verfügbar sind
    if (typeof QuizData === 'undefined') {
        console.error('Quiz-Daten nicht gefunden. Bitte stellen Sie sicher, dass quiz-data.js korrekt geladen wurde.');
        return;
    }
    
    // Quiz-App initialisieren
    window.quizApp = new DKSLQuizApp();
    
    console.log('DKSL Quiz erfolgreich initialisiert!');
    console.log('Verfügbare Themen:', QuizData.getAllTopics().length);
});

// Hilfsfunktionen für Debugging
window.QuizDebug = {
    // Zeige verfügbare Themen
    showTopics: function() {
        console.table(QuizData.getAllTopics());
    },
    
    // Zeige Fragen für ein Thema
    showTopicQuestions: function(topicId) {
        const questions = QuizData.getTopicQuestions(topicId);
        console.log(`Fragen für Thema "${topicId}":`, questions);
    },
    
    // Zeige alle verfügbaren Fragen
    showAllQuestions: function() {
        const allQuestions = QuizData.getAllQuestionsMixed();
        console.log(`Insgesamt ${allQuestions.length} Fragen verfügbar:`, allQuestions);
    }
};