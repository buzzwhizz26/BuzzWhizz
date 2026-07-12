const fetch = require('node-fetch');
const apiKey = 'cb6952b371de45f69d97e9c070374ad4';
async function test() {
  const url1 = 'https://newsapi.org/v2/everything?q=Jaipur&sortBy=publishedAt&apiKey=' + apiKey;
  const res1 = await fetch(url1);
  const data1 = await res1.json();
  console.log('No domains publishedAt:', data1.articles && data1.articles.length > 0 ? data1.articles[0].publishedAt : data1.message);
  
  const url2 = 'https://newsapi.org/v2/everything?q=Jaipur&domains=indianexpress.com,ndtv.com&sortBy=publishedAt&apiKey=' + apiKey;
  const res2 = await fetch(url2);
  const data2 = await res2.json();
  console.log('With domains publishedAt:', data2.articles && data2.articles.length > 0 ? data2.articles[0].publishedAt : data2.message);

  const url3 = 'https://newsapi.org/v2/everything?q=Jaipur&domains=indianexpress.com,ndtv.com&sortBy=relevancy&apiKey=' + apiKey;
  const res3 = await fetch(url3);
  const data3 = await res3.json();
  console.log('With domains relevancy:', data3.articles && data3.articles.length > 0 ? data3.articles[0].publishedAt : data3.message);
}
test();
