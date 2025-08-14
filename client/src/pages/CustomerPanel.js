import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function CustomerPanel() {
  const [services, setServices] = useState([]);
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: '', services: [] });
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

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle service selection
  const toggleService = (serviceId) => {
    setEnquiry(prev => {
      const exists = prev.services.includes(serviceId);
      return {
        ...prev,
        services: exists ? prev.services.filter(id => id !== serviceId) : [...prev.services, serviceId]
      };
    });
  };

  // Submit enquiry
  const submitEnquiry = async () => {
    if (!enquiry.name || !enquiry.email || !enquiry.phone || enquiry.services.length === 0) {
      setStatus('Please fill all fields and select at least one service');
      return;
    }

    try {
      await axios.post(`${API_URL}/enquiries`, enquiry);
      setStatus('Enquiry submitted successfully');
      setEnquiry({ name: '', email: '', phone: '', message: '', services: [] });
    } catch (err) {
      console.error(err);
      setStatus('Failed to submit enquiry');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Panel</h2>

      <h3>Available Services</h3>
      <ul>
        {services.map(s => (
          <li key={s._id}>
            <input
              type="checkbox"
              checked={enquiry.services.includes(s._id)}
              onChange={() => toggleService(s._id)}
            />
            {s.title} - {s.description} (${s.price})
          </li>
        ))}
      </ul>

      <h3>Submit Enquiry</h3>
      <input
        placeholder="Name"
        value={enquiry.name}
        onChange={e => setEnquiry({ ...enquiry, name: e.target.value })}
      /><br/>
      <input
        placeholder="Email"
        value={enquiry.email}
        onChange={e => setEnquiry({ ...enquiry, email: e.target.value })}
      /><br/>
      <input
        placeholder="Phone"
        value={enquiry.phone}
        onChange={e => setEnquiry({ ...enquiry, phone: e.target.value })}
      /><br/>
      <textarea
        placeholder="Message"
        value={enquiry.message}
        onChange={e => setEnquiry({ ...enquiry, message: e.target.value })}
      /><br/>
      <button onClick={submitEnquiry}>Submit Enquiry</button>

      {status && <p>{status}</p>}
    </div>
  );
}

export default CustomerPanel;
