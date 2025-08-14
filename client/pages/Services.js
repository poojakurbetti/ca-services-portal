import { useEffect, useState } from "react";
import axios from "axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios.get("http://localhost:4000/api/services")
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return alert("Select a service first");

    try {
      await axios.post("http://localhost:4000/api/enquiries", {
        ...form,
        services: [{ serviceId: selectedService._id, title: selectedService.title, price: selectedService.price }]
      });
      setSuccess("Enquiry submitted successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h2>Our Services</h2>
      <ul>
        {services.map(service => (
          <li key={service._id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>Price: ₹{service.price}</p>
            <button onClick={() => setSelectedService(service)}>
              {selectedService?._id === service._id ? "Selected" : "Select"}
            </button>
          </li>
        ))}
      </ul>

      {selectedService && (
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <h3>Enquiry for: {selectedService.title}</h3>
          {success && <p style={{ color: "green" }}>{success}</p>}
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} required />
          <button type="submit">Submit Enquiry</button>
        </form>
      )}
    </div>
  );
}
