import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const contactInfo = [
    { label: 'Email', value: 'buzzwhizz19@gmail.com', icon: '✉️' },
    { label: 'Location', value: 'New Delhi, India', icon: '📍' },
    { label: 'Followers', value: '135+ on Instagram', icon: '📷' },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-1/3"
            >
              <h1 className="text-4xl md:text-5xl font-black mb-6">Get in <span className="text-gradient">Touch.</span></h1>
              <p className="text-light-muted dark:text-dark-muted mb-10 leading-relaxed">
                Have a tip, a question, or a partnership idea? We'd love to hear from you. Our team responds to every inquiry within 24 hours.
              </p>
              
              <div className="space-y-8">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xl">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-50">{info.label}</p>
                      <p className="font-bold">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-12 border-t border-gray-100 dark:border-dark-border">
                <p className="font-bold mb-4">Follow us on Socials</p>
                <a 
                  href="https://share.google/4HcPdspTr7ijmDfCU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-pink-600 font-bold hover:underline"
                >
                  Instagram →
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-2/3"
            >
              <div className="p-8 md:p-12 rounded-3xl bg-gray-50 dark:bg-dark-bg/60 border border-gray-100 dark:border-dark-border shadow-xl shadow-gray-200/20">

                {/* Success Alert */}
                {status === 'success' && (
                  <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                    <span className="text-xl">✅</span>
                    <p className="font-bold">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                {/* Error Alert */}
                {status === 'error' && (
                  <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                    <span className="text-xl">❌</span>
                    <p className="font-bold">Something went wrong. Please try again later.</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-70 ml-1">Full Name</label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-5 py-4 rounded-xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:border-orange-primary outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-70 ml-1">Email Address</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 rounded-xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:border-orange-primary outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-70 ml-1">Subject</label>
                    <input 
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="w-full px-5 py-4 rounded-xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:border-orange-primary outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-70 ml-1">Your Message</label>
                    <textarea 
                      rows="6"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-5 py-4 rounded-xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:border-orange-primary outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-5 rounded-xl bg-orange-primary text-white font-black text-lg shadow-xl shadow-orange-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message ⚡'}
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
