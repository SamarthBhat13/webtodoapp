import React, { useState, useEffect } from 'react';


function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!task.trim()) return alert("Please enter a task!");
    const newTodo = {
      id: editIndex !== null ? todos[editIndex].id : Date.now(),
      task: task.trim(),
      priority,
      completed: editIndex !== null ? todos[editIndex].completed : false,
    };
    if (editIndex !== null) {
      const updatedTodos = todos.map((todo, index) => index === editIndex ? newTodo : todo);
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      setTodos([newTodo, ...todos]);
    }
    setTask('');
    setPriority('medium');
  };

  const handleEdit = (index) => {
    setTask(todos[index].task);
    setPriority(todos[index].priority);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const filteredTodos = todos.filter((_, i) => i !== index);
    setTodos(filteredTodos);
    if (index === editIndex) {
        setTask('');
        setPriority('medium');
        setEditIndex(null);
    }
  };

  const handleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) => i === index ? { ...todo, completed: !todo.completed } : todo);
    setTodos(updatedTodos);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-danger';           
      case 'medium': return 'bg-warning text-dark'; 
      case 'low': return 'bg-success';          
      default: return 'bg-light text-dark';   
    }
  };

  const primaryBtnClass = 'btn-primary';

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header - Gray with white text */}
        <div className="row mb-4">
          <div className={`col-12 text-center bg-secondary text-white py-3 rounded shadow-sm`}>
            <h1><i className="bi bi-check2-square me-2"></i>Todo App</h1>
          </div>
        </div>

        <div className="row g-4">
          {/* Add/Edit Task Form Column */}
          <div className="col-lg-5">
            <div className="card shadow-sm">
              {/* Card header with gray text accent */}
              <div className={`card-header bg-white text-secondary`}>
                 <h3 className="mb-0 text-center">{editIndex !== null ? 'Edit Task' : 'Add New Task'}</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddOrUpdate}>
                   {/* Task Input */}
                   <div className="mb-3">
                    <label htmlFor="taskInput" className="form-label">Task Description</label>
                    <input id="taskInput" type="text" className="form-control" value={task} onChange={(e) => setTask(e.target.value)} placeholder="What needs to be done?" required />
                  </div>
                  {/* Priority Select */}
                  <div className="mb-3">
                    <label htmlFor="prioritySelect" className="form-label">Priority</label>
                    <select id="prioritySelect" className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  {/* Submit Button - Primary color for emphasis */}
                  <button type="submit" className={`btn ${primaryBtnClass} w-100`}>
                    {editIndex !== null ? (<><i className="bi bi-pencil-fill me-1"></i> Update Task</>) : (<><i className="bi bi-plus-circle-fill me-1"></i> Add Task</>)}
                  </button>
                  {/* Cancel Button */}
                  {editIndex !== null && (
                    <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => { setEditIndex(null); setTask(''); setPriority('medium'); }}>
                       <i className="bi bi-x-circle me-1"></i> Cancel Edit
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Task List Column */}
          <div className="col-lg-7">
            <div className="card shadow-sm">
               {/* Card header with gray text accent */}
              <div className={`card-header bg-white text-secondary`}>
                <h3 className="mb-0 text-center">Current Tasks</h3>
              </div>
              <div className="card-body p-0">
                {todos.length === 0 ? (
                   <p className="text-center text-muted p-4 mb-0">No tasks yet! Add one using the form.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle"> {/* Added align-middle to table */}
                      <thead className="table-light">
                        <tr>
                           {/* Adjusted width slightly for button text */}
                           <th style={{ width: '15%' }} className="text-center">Status</th>
                          <th>Task</th>
                          <th className="text-center">Priority</th>
                          {/* Adjusted width slightly for button text */}
                          <th style={{ width: '25%' }} className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todos.map((todo, index) => (
                          <tr key={todo.id || index} className={todo.completed ? 'opacity-75' : ''}>
                            {/* Status Button with Text */}
                            <td className="text-center">
                               <button
                                  className={`btn btn-sm ${todo.completed ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                  onClick={() => handleComplete(index)}
                                  title={todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                                >
                                  {todo.completed
                                    ? <><i className="bi bi-arrow-counterclockwise me-1"></i>Undo</>
                                    : <><i className="bi bi-check-lg me-1"></i>Done</>
                                  }
                                </button>
                            </td>
                            {/* Task Text */}
                            <td className={`${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                              {todo.task}
                            </td>
                            {/* Priority Badge */}
                            <td className="text-center">
                              <span className={`badge ${getPriorityBadge(todo.priority)} p-2`}>{todo.priority}</span>
                            </td>
                             {/* Action Buttons with Text */}
                            <td className="text-center">
                              <button
                                className="btn btn-outline-warning btn-sm me-1"
                                onClick={() => handleEdit(index)}
                                title="Edit Task"
                                disabled={editIndex === index}
                              >
                                <i className="bi bi-pencil me-1"></i> Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(index)}
                                title="Delete Task"
                              >
                                 <i className="bi bi-trash me-1"></i> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
               {/* Footer */}
               {todos.length > 0 && (
                 <div className="card-footer text-muted text-center">
                   Total Tasks: {todos.length} | Completed: {todos.filter(t => t.completed).length}
                 </div>
               )}
            </div>
          </div>
        </div> {/* End row */}
      </div> {/* End container */}
    </div>
  );
}

export default App;