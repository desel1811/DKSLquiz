# Admin-UI für DKSL Quiz – Anleitung

## Funktionen der Admin-UI

Die Admin-Oberfläche ermöglicht die vollständige Pflege der Quiz-Daten:

- **Thema hinzufügen:** Neues Thema mit Titel und Beschreibung anlegen.
- **Frage hinzufügen:** Neue Frage zu einem gewählten Thema anlegen (Fragetext, Antworten, richtige Antwort(en), Erklärung).
- **Frage bearbeiten:** Bestehende Frage auswählen, laden, ändern und speichern (z. B. Korrektur von Schreibfehlern).
- **Frage löschen:** Frage aus einem Thema entfernen.
- **Quizdaten exportieren:** Exportiert alle Daten als JSON-Datei (Backup oder Weitergabe).
- **Quizdaten importieren:** Importiert eine JSON-Datei und übernimmt die Daten in die Oberfläche.
- **JSON in quiz-data.js umwandeln:** Erstellt aus einer JSON-Datei die JavaScript-Datei `quiz-data.js` (inkl. Hilfsobjekt für die Quiz-App).
- **Vorschau:** Zeigt alle Themen und Fragen als Textvorschau an.

## Workflow: Aktualisierte quiz-data.js speichern und auf GitHub bereitstellen

1. **Daten pflegen:**
   - Themen und Fragen in der Admin-UI bearbeiten, hinzufügen oder löschen.
   - Änderungen werden direkt in der Oberfläche übernommen.

2. **Export als quiz-data.js:**
   - Über den Button "JSON in quiz-data.js umwandeln" die aktuelle Datenbasis als `quiz-data.js` exportieren.
   - Die Datei enthält alle Themen, Fragen und das benötigte Hilfsobjekt für die Quiz-App.

3. **Datei speichern:**
   - Die exportierte Datei `quiz-data.js` herunterladen und im Hauptordner der Quiz-App (z. B. im Ordner `Quiz`) ablegen.
   - Bestehende Datei überschreiben, damit die Quiz-App die aktuellen Daten verwendet.

4. **Auf GitHub hochladen:**
   - Die neue `quiz-data.js` im Hauptordner mit Git committen und pushen:
     ```
     git add Quiz/quiz-data.js
     git commit -m "Aktualisierte Quiz-Daten"
     git push
     ```
   - Dadurch steht die aktuelle Version der Quiz-Daten im Repository zur Verfügung.

## Hinweise
- Die Quiz-App kann nur die Datei aus dem Hauptordner laden, nicht direkt aus `admin-ui`.
- Änderungen in der Admin-UI sind erst nach Export und Kopieren der Datei in die Quiz-App wirksam.
- Die Admin-UI ist für die Pflege und Verwaltung der Daten gedacht, nicht für die eigentliche Durchführung des Quiz.

---

**Tipp:** Nach jeder Änderung und Export die Datei direkt ins Repository kopieren und committen, damit die Quiz-App immer auf dem neuesten Stand ist.
