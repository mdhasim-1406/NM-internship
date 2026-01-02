import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/people';

function App() {
  const [people, setPeople] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // GET (all) - Fetch all people
  const fetchPeople = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // POST or PUT - Create or Update person
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(`Successfully ${editingId ? 'updated' : 'created'} person (${method})`);
        setFormData({ name: '', email: '' });
        setEditingId(null);
        fetchPeople();
      }
    } catch (error) {
      console.error('Error saving person:', error);
    }
  };

  // DELETE - Remove a person
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Successfully deleted person (DELETE)');
        fetchPeople();
      }
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const handleEdit = (person) => {
    setEditingId(person.id);
    setFormData({ name: person.name, email: person.email });
    setMessage(`Editing person ID: ${person.id} (Preparing PUT)`);
  };

  return (
    <div className="container">
      <h1>CRUD Application (Day-3 KT)</h1>
      {message && <div className="alert">{message}</div>}

      <div className="form-section">
        <h2>{editingId ? 'Edit Person (PUT)' : 'Add Person (POST)'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className={editingId ? 'btn-update' : 'btn-add'}>
            {editingId ? 'Update Person' : 'Add Person'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', email: '' }); }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="list-section">
        <h2>People List (GET)</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>{person.id}</td>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(person)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(person.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
