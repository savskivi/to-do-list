const modalAdd = document.querySelector('.modal-add');
const modalEdit = document.querySelector('.modal-edit');
const addTaskBtn = document.querySelector('.btn__add-task');
const modals = document.querySelectorAll('.modal');
const taskTemplate = document.querySelector('.task-template');
const emptyTemplate = document.querySelector('.empty-template');
const container = document.querySelector('.list__container');
const inputTitle = document.querySelector('.add-task__input-title');
const inputDetail = document.querySelector('.add-task__input-detail');
const addTaskForm = document.querySelector('.add-task__form');
const inputEditTitle = document.querySelector('.edit-title');
const inputEditDetail = document.querySelector('.edit-detail');
const updateTaskForm = document.querySelector('.edit-task__form');
const cancelTaskBtn = document.querySelector('.cancel-task__btn');
const showAllBtn = document.querySelector('.footer-all');
const showCompletedBtn = document.querySelector('.footer-completed');


let taskList = getTasks();

function openModalAdd(){
    modalAdd.classList.add('modal-active');
}

function openModalEdit(id){
    modalEdit.classList.add('modal-active');
    const task = taskList.find((item) => item.id == id);
    inputEditTitle.value = task.title;
    inputEditDetail.value = task.detail;
    updateTaskForm.onsubmit = (e) => updateTask(e, id);
}

function updateTask(e, id){
    e.preventDefault();
    taskList = taskList.map((item) =>{
        if(item.id == id){
            item.title = inputEditTitle.value;
            item.detail = inputEditDetail.value;
        }
        return item;
    })
    saveTasks();
    renderTasks(taskList);
    closeModal();
}

cancelTaskBtn.onclick = closeModal;

function closeModal(){
    modalAdd.classList.remove('modal-active');
    modalEdit.classList.remove('modal-active');
}

addTaskBtn.onclick = openModalAdd;

modals.forEach((modal)=>{
    modal.onclick = function(e){
        if(!e.target.closest('.modal-container')){
            closeModal();
        }
    }
})

function renderTasks(list){
    container.innerHTML = '';
    if(list.length == 0){
        const clone = emptyTemplate.content.cloneNode(true);
        container.append(clone);
    }
    list.forEach((task) => {
        const clone = taskTemplate.content.cloneNode(true);
        const taskTitle = clone.querySelector('.task__title');
        const taskSubtitle = clone.querySelector('.task__subtitle');

        const taskEdit = clone.querySelector('.tasks__edit-icon');
        taskEdit.onclick = () => openModalEdit(task.id);

        const taskDelete = clone.querySelector('.tasks__delete-icon');
        taskDelete.onclick = () => deleteTask(task.id);

        const taskContainer = clone.querySelector('.task__container');
        if(task.complete){
            taskContainer.classList.add('task__container-active');
        }

        const taskComplete = clone.querySelector('.tasks__complete-icon');
        taskComplete.onclick = () => completeTask(task.id);
        taskTitle.innerHTML = task.title;
        taskSubtitle.innerHTML = task.detail;
        container.append(clone);
    })
}
renderTasks(taskList);

function addTask(e){
    e.preventDefault();
    const title = inputTitle.value;
    const detail = inputDetail.value;
    taskList.push(
        {
            id: Date.now(),
            title: title,
            detail: detail,
            complete: false
        }
    )
    saveTasks();
    renderTasks(taskList);
    closeModal();
}

addTaskForm.onsubmit = addTask;

function completeTask(id){
    taskList = taskList.map((item) =>{
        if(item.id == id){
            item.complete = true;
        }
        return item;
    })
    renderTasks(taskList);

}

function deleteTask(id){
    taskList = taskList.filter((item) => item.id != id);

    saveTasks();
    renderTasks(taskList);
}

showAllBtn.onclick = showAll;
showCompletedBtn.onclick = showCompleted;

function showAll(){
    showAllBtn.classList.add('footer__button-active');
    showCompletedBtn.classList.remove('footer__button-active');

    renderTasks(taskList);
}

function showCompleted(){
    showCompletedBtn.classList.add('footer__button-active');
    showAllBtn.classList.remove('footer__button-active');

    const filteredList = taskList.filter((item) => item.complete);
    renderTasks(filteredList);
}



function saveTasks(){
    localStorage.setItem('task-list', JSON.stringify(taskList));
}

function getTasks(){
    const saveList = localStorage.getItem('task-list');
    if(saveList){
        return JSON.parse(saveList);
    } else{
        return [];
    }
}