import fs from 'fs'
const DB_FILE_PATH = './core/db'

console.log('[CRUD]')

interface Todo {
    date: string,
    content: string,
    done: boolean
}

function create(content: string){
    // salvar o content no sistema
    const todo: Todo = {
        date: new Date().toISOString(),
        content: content,
        done: false
    }

    // Diz que o todo é um array de Todo. Existe mais de uma forma de indicar isso,
    // a maneira abaixo é chamado Diamond Operator
    const todos: Array<Todo> = [
        ...read(),
        todo
    ]

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({todos:todos}, null, 2))
    return content
}


// Função que deve retornar um array de Todos. Adicionar : + tipo depois da declaração da função indica o tipo de seu retorno
function read(): Array<Todo>{
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8")
    // Caso o arquivo db esteja vazio, o JSON.parse vai retornar "{}".
    const db = JSON.parse(dbString || "{}")

    if(db.todos){
        return db.todos
    }

    return []
}


function CLEAR_DB(){
    fs.writeFileSync(DB_FILE_PATH, "")
}

// [SIMULATION]
CLEAR_DB()
create('Primeira TODO')
create('Segunda TODO')
create('Terceira TODO')
console.log(read())