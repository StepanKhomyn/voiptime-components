// Генерує src/icon-groups/index.ts з іконок у src/icon-groups/<група>/*Icon.vue
// Запуск: npm run generate-icon-groups (також викликається автоматично після npm run fetch-icons)

const fs = require('fs');
const path = require('path');
const config = require('./icon-groups.config.cjs');

const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.resolve(ROOT, config.outputDir);
const OUTPUT_FILE = path.join(ICONS_DIR, 'index.ts');

// LeftMenuCrmIcon.vue -> left_menu_crm
function toIconName(fileName) {
  return fileName
    .replace(/Icon\.vue$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

function generateIconGroupsIndex() {
  console.log('🔍 Сканування директорії icon-groups...');

  const groups = fs
    .readdirSync(ICONS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
    .map(folder => ({
      folder,
      icons: fs
        .readdirSync(path.join(ICONS_DIR, folder))
        .filter(file => file.endsWith('Icon.vue'))
        .sort()
        .map(file => ({
          componentName: file.replace(/\.vue$/, ''),
          name: toIconName(file),
          importPath: `./${folder}/${file}`,
        })),
    }))
    .filter(group => group.icons.length);

  const allIcons = groups.flatMap(group => group.icons);

  if (!allIcons.length) {
    console.log('❌ Не знайдено жодного файлу з іконками');
    return;
  }

  const fileContent = [
    '// Цей файл згенеровано автоматично. Не редагуйте вручну!',
    '// Для оновлення запустіть: npm run generate-icon-groups',
    '',
    ...allIcons.map(icon => `import ${icon.componentName} from '${icon.importPath}';`),
    '',
    'export const groupIcons = {',
    ...groups.flatMap((group, index) => [
      ...(index ? [''] : []),
      `  // ${group.folder}`,
      ...group.icons.map(icon => `  ${icon.name}: ${icon.componentName},`),
    ]),
    '} as const;',
    '',
    'export type GroupIconName = keyof typeof groupIcons;',
    '',
    'export const iconGroups = {',
    ...groups.flatMap(group => [`  '${group.folder}': [`, ...group.icons.map(icon => `    '${icon.name}',`), '  ],']),
    '} as const;',
    '',
    'export type IconGroup = keyof typeof iconGroups;',
    '',
  ].join('\n');

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');

  console.log(`✅ Файл ${path.relative(ROOT, OUTPUT_FILE)} успішно згенеровано!`);
  console.log(`📊 Додано ${allIcons.length} іконок з ${groups.length} груп`);
  groups.forEach(group => console.log(`   - ${group.folder}: ${group.icons.length} іконок`));
}

generateIconGroupsIndex();
