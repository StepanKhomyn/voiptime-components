const fs = require('fs');
const path = require('path');

// Конфігурація
const ICONS_DIR = './src/icons';
const OUTPUT_FILE = './src/icons/index.ts';

// Функція для конвертації назви файлу в camelCase
function toCamelCase(str) {
  return str
    .replace(/Icon\.vue$/, '') // Видаляємо Icon.vue
    .replace(/[_-](.)/g, (_, char) => char.toUpperCase()) // Конвертуємо в camelCase
    .replace(/^(.)/, (_, char) => char.toLowerCase()); // Перша літера маленька
}

// Функція для конвертації назви файлу в PascalCase для імпорту
function toPascalCase(str) {
  return str.replace(/\.vue$/, ''); // Просто видаляємо .vue, залишаємо як є
}

// Функція для рекурсивного обходу директорій
function getAllIconFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllIconFiles(fullPath, baseDir));
    } else if (item.endsWith('Icon.vue')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        fileName: item,
        relativePath: relativePath.replace(/\\/g, '/'), // Нормалізуємо шлях для Windows
        directory: path.relative(baseDir, dir).replace(/\\/g, '/'),
      });
    }
  }

  return files;
}

// Основна функція
function generateIconsIndex() {
  try {
    console.log('🔍 Сканування директорії icons...');

    const iconFiles = getAllIconFiles(ICONS_DIR);

    if (iconFiles.length === 0) {
      console.log('❌ Не знайдено жодного файлу з іконками');
      return;
    }

    console.log(`📦 Знайдено ${iconFiles.length} іконок`);

    // Групування за директоріями
    const groupedIcons = {};
    iconFiles.forEach(icon => {
      const dir = icon.directory || 'root';
      if (!groupedIcons[dir]) {
        groupedIcons[dir] = [];
      }
      groupedIcons[dir].push(icon);
    });

    // Генерування імпортів
    const imports = [];
    const exports = [];

    Object.keys(groupedIcons)
      .sort()
      .forEach(dir => {
        const dirComment = dir === 'root' ? 'root icons' : `${dir} icons`;

        groupedIcons[dir].forEach(icon => {
          const componentName = toPascalCase(icon.fileName);
          const exportName = toCamelCase(icon.fileName);
          const importPath = `./${icon.relativePath}`;

          imports.push(`import ${componentName} from '${importPath}';`);

          if (!exports.find(group => group.comment === dirComment)) {
            exports.push({ comment: dirComment, icons: [] });
          }

          const group = exports.find(group => group.comment === dirComment);
          group.icons.push(`  ${exportName}: ${componentName},`);
        });
      });

    // Генерування контенту файлу
    const fileContent = [
      '// Цей файл згенеровано автоматично. Не редагуйте вручну!',
      '// Для оновлення запустіть: node scripts/generate-icons.js',
      '',
      ...imports,
      '',
      'export const icons = {',
      ...exports
        .map(group => [`  // ${group.comment}`, ...group.icons, ''])
        .flat()
        .slice(0, -1), // Видаляємо останній порожній рядок
      '} as const;',
      '',
      'export type IconName = keyof typeof icons;',
      '',
    ].join('\n');

    // Записування файлу
    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');

    console.log(`✅ Файл ${OUTPUT_FILE} успішно згенеровано!`);
    console.log(`📊 Додано ${iconFiles.length} іконок з ${Object.keys(groupedIcons).length} директорій`);

    // Показуємо статистику по директоріях
    Object.keys(groupedIcons)
      .sort()
      .forEach(dir => {
        console.log(`   - ${dir}: ${groupedIcons[dir].length} іконок`);
      });
  } catch (error) {
    console.error('❌ Помилка при генеруванні файлу:', error.message);
    process.exit(1);
  }
}

// Запуск скрипту
generateIconsIndex();
