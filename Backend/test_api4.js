const fetch = require('node-fetch');
const apiKey = 'cb6952b371de45f69d97e9c070374ad4';
async function test() {
  const url1 = 'http://localhost:5000/api/news?category=sports&country=in&language=en';
  const res1 = await fetch(url1);
  const data1 = await res1.json();
  console.log('API response size:', data1.articles ? data1.articles.length : data1.message);
  if (data1.articles && data1.articles.length > 0) {
    console.log('Sample:', data1.articles[0].title);
  }
}
test();
