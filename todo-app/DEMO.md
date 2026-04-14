# Todo App Demo Instructions

## Quick Start

1. **Open the application**
   - Navigate to the `todo-app` folder
   - Double-click `index.html` to open in your default browser
   - Or right-click → Open with → Choose your preferred browser

2. **Try These Actions**

   **Adding Tasks:**
   - Type "Buy groceries" in the input field
   - Click "Add Task" or press Enter
   - Add a few more tasks: "Finish project", "Call mom", "Exercise"

   **Completing Tasks:**
   - Click the checkbox next to "Buy groceries"
   - Notice the text becomes **struck through** and faded
   - The completed count updates automatically

   **Uncompleting Tasks:**
   - Click the checkbox again to uncheck
   - The strike-through effect is removed

   **Deleting Tasks:**
   - Click the "Delete" button next to any task
   - Confirm the deletion

   **Clear Completed:**
   - Check multiple tasks as complete
   - Click "Clear Completed" at the bottom
   - All completed tasks are removed at once

   **Persistence Test:**
   - Add some tasks
   - Close the browser
   - Reopen `index.html`
   - Your tasks are still there! (stored in browser's localStorage)

## Visual Features to Notice

- 📅 Today's date is displayed at the top
- 📊 Statistics show total tasks and completed count
- ✨ Smooth animations when adding tasks
- 🎨 Gradient purple background
- 📱 Responsive - try resizing your browser window
- 🖱️ Hover effects on tasks and buttons
- ✅ Strike-through styling when tasks are completed

## Browser Developer Tools Test

Open the browser console (F12) and try:

```javascript
// View stored todos
console.log(localStorage.getItem('todos'));

// Clear all todos (then refresh page)
localStorage.removeItem('todos');
```

## Screenshot Locations

When checked, tasks will appear like this:
```
☑ Buy groceries  [struck through text in gray]
☐ Finish project
☑ Exercise       [struck through text in gray]
```

Enjoy your new todo list! 🎉
