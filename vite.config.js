import react from '@vitejs/plugin-react'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

function notFoundPage() {
  let outputDirectory

  return {
    name: 'not-found-page',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const html = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')
      await writeFile(
        resolve(outputDirectory, '404.html'),
        html.replace('<head>', '<head>\n    <meta name="robots" content="noindex" data-route-robots />'),
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), notFoundPage()],
})
