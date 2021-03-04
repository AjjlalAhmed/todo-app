// HTML collection
const todoList = document.getElementById("todo-list");
const addBtn = document.getElementById("add-btn");
const removeAll = document.getElementById("remove-all");
// onload function
const onload = () =>{
    if(localStorage.length > 0){
       let newData = JSON.parse(localStorage.getItem("allItem"));
        todoList.innerHTML = Object.values(newData).join('');
    }else{
        localStorage.setItem("allItem", JSON.stringify({}));
    }
};
onload();
// addEventListener on addBtn
addBtn.addEventListener("click", () =>{
    const inputValue = document.getElementById("input-value").value;
    if(inputValue != ""){
        // Create HTML element
        const li = document.createElement("li");
        const span = document.createElement("span");
        const removeBtn = document.createElement("button");
        const finishBtn = document.createElement("button");
        // Adding unique id in removeBtn 
        let uid = Date.now();
        removeBtn.id = uid;
        // removeBtn function
        removeBtn.onclick = removeData;
        //finishbtn function
        finishBtn.onclick = finishTodo;
        // Adding innerHTMl
        removeBtn.innerHTML =`<i class="fa fa-trash" aria-hidden="true"></i>` ;
        finishBtn.innerHTML = `<i class="fa fa-check" aria-hidden="true"></i>`;
        // Adding class
        removeBtn.classList.add("remove-btn");
        finishBtn.classList.add("finish-btn");
        // Appending
        span.append(removeBtn,finishBtn);
        li.append(inputValue,span);
        todoList.append(li);
        // Save in localStorage
        let newData = JSON.parse(localStorage.getItem("allItem"));
        newData[uid] = li.outerHTML;
        localStorage.setItem("allItem", JSON.stringify(newData));
        // delete inputText
        document.getElementById("input-value").value = '';
    }else{
        alert("Please enter something");
    }
})


document.querySelectorAll(".remove-btn").forEach(function(element) {
    element.addEventListener('click', removeData);
    
});

// removeBtn function
function removeData(e) {
    let obj = JSON.parse(localStorage.getItem("allItem"));
    delete obj[e.target.id];
    localStorage.setItem("allItem", JSON.stringify(obj));
    e.target.parentElement.parentElement.classList.add("animation-1")
    e.target.parentElement.parentElement.addEventListener("transitionend", () =>{
        e.target.parentElement.parentElement.remove(); 
    }); 
}
document.querySelectorAll(".finish-btn").forEach(function(element) {
    element.addEventListener('click', finishTodo);
    
});
// finishTodo function
function finishTodo(e){
    e.target.parentElement.parentElement.classList.toggle("finish-style");
}
// removeAll function
removeAll.addEventListener("click", () =>{
    todoList.classList.add("animation-2")
    todoList.addEventListener('transitionend', removeFunction);
    function removeFunction(){
        todoList.classList.remove("animation-2");
        todoList.innerHTML = "";
        todoList.removeEventListener("transitionend", removeFunction)
        localStorage.setItem("allItem", JSON.stringify({}));
    }
})
