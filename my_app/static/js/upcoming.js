// Fetch and display user tasks
function fetchUserTasks() {
    fetch('/get-user-tasks/')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                renderTasks(data.tasks);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

// Render tasks based on the selected sort order
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing tasks

    // Get sort order from localStorage
    const sortOrder = localStorage.getItem('taskSortOrder') || 'highest';

    // Sort tasks based on selected order
    tasks.sort((a, b) => {
        const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        return sortOrder === 'highest'
            ? priorityOrder[b.task_priority.toLowerCase()] - priorityOrder[a.task_priority.toLowerCase()]
            : priorityOrder[a.task_priority.toLowerCase()] - priorityOrder[b.task_priority.toLowerCase()];
    });

    // Render sorted tasks
    tasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.classList.add('task', `${task.task_priority.toLowerCase()}-priority`);

        taskElement.innerHTML = `
            <h1 class="project-title">${task.project_name}</h1>
            <div class="rowUpcoming">
                <span class="label">Due:</span>
                <span class="value">${task.end_date}</span>
            </div>
            <div class="rowUpcoming">
                <span class="label">Priority:</span>
                <span class="value priority ${task.task_priority.toLowerCase()}">
                    ${task.task_priority.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                </span>
            </div>
            <div class="rowUpcoming">
                <span class="label">Task Name:</span>
                <span class="value">${task.task_name}</span>
            </div>
        `;

        taskList.appendChild(taskElement);
    });
}

// Toggle filter and save to localStorage
function toggleTaskSortOrder() {
    let currentOrder = localStorage.getItem('taskSortOrder') || 'highest';
    let newOrder = currentOrder === 'highest' ? 'lowest' : 'highest';

    localStorage.setItem('taskSortOrder', newOrder);
    fetchUserTasks(); // Re-fetch and re-render tasks with the new order
}

// Event listener for the filter button
document.addEventListener('DOMContentLoaded', () => {
    fetchUserTasks();

    const filterBtn = document.querySelector('.filter-btn');
    filterBtn.addEventListener('click', toggleTaskSortOrder);
});
