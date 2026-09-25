const fs = require('fs');

const raw = fs.readFileSync('./questions.json', 'utf8');
// It might be corrupted now. Let's fetch the original content from git or rewrite it.
