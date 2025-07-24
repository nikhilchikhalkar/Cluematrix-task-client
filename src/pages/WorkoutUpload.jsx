import React, { useState, useEffect } from 'react';
import api from '../api';

export default function WorkoutUpload() {
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sel, setSel] = useState({ member:'', class:'', file:null });

  useEffect(() => {
    api.get('/members').then(r=>setMembers(r.data));
    api.get('/classes').then(r=>setClasses(r.data));
  }, []);

  const handle = e => {
    const { name, value, files } = e.target;
    setSel(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const upload = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('member', sel.member);
    fd.append('class', sel.class);
    fd.append('file', sel.file);
    await api.post('/workouts/upload', fd);
    alert('Uploaded');
  };

  return (
    <form onSubmit={upload} className="space-y-4">
      <select name="member" onChange={handle} className="border p-2 w-full" required>
        <option value="">Select Member</option>
        {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
      </select>
      <select name="class" onChange={handle} className="border p-2 w-full" required>
        <option value="">Select Class</option>
        {classes.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
      <input type="file" name="file" accept="application/pdf" onChange={handle} required />
      <button className="bg-blue-500 text-white py-2 px-4">Upload PDF</button>
    </form>
  );
}
