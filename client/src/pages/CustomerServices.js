import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function CustomerServices() {
  const [services, setServices] = useState([]);
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [selectedService, setSelectedService] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

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

  // Submit enquiry
  const handleSubmitEnquiry = async () => {
    if (!selectedService) return alert('Please select a service');
    try {
      await axios.post(`${API_URL}/enquiries`, {
        ...enquiry,
        services: [{ serviceId: selectedService._id, title: selectedService.title, price: selectedService.price }]
      });
      setSuccessMsg('Enquiry submitted successfully!');
      setEnquiry({ name: '', email: '', phone: '', message: '' });
      setSelectedService(null);
    } catch (err) {
      console.error(err);
      alert('Failed to submit enquiry');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Our Services</h2>
      <ul>
        {services.map(s => (
          <li key={s._id}>
            <strong>{s.title}</strong> - ₹{s.price} <br />
            {s.description} <br />
            <button onClick={() => setSelectedService(s)}>Enquire</button>
          </li>
        ))}
      </ul>

      {selectedService && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Enquire for {selectedService.title}</h3>
          <input
            placeholder="Name"
            value={enquiry.name}
            onChange={e => setEnquiry({ ...enquiry, name: e.target.value })}
          /><br />
          <input
            placeholder="Email"
            value={enquiry.email}
            onChange={e => setEnquiry({ ...enquiry, email: e.target.value })}
          /><br />
          <input
            placeholder="Phone"
            value={enquiry.phone}
            onChange={e => setEnquiry({ ...enquiry, phone: e.target.value })}
          /><br />
          <textarea
            placeholder="Message"
            value={enquiry.message}
            onChange={e => setEnquiry({ ...enquiry, message: e.target.value })}
          ></textarea><br />
          <button onClick={handleSubmitEnquiry}>Submit Enquiry</button>
        </div>
      )}

      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
    </div>
  );
}

export default CustomerServices;
