import puppeteer from 'puppeteer'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { mkdir, readFile } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

interface TeamMember {
  id: number
  fullName: string
  age: number
}

const toBase64 = async (filePath: string): Promise<string> => {
  const data = await readFile(filePath)
  return data.toString('base64')
}

const generatePhotosPDF = async () => {
  console.log('Загрузка данных участников...')

  const membersModule = await import('../data/members.ts')
  const members: TeamMember[] = membersModule.members

  const pdfsDir = join(rootDir, 'pdfs')
  await mkdir(pdfsDir, { recursive: true })

  // Кодируем фото в base64 чтобы встроить в HTML
  const photosDir = join(rootDir, 'public', 'photos')
  const photoItems: { name: string; base64: string }[] = []

  for (const member of members) {
    const photoPath = join(photosDir, `${member.id}.png`)
    try {
      const base64 = await toBase64(photoPath)
      photoItems.push({ name: member.fullName, base64 })
    } catch {
      console.warn(`Фото для ${member.fullName} не найдено: ${photoPath}`)
    }
  }

  // Для фото 3 и 4 сдвигаем кадр вниз на 75%
  const photoObjectPosition: Record<number, string> = {
    3: 'center 25%',
    4: 'center 25%',
  }

  // Генерируем HTML с сеткой фото
  const photoCards = members.map((member, idx) => {
    const item = photoItems[idx]
    if (!item) return ''
    const pos = photoObjectPosition[member.id] ?? 'center center'
    return `
    <div class="photo-card">
      <div class="photo-frame">
        <img src="data:image/png;base64,${item.base64}" alt="${item.name}" style="object-position: ${pos};" />
      </div>
      <div class="photo-name">${item.name}</div>
    </div>`
  }).join('')

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Arial', sans-serif;
      background: #ffffff;
      color: #222;
    }

    h1 {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 16px;
      letter-spacing: 1px;
      color: #111;
    }

    .grid {
      display: grid;
      /* 3 колонки — удобно для 7 фото (3+3+1) */
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      width: 100%;
    }

    .photo-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .photo-frame {
      width: 100%;
      /* Квадратная рамка */
      aspect-ratio: 1 / 1;
      border: 2px solid #333;
      border-radius: 4px;
      overflow: hidden;
      background: #f0f0f0;
    }

    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .photo-name {
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      color: #333;
    }
  </style>
</head>
<body>
  <h1>Broken Pixels — Робокод — Екатеринбург</h1>
  <div class="grid">
    ${photoCards}
  </div>
</body>
</html>`

  console.log('Запуск браузера...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'load' })
    await new Promise(resolve => setTimeout(resolve, 1000))

    const pdfPath = join(pdfsDir, 'photos-print-v3.pdf')

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    })

    console.log(`✓ PDF сохранён: ${pdfPath}`)
  } finally {
    await browser.close()
    console.log('Браузер закрыт.')
  }
}

generatePhotosPDF()
  .then(() => {
    console.log('Готово.')
    process.exit(0)
  })
  .catch(error => {
    console.error('Ошибка:', error)
    process.exit(1)
  })
