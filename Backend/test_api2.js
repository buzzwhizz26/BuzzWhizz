const fetch = require('node-fetch');
const apiKey = 'cb6952b371de45f69d97e9c070374ad4';
async function test() {
  const url1 = 'https://newsapi.org/v2/everything?q=Udaipur&sortBy=publishedAt&apiKey=' + apiKey;
  const res1 = await fetch(url1);
  const data1 = await res1.json();
  console.log('No domains publishedAt:');
  if (data1.articles) {
    data1.articles.slice(0, 5).forEach(a => console.log(a.publishedAt, a.source.name, a.title));
  } else {
    console.log(data1.message);
  }
}
test();
