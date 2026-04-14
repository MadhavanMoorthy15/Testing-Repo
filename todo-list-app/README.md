# Today's Tasks - Todo List Application

A simple, elegant todo list application for managing daily tasks. Built with vanilla HTML, CSS, and JavaScript.

## Features

✅ **Create Tasks**: Add new tasks to your daily todo list  
✅ **Complete Tasks**: Check off tasks with visual strike-through feedback  
✅ **Delete Tasks**: Remove tasks you no longer need  
✅ **Persistent Storage**: Tasks are saved in browser localStorage  
✅ **Responsive Design**: Works beautifully on desktop and mobile  
✅ **Clean UI**: Modern, intuitive interface with smooth animations  

## Usage

### Running the Application

Simply open `index.html` in any modern web browser:

```bash
# Using a local web server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000

# Or open directly
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

### How to Use

1. **Add a Task**: Type your task in the input field and click "Add Task" or press Enter
2. **Complete a Task**: Click the checkbox next to a task to mark it as complete (text will be struck through)
3. **Uncomplete a Task**: Click the checkbox again to mark it as incomplete
4. **Delete a Task**: Click the red "Delete" button to remove a task
5. **Your tasks persist**: Close and reopen the browser - your tasks will still be there!

## Technical Details

### Technology Stack

- **HTML5**: Semantic markup with accessibility attributes
- **CSS3**: Modern styling with flexbox, gradients, and animations
- **JavaScript (ES6+)**: Class-based architecture with localStorage API

### File Structure

```
todo-list-app/
├── index.html      # Main HTML structure
├── styles.css      # Application styling
├── app.js          # Application logic
└── README.md       # This file
```

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with ES6 and localStorage support

### Data Storage

Tasks are stored in browser localStorage with the following structure:

```javascript
{
  id: "unique-id",
  text: "Task description",
  completed: false,
  createdAt: "2024-01-01T12:00:00.000Z"
}
```

**Note**: Data is stored per browser/domain. Tasks won't sync across different browsers or devices.

### Accessibility

- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management for better UX

## Development

No build tools or dependencies required! Just edit the files and refresh your browser.

### Customization

- **Colors**: Edit the gradient colors in `styles.css` (search for `linear-gradient`)
- **Fonts**: Modify the `font-family` in the `body` selector
- **Layout**: Adjust the `max-width` in `.container` for different sizes

## License

Free to use and modify for personal or commercial projects.

## Future Enhancements

Potential features for future versions:
- Task editing
- Task categories/tags
- Priority levels
- Due dates
- Data export/import
- Dark mode
- Task search/filter
