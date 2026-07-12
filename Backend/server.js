const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
const NEWS_API_BASE = 'https://newsapi.org/v2';

app.use(cors());
app.use(express.json());

app.get('/api/news', async (req, res) => {
  try {
    const { country = 'in', category = 'general', language = 'en', page = 1, pageSize = 12 } = req.query;
    
    // 1. Specialized Hindi News Handling
    if (language === 'hi') {
      // Use Hindi characters in 'q' to naturally filter for Hindi content
      // Note: We REMOVE &language=hi because it is unreliable in NewsAPI for certain queries
      const hindiQuery = country === 'in' ? 'समाचार' : 'हिंदी समाचार'; 
      const url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(hindiQuery)}&pageSize=${pageSize}&page=${page}&sortBy=relevancy&apiKey=${NEWS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.articles) {
        data.articles = data.articles.filter(a => a.title && a.title !== '[Removed]');
      }
      return res.json(data);
    }

    // 2. Default: Top Headlines
    let url = `${NEWS_API_BASE}/top-headlines?country=${country}&pageSize=${pageSize}&page=${page}&apiKey=${NEWS_API_KEY}`;
    if (category !== 'general') {
      url += `&category=${category === 'startups' ? 'technology' : category}`;
    }

    let response = await fetch(url);
    let data = await response.json();

    // 3. Fallback to Everything or Global Category
    if (data.status === 'ok' && (!data.articles || data.articles.length === 0)) {
      if (category !== 'general') {
        const catParam = category === 'startups' ? 'technology' : category;
        const globalUrl = `${NEWS_API_BASE}/top-headlines?language=${language}&category=${catParam}&pageSize=${pageSize}&page=${page}&apiKey=${NEWS_API_KEY}`;
        const globalResponse = await fetch(globalUrl);
        data = await globalResponse.json();

        // If global top-headlines has 0 results, fall back to live Everything search sorted by latest
        if (!data.articles || data.articles.length === 0) {
          const everythingCatUrl = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(catParam)}&language=${language}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
          const catResponse = await fetch(everythingCatUrl);
          data = await catResponse.json();
        }
      } else {
        const q = country === 'in' ? 'India OR breaking news OR technology OR business' : (country || 'breaking news');
        const everythingUrl = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(q)}&language=${language}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
        const everythingResponse = await fetch(everythingUrl);
        data = await everythingResponse.json();

        if (!data.articles || data.articles.length === 0) {
          const backupUrl = `${NEWS_API_BASE}/everything?q=trending OR latest&language=${language}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
          const backupResponse = await fetch(backupUrl);
          data = await backupResponse.json();
        }
      }
    }

    if (data.articles) {
      data.articles = data.articles.filter(a => a.title && a.title !== '[Removed]' && a.urlToImage);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trending', async (req, res) => {
  try {
    const { country = 'in', language = 'en' } = req.query;
    let url;
    if (language === 'hi') {
      url = `${NEWS_API_BASE}/everything?q=समाचार&pageSize=15&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    } else {
      url = `${NEWS_API_BASE}/top-headlines?country=${country}&pageSize=15&apiKey=${NEWS_API_KEY}`;
    }
    let response = await fetch(url);
    let data = await response.json();

    // Fallback if top-headlines returns 0 results or lacks valid articles
    if (!data.articles || data.articles.length === 0) {
      if (language === 'hi') {
        const fallbackUrl = `${NEWS_API_BASE}/everything?q=भारत OR दुनिया&language=hi&pageSize=15&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
        response = await fetch(fallbackUrl);
        data = await response.json();
      } else {
        const query = country === 'in' ? 'India OR breaking news OR technology OR business OR AI' : 'breaking news OR trending OR viral';
        const fallbackUrl = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(query)}&language=${language}&pageSize=15&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
        response = await fetch(fallbackUrl);
        data = await response.json();

        // If that still has 0 results, try global top-headlines
        if (!data.articles || data.articles.length === 0) {
          const globalUrl = `${NEWS_API_BASE}/top-headlines?language=${language}&pageSize=15&apiKey=${NEWS_API_KEY}`;
          response = await fetch(globalUrl);
          data = await response.json();
        }
      }
    }

    if (data.articles) {
      data.articles = data.articles.filter(a => a.title && a.title !== '[Removed]' && a.urlToImage);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/search', async (req, res) => {
  try {
    const { q, page = 1, language = 'en', country = '', sortBy = 'relevancy' } = req.query;
    
    if (!q) {
      return res.status(400).json({ status: 'error', message: 'Query parameter "q" is required' });
    }

    const langParam = `&language=${language}`;
    const url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(q)}${langParam}&pageSize=20&page=${page}&sortBy=${sortBy}&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.articles) {
      data.articles = data.articles.filter(a => a.title && a.title !== '[Removed]');
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Contact Form Endpoints ---
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ status: 'error', message: 'All fields are required: name, email, subject, message' });
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });

    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      messages = JSON.parse(raw);
    }

    const newMessage = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };

    messages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    res.json({ status: 'ok', message: 'Message saved successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/contact', (req, res) => {
  try {
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      messages = JSON.parse(raw);
    }

    messages.sort((a, b) => b.id - a.id);

    res.json({ status: 'ok', messages });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// --- Newsletter Endpoints ---
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

app.post('/api/newsletter', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });

    let subscribers = [];
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      subscribers = JSON.parse(raw);
    }

    // Check if already subscribed
    if (subscribers.some(s => s.email === email)) {
      return res.json({ status: 'ok', message: 'Already subscribed!' });
    }

    subscribers.push({
      id: Date.now(),
      email,
      subscribedAt: new Date().toISOString(),
      approved: false
    });

    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    
    // Send welcome email asynchronously
    const { sendWelcomeEmail } = require('./services/emailService');
    sendWelcomeEmail(email);

    res.json({ status: 'ok', message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/newsletter', (req, res) => {
  try {
    let subscribers = [];
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      subscribers = JSON.parse(raw);
    }
    subscribers.sort((a, b) => b.id - a.id);
    res.json({ status: 'ok', subscribers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// --- Delete Endpoints ---
app.delete('/api/contact/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    }
    messages = messages.filter(m => m.id !== id);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    res.json({ status: 'ok', message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.delete('/api/newsletter/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let subscribers = [];
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
    }
    subscribers = subscribers.filter(s => s.id !== id);
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    res.json({ status: 'ok', message: 'Subscriber removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// --- Customer Endpoints ---
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

app.post('/api/customers', (req, res) => {
  try {
    const { name, email, avatar, interests, memberSince, status, isSignUp } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }
    fs.mkdirSync(DATA_DIR, { recursive: true });
    let customers = [];
    if (fs.existsSync(CUSTOMERS_FILE)) {
      customers = JSON.parse(fs.readFileSync(CUSTOMERS_FILE, 'utf-8'));
    }
    
    // Check if customer already exists
    const existingIdx = customers.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (isSignUp && existingIdx !== -1) {
      return res.status(409).json({ status: 'error', message: 'An account with this email already exists! Please sign in instead.' });
    }

    if (existingIdx !== -1) {
      customers[existingIdx] = {
        ...customers[existingIdx],
        name: name || customers[existingIdx].name,
        avatar: avatar || customers[existingIdx].avatar,
        interests: interests || customers[existingIdx].interests,
        status: status || customers[existingIdx].status || 'Verified',
        lastLogin: new Date().toISOString()
      };
    } else {
      customers.push({
        id: Date.now(),
        name: name || 'Customer',
        email,
        avatar: avatar || '👤',
        interests: interests || ['technology', 'startups', 'memes'],
        memberSince: memberSince || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        status: status || 'Verified',
        lastLogin: new Date().toISOString()
      });

      // Send Customer Welcome Email asynchronously
      const { sendCustomerWelcomeEmail } = require('./services/emailService');
      sendCustomerWelcomeEmail(email, name);
    }
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
    res.json({ status: 'ok', message: 'Customer saved successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/customers', (req, res) => {
  try {
    let customers = [];
    if (fs.existsSync(CUSTOMERS_FILE)) {
      customers = JSON.parse(fs.readFileSync(CUSTOMERS_FILE, 'utf-8'));
    }
    customers.sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));
    res.json({ status: 'ok', customers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let customers = [];
    if (fs.existsSync(CUSTOMERS_FILE)) {
      customers = JSON.parse(fs.readFileSync(CUSTOMERS_FILE, 'utf-8'));
    }
    customers = customers.filter(c => c.id !== id);
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
    res.json({ status: 'ok', message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/customers/welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }
    const { sendCustomerWelcomeEmail } = require('./services/emailService');
    const result = await sendCustomerWelcomeEmail(email, name || 'Valued Customer');
    if (result.success) {
      res.json({ status: 'ok', message: `Welcome email delivered to ${email}` });
    } else {
      res.status(500).json({ status: 'error', message: result.error || 'Failed to send email' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const { startCron, runNewsletterJob } = require('./jobs/newsletterCron');

app.put('/api/newsletter/:id/approve', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let subscribers = [];
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
    }
    
    const subIndex = subscribers.findIndex(s => s.id === id);
    if (subIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Subscriber not found' });
    }
    
    subscribers[subIndex].approved = true;
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    res.json({ status: 'ok', message: 'Subscriber approved' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/newsletter/send-test', async (req, res) => {
  try {
    const { email } = req.body || {};
    await runNewsletterJob(email);
    res.json({ status: 'ok', message: email ? `Test newsletter sent to ${email}` : 'Test newsletter sent to all approved subscribers' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BuzzWhizz Backend on port ${PORT}`);
  startCron();
});
