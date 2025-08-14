import nodemailer from 'nodemailer';

export const sendEnquiryNotification = async (enquiry) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"CA Services Portal" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // admin email to receive notifications
      subject: `New Enquiry from ${enquiry.name}`,
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${enquiry.name}</p>
        <p><strong>Email:</strong> ${enquiry.email}</p>
        <p><strong>Phone:</strong> ${enquiry.phone}</p>
        <p><strong>Message:</strong> ${enquiry.message}</p>
        <p><strong>Services:</strong> ${enquiry.services.map(s => s.title).join(', ')}</p>
      `,
    });

    console.log('Email sent: ', info.messageId);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
};
