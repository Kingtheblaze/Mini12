const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace datasource configuration
schema = schema.replace(
  /datasource db {[\s\S]*?}/,
  `datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}`
);

fs.writeFileSync(schemaPath, schema);
console.log('Updated schema.prisma to use local SQLite.');

try {
  console.log('Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Successfully switched to local SQLite! Please restart the Next.js server.');
} catch (err) {
  console.error('Prisma generate failed:', err.message);
}
