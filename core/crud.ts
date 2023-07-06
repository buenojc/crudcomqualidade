import fs from "fs";
const DB_FILE_PATH = "./core/db";
import { v4 as uuid } from "uuid";

console.log("[CRUD]");

// Esse tipo serve para dar mais clareza às funções. O UUID é uma string, mas criando um tipo para ela,
// em todas as funções e tipos podemos adicionar o TIPO UUID, sendo mais claro qual o dado para quem está lendo a função. 
type UUID = string;

// interface é um tipo de molde para aquele dado. No caso, um TODO deve conter todos os dados abaixo e com os respectivos tipos
interface Todo {
  id: UUID;
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
function update(id: UUID, partialTodo: Partial<Todo>): Todo {
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
function updateContentById(id: UUID, content:string): Todo{
    return update(id, {
        content
    })
}

function deleteById(id: UUID){
  const todos = read()
  const todosWithoutOne = todos.filter((todo) => {
    // No .filter o o que for verdadeiro fica no filtro, o que for falso sai. 
    // É retornado um array com todos os itens que retornaram true
    if(id === todo.id){
      return false
    }
    return true
  })

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos: todosWithoutOne }, null, 2));
}


function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
CLEAR_DB();
create("Primeira TODO");
const secondTodo = create("Segunda TODO");
const thirdTodo = create("Terceira TODO");
updateContentById(thirdTodo.id, 'Ultima Atualização TODO')
deleteById(secondTodo.id)
console.log(read())
