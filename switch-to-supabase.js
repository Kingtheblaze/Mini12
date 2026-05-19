const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace datasource configuration
schema = schema.replace(
  /datasource db {[\s\S]*?}/,
  `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`
);

fs.writeFileSync(schemaPath, schema);
console.log('Updated schema.prisma to use Supabase (PostgreSQL).');

try {
  console.log('Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Successfully switched to Supabase! Please restart the Next.js server.');
} catch (err) {
  console.error('Prisma generate failed:', err.message);
}
