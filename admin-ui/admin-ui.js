// Löschfunktion für Fragen
document.getElementById('deleteQuestionBtn').onclick = function() {
    const topicKey = document.getElementById('topicSelect').value;
    const idx = parseInt(document.getElementById('deleteQuestionIndex').value, 10) - 1;
    if (!topicKey || isNaN(idx)) return alert('Bitte Thema und Fragen-Nr. angeben!');
    const topic = window.quizData[topicKey];
    if (!topic || !topic.questions || idx < 0 || idx >= topic.questions.length) return alert('Ungültige Fragen-Nr.!');
    if (!confirm(`Frage ${idx + 1} wirklich löschen?`)) return;
    topic.questions.splice(idx, 1);
    document.getElementById('deleteQuestionIndex').value = '';
    showPreview();
    alert('Frage gelöscht!');
};
// Automatische Umwandlung: JSON zu quiz-data.js
document.getElementById('convertJsonBtn').onclick = function() {
    const input = document.getElementById('importJsonInput');
    if (!input.files || input.files.length === 0) return alert('Bitte zuerst eine JSON-Datei auswählen!');
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = e.target.result;
            // JS-Format erzeugen inkl. QuizData-Hilfsobjekt
            const helperCode = `\nwindow.QuizData = {\n  getTopic: function(id) {\n    return window.quizTopics[id];\n  },\n  getAllTopics: function() {\n    return Object.keys(window.quizTopics).map(id => {\n      const t = window.quizTopics[id];\n      return { id, title: t.title, subtitle: t.subtitle, questionCount: t.questions.length };\n    });\n  },\n  getTopicQuestions: function(id) {\n    return window.quizTopics[id]?.questions || [];\n  },\n  getAllQuestionsMixed: function() {\n    return Object.values(window.quizTopics).flatMap(t => t.questions);\n  }\n};\n`;
            const jsContent = 'window.quizTopics = ' + json + ';' + helperCode;
            const blob = new Blob([jsContent], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'quiz-data.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Die Datei quiz-data.js wurde erstellt und kann gespeichert werden.');
        } catch (err) {
            alert('Fehler bei der Umwandlung: ' + err.message);
        }
    };
    reader.readAsText(file);
};
// Importfunktion für JSON-Datei
document.getElementById('importJsonBtn').onclick = function() {
    const input = document.getElementById('importJsonInput');
    if (!input.files || input.files.length === 0) return alert('Bitte eine JSON-Datei auswählen!');
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            window.quizData = data;
            updateTopicSelect();
            showPreview();
            alert('Quizdaten erfolgreich importiert!');
        } catch (err) {
            alert('Fehler beim Import: ' + err.message);
        }
    };
    reader.readAsText(file);
};

function updateTopicSelect() {
    const select = document.getElementById('topicSelect');
    select.innerHTML = '';
    const data = window.quizData || {};
    Object.keys(data).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data[key].title;
        select.appendChild(option);
    });
}

document.getElementById('addTopicBtn').onclick = function() {
    const title = document.getElementById('newTopicTitle').value.trim();
    const subtitle = document.getElementById('newTopicSubtitle').value.trim();
    if (!title) return alert('Bitte Thementitel eingeben!');
    const key = title.toLowerCase().replace(/[^a-z0-9]/gi, '');
    if (!window.quizData) window.quizData = {};
    window.quizData[key] = { title, subtitle, questions: [] };
    updateTopicSelect();
    document.getElementById('newTopicTitle').value = '';
    document.getElementById('newTopicSubtitle').value = '';
    showPreview();
};


document.getElementById('exportJsonBtn').onclick = function() {
    const dataStr = JSON.stringify(window.quizData || {}, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

function showPreview() {
    const data = window.quizData || {};
    let preview = '';
    Object.keys(data).forEach(topicKey => {
        const topic = data[topicKey];
        preview += `Thema: ${topic.title}\n`;
        if (topic.questions && topic.questions.length > 0) {
            topic.questions.forEach((q, idx) => {
                preview += `${idx + 1}. ${q.question}\nAntworten: ${q.answers.join(', ')}\nRichtig: ${q.correctAnswers.join(', ')}\nErklärung: ${q.explanation || ''}\n\n`;
            });
        } else {
            preview += 'Keine Fragen vorhanden.\n\n';
        }
    });
    document.getElementById('previewArea').textContent = preview;
}

document.addEventListener('DOMContentLoaded', function() {
    updateTopicSelect();
    showPreview();

    // Frage zum Bearbeiten laden
    document.getElementById('loadQuestionBtn').onclick = function() {
        const topicKey = document.getElementById('topicSelect').value;
        const idx = parseInt(document.getElementById('editQuestionIndex').value, 10) - 1;
        if (!topicKey || isNaN(idx)) return alert('Bitte Thema und Fragen-Nr. angeben!');
        const topic = window.quizData[topicKey];
        if (!topic || !topic.questions || idx < 0 || idx >= topic.questions.length) return alert('Ungültige Fragen-Nr.!');
        const q = topic.questions[idx];
        document.getElementById('questionText').value = q.question;
        document.getElementById('answersInput').value = q.answers.join(', ');
        document.getElementById('correctAnswersInput').value = q.correctAnswers.join(',');
        document.getElementById('explanationInput').value = q.explanation || '';
    };

    // Frage bearbeiten und speichern
    document.getElementById('editQuestionBtn').onclick = function() {
        const topicKey = document.getElementById('topicSelect').value;
        const idx = parseInt(document.getElementById('editQuestionIndex').value, 10) - 1;
        const question = document.getElementById('questionText').value.trim();
        const answers = document.getElementById('answersInput').value.split(',').map(a => a.trim()).filter(a => a);
        const correctAnswers = document.getElementById('correctAnswersInput').value.split(',').map(i => parseInt(i.trim(), 10)).filter(i => !isNaN(i));
        const explanation = document.getElementById('explanationInput').value.trim();
        if (!topicKey || isNaN(idx) || !question || answers.length === 0 || correctAnswers.length === 0) return alert('Bitte alle Felder ausfüllen!');
        const topic = window.quizData[topicKey];
        if (!topic || !topic.questions || idx < 0 || idx >= topic.questions.length) return alert('Ungültige Fragen-Nr.!');
        topic.questions[idx] = { question, answers, correctAnswers, explanation };
        showPreview();
        alert('Frage wurde aktualisiert!');
    };
});
