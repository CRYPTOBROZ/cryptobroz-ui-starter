import path from 'node:path';

const buildEslintCommand = (filenames: string[]) =>
  `eslint --fix ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(' ')}`;

export default {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write'],
};
