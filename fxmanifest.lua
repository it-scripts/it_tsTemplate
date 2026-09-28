fx_version 'cerulean'
game 'gta5'

author 'it_scripts'
description 'Modern TypeScript & Vue 3 + TailwindCSS FiveM Template'version '1.1.0'

-- NUI Page Entrypoint
ui_page 'dist/web/index.html'

-- Client Scripts
client_scripts {
    'dist/client.js'
}

-- Server Scripts
server_scripts {
    'dist/server.js'
}

-- Embedded files (NUI Assets, Config & Locales)
files {
    'config.json',
    'dist/web/index.html',
    'dist/web/**/*',
    'locales/*.json'
}
