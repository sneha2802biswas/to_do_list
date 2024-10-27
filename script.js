
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const errorMsg = document.getElementById('errorMsg');

    loadTasks();

    addTaskBtn.addEventListener('click', addTask);

    function addTask() {
        const taskTitle = taskInput.value.trim();
        const dueDate = dueDateInput.value;

        
        if (!taskTitle || !dueDate) {
            errorMsg.textContent = 'Please enter both task title and due date!';
            return;
        }
        errorMsg.textContent = ''; 

        const task = {
            title: taskTitle,
            dueDate: dueDate,
            completed: false,
        };

        saveTask(task);
        renderTask(task);
        taskInput.value = '';
        dueDateInput.value = '';
    }


    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

   
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => renderTask(task));
    }

    
    function renderTask(task) {
        const li = document.createElement('li');
        const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

        li.className = task.completed ? 'completed' : isOverdue ? 'overdue' : '';

        li.innerHTML = `
            ${task.title} — ${task.dueDate}
            <div>
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li);

       
        li.querySelector('.complete-btn').addEventListener('click', () => completeTask(task, li));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task, li));
    }

   
    function completeTask(task, li) {
        if (confirm('Mark this task as complete?')) {
            task.completed = true;
            updateTaskStatus(task);
            li.classList.add('completed');
        }
    }

    
    function deleteTask(task, li) {
        if (confirm('Are you sure you want to delete this task?')) {
            removeTask(task);
            li.remove();
        }
    }

    
    function updateTaskStatus(updatedTask) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.title === updatedTask.title);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = updatedTask.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    
    function removeTask(deletedTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.title !== deletedTask.title);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
