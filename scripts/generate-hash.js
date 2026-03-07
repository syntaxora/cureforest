// Run with: node scripts/generate-hash.js
// Requires bcryptjs: npm install bcryptjs

const bcrypt = require('bcryptjs');

const password = 'admin123!';
const rounds = 12;

bcrypt.hash(password, rounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Verify
  bcrypt.compare(password, hash, (err2, result) => {
    if (err2) {
      console.error('Error verifying:', err2);
      return;
    }
    console.log('Verification:', result ? 'SUCCESS' : 'FAILED');
  });
});
