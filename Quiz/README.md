# DKSL Interaktives Quiz System

Ein vollständiges interaktives Quiz-System für alle 20 DKSL-Wissensprüfungen mit sofortigem "Richtig/Falsch"-Feedback.

## ✅ Fertiggestellte Features

- **Themenauswahl**: Wählen Sie aus 20 verschiedenen DKSL-Themen
- **Gemischter Modus**: Alle Fragen aus allen Themen gemischt
- **Sofortiges Feedback**: Bei Klick wird sofort "Richtig" oder "Falsch" angezeigt
- **Fortschrittsanzeige**: Visueller Fortschritt und Punktestand
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Detaillierte Ergebnisse**: Finale Bewertung mit Leistungseinschätzung

## 🗂️ Projektstruktur

```
DKSL Quiz/
├── index.html          # Haupt-HTML-Datei
├── styles.css          # Komplettes Styling
├── quiz-data.js        # Datenstruktur für alle 20 Themen
├── quiz-app.js         # Hauptlogik des Quiz-Systems
├── README.md           # Diese Datei
└── [20 PDF-Dateien]    # Ihre Wissensprüfungs-PDFs
```

## 🚀 Verwendung

1. **Quiz starten**: Öffnen Sie `index.html` im Browser
2. **Thema wählen**: Klicken Sie auf ein Thema oder "Alle Themen gemischt"
3. **Fragen beantworten**: Klicken Sie auf eine Antwort
4. **Feedback erhalten**: Sofort wird "Richtig" oder "Falsch" angezeigt
5. **Weiter**: Klicken Sie "Weiter" für die nächste Frage
6. **Ergebnis**: Am Ende erhalten Sie eine detaillierte Auswertung

## ⚠️ WICHTIG: Fragen aus PDFs hinzufügen

Das Quiz-System ist **fertig**, aber die **echten Fragen müssen noch aus den PDF-Dateien extrahiert** und in `quiz-data.js` eingefügt werden.

### So fügen Sie Fragen hinzu:

1. **Öffnen Sie `quiz-data.js`**
2. **Finden Sie das entsprechende Thema** (z.B. `"grundlagen"` für PDF #1)
3. **Ersetzen Sie die Beispielfragen** mit echten Fragen aus dem PDF

### Format für Fragen:

```javascript
{
    question: "Ihre Frage aus dem PDF?",
    answers: [
        "Antwort A",
        "Antwort B", 
        "Antwort C",
        "Antwort D"
    ],
    correctAnswer: 0,  // Index der richtigen Antwort (0-3)
    explanation: "Optionale Erklärung warum diese Antwort richtig ist"
}
```

### Beispiel - Thema 1 (Grundlagen):

```javascript
"grundlagen": {
    title: "1. Grundlagen",
    subtitle: "Grundlagen der Stillberatung",
    questions: [
        {
            question: "Was ist das Hauptziel der Stillberatung?",
            answers: [
                "Mutter und Kind beim erfolgreichen Stillen zu unterstützen",
                "Medizinische Diagnosen zu stellen",
                "Babynahrung zu verkaufen",
                "Gewichtszunahme zu überwachen"
            ],
            correctAnswer: 0,
            explanation: "Die Stillberatung zielt darauf ab, Mutter und Kind zu unterstützen..."
        },
        // Weitere Fragen hier...
    ]
}
```

## 📋 Zuordnung PDF → Thema-ID

| PDF-Datei | Thema-ID | Titel |
|-----------|----------|-------|
| 1 Wissensprüfung Grundlagen Antworten.pdf | `grundlagen` | 1. Grundlagen |
| 2 Wissensprüfung Anatomie und Physiologie der Brust Antworten.pdf | `anatomie-brust` | 2. Anatomie und Physiologie der Brust |
| 3 Wissensprüfung Anatomie des Säuglings Antworten.pdf | `anatomie-saeugling` | 3. Anatomie des Säuglings |
| 4 Wissensprüfung Zusammensetzung der Muttermilch Antworten.pdf | `muttermilch` | 4. Zusammensetzung der Muttermilch |
| 5 Wissensprüfung Psychologie und Entwicklung Antworten.pdf | `psychologie` | 5. Psychologie und Entwicklung |
| 6 Wissensprüfung Gesundheitszustand Antworten.pdf | `gesundheitszustand` | 6. Gesundheitszustand |
| 7 Wissensprüfung Grundlagen des Stillens Antworten.pdf | `grundlagen-stillen` | 7. Grundlagen des Stillens |
| 8 Wissensprüfung Stillstart Antworten.pdf | `stillstart` | 8. Stillstart |
| 9 Wissensprüfung Stillprobleme Antworten.pdf | `stillprobleme` | 9. Stillprobleme |
| 10 Wissensprüfung Hilfsmittel Antworten.pdf | `hilfsmittel` | 10. Hilfsmittel |
| 11 Wissensprüfung Massagen, Untersuchungen und Techniken Antworten.pdf | `massagen-untersuchungen` | 11. Massagen, Untersuchungen und Techniken |
| 12 Wissensprüfung Stillen von Frühgeborenen Antworten.pdf | `fruehgeborene` | 12. Stillen von Frühgeborenen |
| 13 Wissensprüfung Pharmakologie und Toxikologie Antworten.pdf | `pharmakologie` | 13. Pharmakologie und Toxikologie |
| 14 Wissensprüfung Drogen Antworten.pdf | `drogen` | 14. Drogen |
| 15 Wissensprüfung Mikrobiom Antworten.pdf | `mikrobiom` | 15. Mikrobiom |
| 16 Wissensprüfung Stillen nach der ersten Lebenswoche Antworten.pdf | `stillen-lebenswoche` | 16. Stillen nach der ersten Lebenswoche |
| 17 Wissensprüfung Public Health und Gesundheitswesen Antworten.pdf | `public-health` | 17. Public Health und Gesundheitswesen |
| 18 Wissensprüfung Bildung, Kommunikation und Dokumentation Antworten.pdf | `bildung-kommunikation` | 18. Bildung, Kommunikation und Dokumentation |
| 19 Wissensprüfung Einführung in die Forschung Antworten.pdf | `forschung` | 19. Einführung in die Forschung |
| 20 Wissensprüfung Ankyloglossie Antworten.pdf | `ankyloglossie` | 20. Ankyloglossie |

## 🛠️ Debugging-Hilfen

In der Browser-Konsole (F12) können Sie diese Befehle verwenden:

```javascript
// Alle verfügbaren Themen anzeigen
QuizDebug.showTopics()

// Fragen für ein bestimmtes Thema anzeigen
QuizDebug.showTopicQuestions('grundlagen')

// Alle verfügbaren Fragen anzeigen
QuizDebug.showAllQuestions()
```

## 🎯 Nächste Schritte

1. **Fragen extrahieren**: Lesen Sie die PDF-Dateien und extrahieren Sie alle Fragen
2. **Fragen eingeben**: Fügen Sie die Fragen in `quiz-data.js` ein
3. **Testen**: Überprüfen Sie, ob alle Themen korrekt funktionieren
4. **Anpassen**: Erweitern Sie das System bei Bedarf

## 💡 Zusätzliche Features (optional)

Das System ist erweiterbar für:
- Timer pro Frage
- Zertifikat-Generierung
- Detaillierte Statistiken pro Thema
- Export der Ergebnisse
- Offline-Modus

Das Quiz-System ist **vollständig funktionsfähig** und wartet nur auf die echten Fragen aus Ihren PDF-Dateien!