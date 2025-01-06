// netlify/functions/fetch-profile.js
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

exports.handler = async function(event) {
    try {
        const { userId } = JSON.parse(event.body);
        const response = await fetch(`https://lu.ma/user/${userId}`);
        const html = await response.text();
        
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        
        const nameElement = doc.querySelector('h1.jsx-3444256809.mb-0');
        const name = nameElement ? nameElement.textContent.trim() : '';
        
        const links = Array.from(doc.querySelectorAll('a[href]'));
        let linkedin = '';
        let website = '';
        const additionalLinks = [];
        
        links.forEach(link => {
            const href = link.href;
            if (href.includes('linkedin.com')) {
                linkedin = href;
            } else if (!website && href !== `https://lu.ma/user/${userId}`) {
                website = href;
            } else if (href !== `https://lu.ma/user/${userId}`) {
                additionalLinks.push(href);
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ name, linkedin, website, additionalLinks })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
