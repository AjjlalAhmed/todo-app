// HTML collection
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const removeAllBtn = document.querySelector("#remove-all");
const currentTime = document.querySelector(".time");

// Creating Database
const db = new Localbase("db");

// Calling get data function
getDataFromDB();

// Calling live time function
startTime();

async function addTodo() {
  const inputValue = document.getElementById("input-value").value;
  let id = 0;
  if (document.querySelectorAll(".todo")) {
    const todo = document.querySelectorAll(".todo");
    id = todo.length;
  }
  if (inputValue != "") {
    const result = await db.collection("todos").add({
      id: id,
      todo: inputValue,
      done: false,
      date: Date.now(),
    });
    getDataFromDB();
    document.getElementById("input-value").value = "";
  } else {
    alert("Please enter something!");
  }
}

// Removes all todos from dom
async function removeAll() {
  await db.collection("todos").delete();
  getDataFromDB();
}
// Removes selected todo from dom
async function removeItem(e) {
  const id = Number(e.parentElement.parentElement.id);
  await db.collection("todos").doc({ id: id }).delete();
  getDataFromDB();
}

async function editItem(e) {
  const id = Number(e.parentElement.parentElement.id);
  const div = `<div class="edit-form">
    <p>todo value : ${e.parentElement.previousElementSibling.innerHTML}</p>
    <span>
    <input type="text" placeholder="Edit this todo"/>
    <button onclick="editTodo(this,${id})">
    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
    </button>
    </span>
    <button class="exits-btn" onclick="exitsEdit()">exits
    </button>
  </div>`;
  document.getElementById("todo-list").innerHTML = div;
}

// Add finish and finish from todo
async function finishItem(e) {
  const id = Number(e.parentElement.parentElement.id);
  const result = await db.collection("todos").doc({ id: id }).get();
  if (result.id == id) {
    if (result.done === true) {
      await db.collection("todos").doc({ id: id }).update({ done: false });
      getDataFromDB();
    } else if (result.done === false) {
      await db.collection("todos").doc({ id: id }).update({ done: true });
      getDataFromDB();
    }
  }
}

//Get all todos
function getDataFromDB(action) {
  db.collection("todos")
    .get()
    .then((todo) => {
      if (todo.length == 0) {
        document.getElementById(
          "todo-list"
        ).innerHTML = `<p class="add-todos">you currently don't have any todos</p>`;
      } else {
        document.getElementById("todo-list").innerHTML = "";
        todo.forEach((data) => {
          let html;
          if (data.done) {
            html = `<li class="todo"  id="${data.id}">
            <p class="finish-style">${data.todo}</p>
            <span>
              <button class="remove-btn" onclick="removeItem(this)"><i class="fa fa-trash" aria-hidden="true"></i></button>
              <button class="edit-btn" onclick="editItem(this)"><i class="fa fa-pencil-square" aria-hidden="true"></i>
                </button>
              <button class="finish-btn" onclick="finishItem(this)"><i class="fa fa-check" aria-hidden="true"></i></button>
              </span>
            </li>`;
          } else {
            html = `<li class="todo" id="${data.id}">
            <p>${data.todo}</p> 
            <span>
              <button class="remove-btn"  onclick="removeItem(this)"><i class="fa fa-trash" aria-hidden="true"></i>
              <button class="edit-btn" onclick="editItem(this)"><i class="fa fa-pencil-square" aria-hidden="true"></i>
                </button>
              </button><button class="finish-btn" onclick="finishItem(this)"><i class="fa fa-check" aria-hidden="true"></i>
                </button>
            </span>
          </li>`;
          }
          document.getElementById("todo-list").innerHTML += html;
          document.querySelectorAll(".todo").forEach((item) => {
            item.addEventListener("click", showMore);
          });
        });
      }
    });
}

// Exits edit modal
function exitsEdit() {
  getDataFromDB();
}

// edit todo value
async function editTodo(e, id) {
  const todo = e.previousElementSibling.value;
  const result = await db.collection("todos").doc({ id: id }).get();
  if (result.id == id) {
    await db.collection("todos").doc({ id: id }).update({ todo: todo });
    getDataFromDB();
  }
}

//Creating live time display
function startTime() {
  currentTime.innerHTML = new Date().toUTCString().replace("GMT", "");
  setTimeout(startTime, 500);
}

// Show more or less
function showMore(e) {
  if (e.target.classList.contains("todo")) {
    if (e.target.firstElementChild.classList.contains("expend")) {
      e.target.firstElementChild.classList.remove("expend");
    } else {
      e.target.firstElementChild.classList.add("expend");
    }
  } else {
    if (e.target.classList.contains("expend")) {
      e.target.classList.remove("expend");
    } else {
      e.target.classList.add("expend");
    }
  }
}

// Add Event Listener add btn
addBtn.addEventListener("click", addTodo);

// Add Event Listener add btn on enter
document.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    addTodo();
  }
});

// Add Event Listener add remove all btn
removeAllBtn.addEventListener("click", removeAll);

if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("service-worker.js");
}
