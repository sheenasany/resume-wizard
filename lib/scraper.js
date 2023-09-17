const puppeteer = require("puppeteer");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function scraper(url) {
  try {
    // Initialize headless Chrome
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url);

    // Optional: Wait for JavaScript to load the dynamic content
    // You can set a specific time or wait for a specific element to appear
    // await page.waitForTimeout(5000);

    // Get the page source
    const pageSource = await page.content();

    // Close the browser
    await browser.close();

    // Parse the HTML content using jsdom
    const dom = new JSDOM(pageSource);
    const document = dom.window.document;

    // Search for the element by its id
    const jobDescElem = document.getElementById("job-desc");

    // Extract and return the text content if the element is found
    if (jobDescElem) {
      let textContent = jobDescElem.textContent.trim();
      textContent = textContent.replace(/\s+/g, " ");
      return textContent;
    } else {
      return "Element with id 'job-desc' not found";
    }
  } catch (error) {
    return An error occurred: ${error};
  }
}

// Example usage
// job_url = "https://getwork.com/search/results?keyword=software+engineer&company_ids=&location=&jobId=bc76c8963dd9d02af0335b53567c01bb"
// (async () => {
//   const jobUrl =
//     "https://getwork.com/search/results?keyword=software+engineer&company_ids=&location=&jobId=bc76c8963dd9d02af0335b53567c01bb"; // Replace with the actual job URL
//   const content = await scraper(jobUrl);
//   console.log(content);
// })();

module.exports = scraper;
Getwork | Job Search
Getwork | Job Search