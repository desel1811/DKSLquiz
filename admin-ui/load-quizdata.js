// Lädt die bestehenden Quizdaten aus quiz-data.js und initialisiert die Admin-Oberfläche
window.addEventListener('DOMContentLoaded', () => {
    if (window.quizTopics) {
        // quizTopics ist das Objekt aus quiz-data.js
        // Struktur anpassen: quizData = quizTopics
        window.quizData = window.quizTopics;
        if (typeof updateTopicSelect === 'function') updateTopicSelect();
        if (typeof showPreview === 'function') showPreview();
    }
});
