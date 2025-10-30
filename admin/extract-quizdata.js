const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../Quiz mit Fragenkorrektufunktion/quiz-data.js');
const jsText = fs.readFileSync(filePath, 'utf8');

let output = '';
let jsonExport = [];
let csvRows = [
  ['Thema', 'Frage', 'Antworten', 'Richtige Antworten'].join(';')
];

// Themen extrahieren
const topicRegex = /"([^"]+)":\s*{\s*title:\s*"([^"]+)",\s*subtitle:\s*"([^"]+)",\s*questions:\s*\[([\s\S]*?)\]\s*}/g;
let topicMatch;
while ((topicMatch = topicRegex.exec(jsText)) !== null) {
  const topicId = topicMatch[1];
  const title = topicMatch[2];
  const subtitle = topicMatch[3];
  const questionsBlock = topicMatch[4];
  output += `Thema: ${title}\n${subtitle}\n`;

  // Fragen extrahieren
  const questionRegex = /question:\s*"([^"]+)"[\s\S]*?answers:\s*\[([\s\S]*?)\][\s\S]*?correctAnswers:\s*\[([\d,\s]*)\]/g;
  let questionMatch;
  let qNum = 1;
  while ((questionMatch = questionRegex.exec(questionsBlock)) !== null) {
    const question = questionMatch[1];
    const answersRaw = questionMatch[2];
    const correctRaw = questionMatch[3];
    // Antworten extrahieren
    const answers = [];
    const answerRegex = /"([^"]+)"/g;
    let answerMatch;
    while ((answerMatch = answerRegex.exec(answersRaw)) !== null) {
      answers.push(answerMatch[1]);
    }
    // Richtige Antworten extrahieren
    const correctIndexes = correctRaw.split(',').map(x => x.trim()).filter(x => x !== '').map(Number);
    const correctAnswers = correctIndexes.map(idx => answers[idx]).filter(Boolean);
    output += `Frage ${qNum}: ${question}\nAntworten:\n`;
    answers.forEach((a, i) => {
      output += `- ${a}${correctIndexes.includes(i) ? ' (richtig)' : ''}\n`;
    });
    if (correctAnswers.length) {
      output += `Richtige Antwort(en): ${correctAnswers.join(', ')}\n`;
    }
    output += `\n`;

    // JSON-Export
    jsonExport.push({
      thema: title,
      frage: question,
      antworten: answers,
      richtigeAntworten: correctAnswers
    });

    // CSV-Export
    csvRows.push([
      title,
      question,
      answers.join(' | '),
      correctAnswers.join(' | ')
    ].map(v => '"' + v.replace(/"/g, '""') + '"').join(';'));

    qNum++;
  }
  output += `\n`;
}

fs.writeFileSync(path.join(__dirname, 'alle-fragen-und-antworten.txt'), output);

// Kommandozeilen-Flags auswerten
const args = process.argv.slice(2);
if (args.includes('--json')) {
  fs.writeFileSync(path.join(__dirname, 'alle-fragen-und-antworten.json'), JSON.stringify(jsonExport, null, 2), 'utf8');
  console.log('Export abgeschlossen: admin/alle-fragen-und-antworten.json');
}
if (args.includes('--csv')) {
  fs.writeFileSync(path.join(__dirname, 'alle-fragen-und-antworten.csv'), csvRows.join('\n'), 'utf8');
  console.log('Export abgeschlossen: admin/alle-fragen-und-antworten.csv');
}
fs.writeFileSync(path.join(__dirname, 'alle-fragen-und-antworten.txt'), output);
console.log('Export abgeschlossen: admin/alle-fragen-und-antworten.txt');
