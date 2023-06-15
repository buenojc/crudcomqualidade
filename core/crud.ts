import fs from 'fs'
const DB_FILE_PATH = './core/db'

console.log('[CRUD]')

function create(content: string){
    // salvar o content no sistema
    fs.writeFileSync(DB_FILE_PATH, content)
    return content
}


// [SIMULATION]

console.log(create('Teste de reload'))