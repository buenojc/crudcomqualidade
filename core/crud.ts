import fs from "fs";
const DB_FILE_PATH = "./core/db";
import { v4 as uuid } from "uuid";

console.log("[CRUD]");

// interface é um tipo de molde para aquele dado. No caso, um TODO deve conter todos os dados abaixo e com os respectivos tipos
interface Todo {
  id: string;
  date: string;
  content: string;
  done: boolean;
}

function create(content: string): Todo {
  // salvar o content no sistema
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  // Diz que o todo é um array de Todo. Existe mais de uma forma de indicar isso,
  // a maneira abaixo é chamado Diamond Operator
  const todos: Array<Todo> = [...read(), todo];

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos: todos }, null, 2));
  return todo;
}

// Função que deve retornar um array de Todos. Adicionar : + tipo depois da declaração da função indica o tipo de seu retorno
function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  // Caso o arquivo db esteja vazio, o JSON.parse vai retornar "{}".
  const db = JSON.parse(dbString || "{}");

  if (db.todos) {
    return db.todos;
  }

  return [];
}

// Esse partial indica que pode receber alguma coisa do Todo, ou seja todos os atributos podem existir ou serem nulos
function update(id: string, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      // O Object.assign pega um objeto e o combina com o outro, atualizando as propriedades de mesmo nome.
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos: todos }, null, 2));

  if(!updatedTodo){
    throw new Error('Please, provide another ID!')
  }

  return updatedTodo;
}

// Normalmente em um sistema em produção não é possível alterar um objeto completamente,
// Então é mais comum usar funções que atualizam uma coisa só, como essa de atualizar só content
function updateContentById(id: string, content:string): Todo{
    return update(id, {
        content
    })
}


function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
CLEAR_DB();
create("Primeira TODO");
create("Segunda TODO");
const terceiraTodo = create("Terceira TODO");
updateContentById(terceiraTodo.id, 'Ultima Atualização TODO')
console.log(read());
