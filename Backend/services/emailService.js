const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper function to build the HTML email template
const buildEmailTemplate = (articles) => {
  const articlesHtml = articles.map(article => `
    <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #eeeeee;">
      ${article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 12px;"/>` : ''}
      <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #111111;">
        <a href="${article.url}" style="color: #FF5A00; text-decoration: none;">${article.title}</a>
      </h2>
      <p style="margin: 0; color: #555555; line-height: 1.5;">${article.description || ''}</p>
    </div>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF5A00; margin: 0; font-size: 28px;">BuzzWhizz ⚡</h1>
        <p style="color: #666666; margin: 5px 0 0 0;">Your Daily Headlines</p>
      </div>
      
      <div style="background: #ffffff;">
        ${articlesHtml}
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px;">
        <p>You received this email because you subscribed to the BuzzWhizz Newsletter.</p>
        <p>© ${new Date().getFullYear()} BuzzWhizz. All rights reserved.</p>
      </div>
    </div>
  `;
};

const sendNewsletter = async (subscribers, articles) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials missing. Cannot send newsletter.');
    return { success: false, error: 'Email credentials not configured.' };
  }

  const htmlContent = buildEmailTemplate(articles);

  try {
    const promises = subscribers.map(sub => {
      return transporter.sendMail({
        from: `"BuzzWhizz" <${process.env.EMAIL_USER}>`,
        to: sub.email,
        subject: '⚡ Your Daily BuzzWhizz Headlines',
        html: htmlContent
      });
    });

    await Promise.all(promises);
    console.log(`Successfully sent newsletter to ${subscribers.length} subscribers.`);
    return { success: true };
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return { success: false, error: 'Email credentials not configured.' };
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF5A00; margin: 0; font-size: 28px;">Welcome to BuzzWhizz ⚡</h1>
      </div>
      
      <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #eeeeee;">
        <h2 style="margin-top: 0;">You're on the list! 🎉</h2>
        <p style="color: #555555; line-height: 1.6;">
          Thank you for subscribing to the BuzzWhizz Newsletter. 
          You'll start receiving the top viral news and memes directly in your inbox every morning.
        </p>
        <p style="color: #555555; line-height: 1.6;">
          Stay tuned! Our admin is reviewing your subscription and you will start receiving emails soon.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} BuzzWhizz. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"BuzzWhizz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '⚡ Welcome to BuzzWhizz!',
      html: htmlContent
    });
    console.log(`Successfully sent welcome email to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

const sendCustomerWelcomeEmail = async (email, name) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[Demo/Mock] Would send Customer Welcome Email to ${email} (${name})`);
    return { success: true, mock: true };
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF5A00; margin: 0; font-size: 28px;">Welcome to BuzzWhizz Pro ⚡</h1>
      </div>
      
      <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #eeeeee;">
        <h2 style="margin-top: 0; color: #111111;">Hello ${name || 'Valued Customer'}, welcome aboard! 🎉</h2>
        <p style="color: #555555; line-height: 1.6;">
          Your BuzzWhizz Customer Account has been successfully created! 
          You now have full access to personalized news feeds, customized topic selections, and VIP member features.
        </p>
        <p style="color: #555555; line-height: 1.6;">
          Log into your customer portal anytime to customize your feed or explore trending stories.
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="http://localhost:5173/login" style="display: inline-block; padding: 12px 24px; background: #FF5A00; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Customer Portal ⚡</a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} BuzzWhizz. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"BuzzWhizz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '⚡ Welcome to BuzzWhizz Pro Account!',
      html: htmlContent
    });
    console.log(`Successfully sent customer account welcome email to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending customer welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendNewsletter,
  sendWelcomeEmail,
  sendCustomerWelcomeEmail
};
