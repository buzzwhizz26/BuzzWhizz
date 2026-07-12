const cron = require('node-cron');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { sendNewsletter } = require('../services/emailService');

const SUBSCRIBERS_FILE = path.join(__dirname, '../data/subscribers.json');
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Runs the newsletter sending process
const runNewsletterJob = async (targetEmail = null) => {
  console.log(targetEmail ? `📰 Starting Newsletter Job for ${targetEmail}...` : '📰 Starting Newsletter Job...');

  try {
    // 1. Get Subscribers
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
      console.log('No subscribers file found. Skipping.');
      return;
    }
    const subscribersRaw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
    const allSubscribers = JSON.parse(subscribersRaw);
    
    // Only send to approved subscribers
    let approvedSubscribers = allSubscribers.filter(s => s.approved !== false);

    // If targetEmail is provided, filter for only that subscriber
    if (targetEmail) {
      approvedSubscribers = approvedSubscribers.filter(s => s.email === targetEmail);
    }

    if (approvedSubscribers.length === 0) {
      console.log('No eligible subscribers found. Skipping.');
      return;
    }

    // 2. Fetch News
    const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${NEWS_API_KEY}`);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      console.log('No articles fetched from NewsAPI. Skipping.');
      return;
    }

    const topArticles = data.articles.filter(a => a.title && a.title !== '[Removed]');

    // 3. Send Email
    await sendNewsletter(approvedSubscribers, topArticles);

  } catch (error) {
    console.error('Error running newsletter job:', error);
  }
};

// Schedule it to run every day at 8:00 AM
const startCron = () => {
  // '0 8 * * *' means "At 08:00 every day"
  cron.schedule('0 8 * * *', () => {
    runNewsletterJob();
  });
  console.log('⏱️ Newsletter Cron Job scheduled for 8:00 AM daily.');
};

module.exports = {
  startCron,
  runNewsletterJob // exported for manual testing
};
