import React from "react";

export default function TaskForm({ task, employees = [], onChange, onSubmit }) {
  const handleChange = (field) => (e) => onChange({ ...task, [field]: e.target.value });

  const toggleAssign = (id) => {
    const assigned = task.assignedTo || [];
    const next = assigned.includes(id) ? assigned.filter(x => x !== id) : [...assigned, id];
    onChange({ ...task, assignedTo: next });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <input value={task.title || ''} onChange={handleChange('title')} placeholder="Title" className="w-full p-2 mb-2 border rounded" />
      <textarea value={task.description || ''} onChange={handleChange('description')} placeholder="Description" className="w-full p-2 mb-2 border rounded" />
      <input value={task.category || ''} onChange={handleChange('category')} placeholder="Category" className="w-full p-2 mb-2 border rounded" />
      <div className="mb-2">
        <div className="text-sm font-medium mb-1">Assign to</div>
        <div className="flex gap-2 flex-wrap">
          {employees.map(emp => (
            <button key={emp._id} type="button" onClick={() => toggleAssign(emp._id)} className={`px-2 py-1 border rounded text-sm ${ (task.assignedTo||[]).includes(emp._id) ? 'bg-blue-600 text-white' : 'bg-white'}`}>
              {emp.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onSubmit()} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
      </div>
    </div>
  );
}
