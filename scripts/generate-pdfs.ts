import puppeteer from 'puppeteer'
import { exec, ChildProcess } from 'child_process'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { mkdir } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

interface TeamMember {
  id: number
  fullName: string
  age: number
  hobbies: string
  games: string
  summer: string
  expectations: string
}

const generatePDFs = async () => {
  console.log('Starting PDF generation...')

  // Load members data
  const membersModule = await import('../data/members.ts')
  const members: TeamMember[] = membersModule.members

  // Create pdfs directory if it doesn't exist
  const pdfsDir = join(rootDir, 'pdfs')
  await mkdir(pdfsDir, { recursive: true })

  // Start preview server
  console.log('Starting Nuxt preview server...')
  const previewProcess = exec('npm run preview', { cwd: rootDir }) as ChildProcess
  
  let serverUrl = ''
  let serverReady = false

  const checkServerReady = (data: string) => {
    const output = data.toString()
    console.log(output)
    
    // Try to extract the URL from the output
    const urlMatch = output.match(/http:\/\/localhost:\d+/)
    if (urlMatch && !serverUrl) {
      serverUrl = urlMatch[0]
      console.log(`Server started at ${serverUrl}`)
      serverReady = true
    }
  }

  previewProcess.stdout?.on('data', checkServerReady)
  previewProcess.stderr?.on('data', checkServerReady)

  // Handle preview process errors
  previewProcess.on('error', (error) => {
    console.error('Error starting preview server:', error)
  })

  previewProcess.on('exit', (code) => {
    if (code !== null && code !== 0 && code !== 143) {
      console.error(`Preview server exited with code ${code}`)
    }
  })

  // Wait for server to be ready (up to 30 seconds)
  for (let i = 0; i < 30; i++) {
    if (serverReady && serverUrl) break
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // If we didn't get the URL from stdout, try default port
  if (!serverUrl) {
    serverUrl = 'http://localhost:3000'
    console.log(`Using default URL: ${serverUrl}`)
  }

  // Launch browser
  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    
    // Set viewport
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2
    })

    // Process each member
    for (const member of members) {
      console.log(`Generating PDF for ${member.fullName} (ID: ${member.id})...`)
      
      // Preview server typically doesn't use baseURL, so we use direct path
      const url = `${serverUrl}/${member.id}`
      console.log(`Opening: ${url}`)
      
      try {
        await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: 60000
        })

        // Wait a bit more for any animations or dynamic content
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Generate safe filename
        const safeName = member.fullName.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')
        const pdfPath = join(pdfsDir, `member-${member.id}-${safeName}.pdf`)

        // Generate PDF
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          }
        })

        console.log(`✓ PDF generated: ${pdfPath}`)
      } catch (error) {
        console.error(`✗ Error generating PDF for ${member.fullName}:`, error)
      }
    }

    console.log('All PDFs generated successfully!')
  } finally {
    await browser.close()
    if (previewProcess.pid) {
      previewProcess.kill('SIGTERM')
      // Wait a bit for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (!previewProcess.killed) {
        previewProcess.kill('SIGKILL')
      }
    }
    console.log('Browser closed and server stopped.')
  }
}

generatePDFs().catch(error => {
  console.error('Error during PDF generation:', error)
  process.exit(1)
})

