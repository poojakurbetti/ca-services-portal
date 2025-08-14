import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function AdminPanel() {
  const [services, setServices] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', price: '' });
  const [status, setStatus] = useState('');

  // Fetch services
  const fetchServices = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/services`);
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch enquiries
  const fetchEnquiries = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/enquiries`, { withCredentials: true });
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchEnquiries();
  }, []);

  // Add new service
  const addService = async () => {
    try {
      await axios.post(`${API_URL}/services`, newService, { withCredentials: true });
      setStatus('Service added successfully');
      setNewService({ title: '', description: '', price: '' });
      fetchServices();
    } catch (err) {
      console.error(err);
      setStatus('Failed to add service');
    }
  };

  // Delete service
  const deleteService = async (id) => {
    try {
      await axios.delete(`${API_URL}/services/${id}`, { withCredentials: true });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  // Update enquiry status
  const updateEnquiryStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/enquiries/${id}`, { status }, { withCredentials: true });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>

      <h3>Add New Service</h3>
      <input
        placeholder="Title"
        value={newService.title}
        onChange={e => setNewService({ ...newService, title: e.target.value })}
      /><br/>
      <input
        placeholder="Description"
        value={newService.description}
        onChange={e => setNewService({ ...newService, description: e.target.value })}
      /><br/>
      <input
        type="number"
        placeholder="Price"
        value={newService.price}
        onChange={e => setNewService({ ...newService, price: e.target.value })}
      /><br/>
      <button onClick={addService}>Add Service</button>
      {status && <p>{status}</p>}

      <h3>Existing Services</h3>
      <ul>
        {services.map(s => (
          <li key={s._id}>
            {s.title} - {s.description} (${s.price}) 
            <button onClick={() => deleteService(s._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Enquiries</h3>
      <ul>
        {enquiries.map(e => (
          <li key={e._id}>
            {e.name} ({e.email}, {e.phone}) — Status: {e.status}
            <select
              value={e.status}
              onChange={ev => updateEnquiryStatus(e._id, ev.target.value)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
