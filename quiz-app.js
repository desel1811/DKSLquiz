// Vollständige Quiz-App ohne Meldefunktion
class DKSLQuizApp {
    // Speichert die Bewertung jeder Frage
    questionResults = [];

    prevQuestionHandler() {
        if (this.currentQuestionIndex > 0) {
            // Bewertung zurücknehmen
            const lastResult = this.questionResults[this.currentQuestionIndex];
            if (lastResult === true) {
                this.score.correct--;
            } else if (lastResult === false) {
                this.score.incorrect--;
            }
            // Antwort und Bewertung löschen
            this.questionResults[this.currentQuestionIndex] = undefined;
            this.currentQuestionIndex--;
            this.loadCurrentQuestion();
        }
    }
    constructor() {
        this.currentTopic = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, incorrect: 0 };
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.selectedTopicId = null;
        this.initializeElements();
        this.incrementUsageCounter();
        this.bindEvents();
        this.showTopicSelection();
    }

    incrementUsageCounter() {
        let count = parseInt(localStorage.getItem('quizUsageCount') || '0', 10);
        count++;
        localStorage.setItem('quizUsageCount', count);
        if (this.usageCounterElement) {
            this.usageCounterElement.textContent = `App genutzt: ${count}x`;
        }
    }
    initializeElements() {
    this.topicSelection = document.getElementById('topicSelection');
    this.quizContainer = document.getElementById('quizContainer');
    this.resultsContainer = document.getElementById('resultsContainer');
    this.feedbackModal = document.getElementById('feedbackModal');
    this.topicsGrid = document.getElementById('topicsGrid');
    this.startAllTopics = document.getElementById('startAllTopics');
    this.startSelectedTopic = document.getElementById('startSelectedTopic');
    this.currentTopicSpan = document.getElementById('currentTopic');
    this.questionCounter = document.getElementById('questionCounter');
    this.progressFill = document.getElementById('progressFill');
    this.scoreDisplay = document.getElementById('scoreDisplay');
    this.questionText = document.getElementById('questionText');
    this.answersContainer = document.getElementById('answersContainer');
    this.backToTopics = document.getElementById('backToTopics');
    this.nextQuestion = document.getElementById('nextQuestion');
    this.prevQuestion = document.getElementById('prevQuestion');
    this.feedbackIcon = document.getElementById('feedbackIcon');
    this.feedbackText = document.getElementById('feedbackText');
    this.explanation = document.getElementById('explanation');
    this.continueButton = document.getElementById('continueButton');
    this.finalCorrect = document.getElementById('finalCorrect');
    this.finalIncorrect = document.getElementById('finalIncorrect');
    this.finalPercentage = document.getElementById('finalPercentage');
    this.performanceMessage = document.getElementById('performanceMessage');
    this.restartQuiz = document.getElementById('restartQuiz');
    this.newTopic = document.getElementById('newTopic');
    this.usageCounterElement = document.getElementById('usageCounter');
    }
    bindEvents() {
    this.startAllTopics.addEventListener('click', () => this.startMixedQuiz());
    this.startSelectedTopic.addEventListener('click', () => this.startSelectedTopicQuiz());
    this.backToTopics.addEventListener('click', () => this.showTopicSelection());
    this.nextQuestion.addEventListener('click', () => this.nextQuestion());
    this.prevQuestion.addEventListener('click', () => this.prevQuestionHandler());
    this.continueButton.addEventListener('click', () => this.hideFeedback());
    this.restartQuiz.addEventListener('click', () => this.restartCurrentQuiz());
    this.newTopic.addEventListener('click', () => this.showTopicSelection());
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
        document.querySelectorAll('.topic-card').forEach(card => {
            card.classList.remove('selected');
        });
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
    if (this.currentQuestionIndex > 0) {
        this.prevQuestion.classList.remove('hidden');
    } else {
        this.prevQuestion.classList.add('hidden');
    }
        this.updateQuizHeader();
    }
    renderAnswers(answers) {
        this.answersContainer.innerHTML = '';
        answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-option';
            answerElement.textContent = answer;
            answerElement.setAttribute('data-answer-index', index);
            // Handler-Funktion für Auswahl/Abwahl
            const toggleSelect = (e) => {
                // Verhindere doppeltes Auslösen auf Touch-Geräten
                if (e.type === 'touchstart') e.preventDefault();
                if (answerElement.classList.contains('selected')) {
                    answerElement.classList.remove('selected');
                } else {
                    answerElement.classList.add('selected');
                }
            };
            answerElement.addEventListener('click', toggleSelect);
            answerElement.addEventListener('touchstart', toggleSelect, {passive: false});
            this.answersContainer.appendChild(answerElement);
        });
        // Button zum Prüfen einfügen
        const checkBtn = document.createElement('button');
        checkBtn.textContent = 'Antwort prüfen';
        checkBtn.className = 'btn btn-primary';
        checkBtn.style.marginTop = '1.5rem';
        checkBtn.addEventListener('click', () => this.checkMultipleChoiceAnswer());
        this.answersContainer.appendChild(checkBtn);
        // Button zum Melden per E-Mail
        const emailBtn = document.createElement('button');
    emailBtn.textContent = 'Fehler in der Frage oder Antwort melden';
        emailBtn.className = 'btn btn-warning';
        emailBtn.style.marginLeft = '1rem';
        emailBtn.onclick = () => {
            const q = this.currentQuestions[this.currentQuestionIndex];
        const mail = 'mailto:a.desel@web.de';
            const subject = encodeURIComponent('Fehlerhafte Quizfrage gemeldet');
            const body = encodeURIComponent(
                `Thema: ${q.topic || ''}\nFrage: ${q.question}\nAntworten:\n${Array.isArray(q.answers) ? q.answers.map((a, i) => String.fromCharCode(97+i) + ') ' + a).join('\n') : ''}\nGemeldet am: ${new Date().toLocaleString()}`
            );
            window.location.href = `${mail}?subject=${subject}&body=${body}`;
        };
        this.answersContainer.appendChild(emailBtn);
// Hilfsfunktionen für Meldefunktion
function saveReportedQuestion(questionObj) {
    let reported = JSON.parse(localStorage.getItem('reportedQuestions') || '[]');
    reported.push({
        question: questionObj.question,
        topic: questionObj.topic || '',
        time: questionObj.time || new Date().toISOString(),
        answers: Array.isArray(questionObj.answers) ? questionObj.answers : []
    });
    localStorage.setItem('reportedQuestions', JSON.stringify(reported));
}

function exportReportedQuestions() {
    let reported = JSON.parse(localStorage.getItem('reportedQuestions') || '[]');
    reported = reported.filter(q => Array.isArray(q.answers) && q.answers.length > 0);
    const unique = [];
    const seen = new Set();
    for (const q of reported) {
        const key = q.question + '|' + (q.answers ? q.answers.join('|') : '');
        if (!seen.has(key)) {
            unique.push(q);
            seen.add(key);
        }
    }
    if (unique.length === 0) {
        alert('Es wurden keine Fragen mit Antworten gemeldet.');
        return;
    }
    let text = unique.map((q, i) => {
        let antworten = Array.isArray(q.answers) ? q.answers : [];
        let antwortText = antworten.map((a, idx) => `    ${String.fromCharCode(97+idx)}) ${a}`).join('\n');
        return `${i+1}. [${q.topic}] ${q.question} (${q.time})\n${antwortText}`;
    }).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gemeldete_fragen.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    localStorage.removeItem('reportedQuestions');
}
    }
    selectAnswer(answerIndex, answerElement) {}
    checkMultipleChoiceAnswer() {
        if (this.isAnswered) return;
        this.isAnswered = true;
        const question = this.currentQuestions[this.currentQuestionIndex];
        const selected = Array.from(this.answersContainer.querySelectorAll('.answer-option.selected')).map(el => parseInt(el.getAttribute('data-answer-index'))).sort();
        const correct = (question.correctAnswers || []).slice().sort();
        const isCorrect = selected.length === correct.length && selected.every((v, i) => v === correct[i]);
        // Alte Wertung entfernen
        const lastResult = this.questionResults[this.currentQuestionIndex];
        if (lastResult === true) {
            this.score.correct--;
        } else if (lastResult === false) {
            this.score.incorrect--;
        }
        // Neue Wertung setzen
        this.questionResults[this.currentQuestionIndex] = isCorrect;
        if (isCorrect) {
            this.score.correct++;
        } else {
            this.score.incorrect++;
        }
        this.showAnswerFeedbackMultiple(selected, correct);
        setTimeout(() => {
            this.showFeedback(isCorrect, question.explanation);
        }, 5000);
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
        if (explanation && explanation.trim() !== '') {
            this.explanation.textContent = explanation;
            this.explanation.classList.add('show');
        } else {
            this.explanation.classList.remove('show');
        }
        this.feedbackModal.classList.add('show');
        if (this._autoNextTimeout) clearTimeout(this._autoNextTimeout);
        this._autoNextTimeout = setTimeout(() => {
            this._autoNextTimeout = null;
            this.hideFeedback();
        }, 1500);
    }
    hideFeedback() {
        if (this._autoNextTimeout) {
            clearTimeout(this._autoNextTimeout);
            this._autoNextTimeout = null;
        }
        this.feedbackModal.classList.remove('show');
        this.explanation.classList.remove('show');
        if (this.currentQuestionIndex + 1 >= this.currentQuestions.length) {
            setTimeout(() => this.showResults(), 300);
        } else {
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
document.addEventListener('DOMContentLoaded', () => {
    if (typeof QuizData === 'undefined') {
        console.error('Quiz-Daten nicht gefunden. Bitte stellen Sie sicher, dass quiz-data.js korrekt geladen wurde.');
        return;
    }
    window.quizApp = new DKSLQuizApp();
    console.log('DKSL Quiz erfolgreich initialisiert!');
});
