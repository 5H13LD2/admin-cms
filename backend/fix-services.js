const fs = require('fs');

// Fix userService.js
console.log('Fixing userService.js...');
let userService = fs.readFileSync('services/firestore/userService.js', 'utf8');

// Replace imports
userService = userService.replace(
  /const \{ initializeFirebase, admin \} = require\('\.\.\/\.\.\/config\/firebase-config'\);[\s\S]*?const db = initializeFirebase\(\);/,
  "const { getFirestore } = require('../../config/firebase-admin');\nconst admin = require('firebase-admin');\nconst logger = require('../../utils/logger');"
);

fs.writeFileSync('services/firestore/userService.js', userService);

// Fix courseService.js
console.log('Fixing courseService.js...');
let courseService = fs.readFileSync('services/firestore/courseService.js', 'utf8');

courseService = courseService.replace(
  /const \{ initializeFirebase, admin \} = require\('\.\.\/\.\.\/config\/firebase-config'\);[\s\S]*?const db = initializeFirebase\(\);/,
  "const { getFirestore } = require('../../config/firebase-admin');\nconst admin = require('firebase-admin');\nconst logger = require('../../utils/logger');"
);

fs.writeFileSync('services/firestore/courseService.js', courseService);

console.log('Done! Files fixed.');
