// Task management application
class TodoApp {
    constructor() {
        this.tasks = [];
        this.todoForm = document.getElementById('todoForm');
        this.taskInput = document.getElementById('taskInput');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        
        this.init();
    }

    // Initialize the application
    init() {
        this.loadTasks();
        this.renderTasks();
        this.attachEventListeners();
        this.taskInput.focus();
    }

    // Attach event listeners
    attachEventListeners() {
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
    }

    // Generate unique ID for tasks
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Add new task
    addTask() {
        const taskText = this.taskInput.value.trim();
        
        // Validate input - prevent empty tasks
        if (taskText === '') {
            return;
        }

        // Create task object
        const task = {
            id: this.generateId(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        // Add to tasks array
        this.tasks.push(task);
        
        // Save to localStorage
        this.saveTasks();
        
        // Clear input field
        this.taskInput.value = '';
        
        // Re-render tasks
        this.renderTasks();
        
        // Return focus to input
        this.taskInput.focus();
    }

    // Toggle task completion
    toggleComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    // Delete task
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    // Render all tasks
    renderTasks() {
        // Clear current list
        this.todoList.innerHTML = '';

        // Show empty state if no tasks
        if (this.tasks.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }

        // Hide empty state
        this.emptyState.style.display = 'none';

        // Render each task
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.todoList.appendChild(taskElement);
        });
    }

    // Create task element
    createTaskElement(task) {
        // Create list item
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark task as ${task.completed ? 'incomplete' : 'complete'}`);
        checkbox.addEventListener('change', () => {
            this.toggleComplete(task.id);
        });

        // Create task text
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete task: ${task.text}`);
        deleteButton.addEventListener('click', () => {
            this.deleteTask(task.id);
        });

        // Append elements
        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteButton);

        return li;
    }

    // Save tasks to localStorage
    saveTasks() {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    }

    // Load tasks from localStorage
    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('todoTasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            this.tasks = [];
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
