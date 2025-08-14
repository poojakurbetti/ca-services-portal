import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function AdminDashboard() {
  // --- Services ---
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // --- Alerts ---
  const [alerts, setAlerts] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  // --- Blogs ---
  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');

  // --- Fetch all data ---
  const fetchAll = async () => {
    const servicesData = await axios.get(`${API_URL}/services`);
    setServices(servicesData.data);

    const alertsData = await axios.get(`${API_URL}/alerts`, { withCredentials: true });
    setAlerts(alertsData.data);

    const blogsData = await axios.get(`${API_URL}/blogs`, { withCredentials: true });
    setBlogs(blogsData.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // --- Services CRUD ---
  const addService = async () => {
    const { data } = await axios.post(`${API_URL}/services`, { title, description, price }, { withCredentials: true });
    setServices([data, ...services]);
    setTitle(''); setDescription(''); setPrice('');
  };
  const deleteService = async (id) => {
    await axios.delete(`${API_URL}/services/${id}`, { withCredentials: true });
    setServices(services.filter(s => s._id !== id));
  };

  // --- Alerts CRUD ---
  const addAlert = async () => {
    const { data } = await axios.post(`${API_URL}/alerts`, { message: alertMessage }, { withCredentials: true });
    setAlerts([data, ...alerts]);
    setAlertMessage('');
  };
  const deleteAlert = async (id) => {
    await axios.delete(`${API_URL}/alerts/${id}`, { withCredentials: true });
    setAlerts(alerts.filter(a => a._id !== id));
  };

  // --- Blogs CRUD ---
  const addBlog = async () => {
    const { data } = await axios.post(`${API_URL}/blogs`, { title: blogTitle, content: blogContent }, { withCredentials: true });
    setBlogs([data, ...blogs]);
    setBlogTitle(''); setBlogContent('');
  };
  const deleteBlog = async (id) => {
    await axios.delete(`${API_URL}/blogs/${id}`, { withCredentials: true });
    setBlogs(blogs.filter(b => b._id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>

      {/* Services Section */}
      <h3>Services</h3>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={addService}>Add Service</button>
      <ul>
        {services.map(s => (
          <li key={s._id}>
            {s.title} - {s.description} - ${s.price}
            <button onClick={() => deleteService(s._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Alerts Section */}
      <h3>Alerts</h3>
      <input placeholder="Alert message" value={alertMessage} onChange={e => setAlertMessage(e.target.value)} />
      <button onClick={addAlert}>Add Alert</button>
      <ul>
        {alerts.map(a => (
          <li key={a._id}>{a.message} <button onClick={() => deleteAlert(a._id)}>Delete</button></li>
        ))}
      </ul>

      {/* Blogs Section */}
      <h3>Blogs</h3>
      <input placeholder="Blog title" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} />
      <textarea placeholder="Content" value={blogContent} onChange={e => setBlogContent(e.target.value)} />
      <button onClick={addBlog}>Add Blog</button>
      <ul>
        {blogs.map(b => (
          <li key={b._id}>{b.title} - {b.content.substring(0, 50)}...
            <button onClick={() => deleteBlog(b._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
