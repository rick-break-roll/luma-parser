// netlify/functions/fetchProfile.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { userId } = event.queryStringParameters;

    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'User ID is required' }),
        };
    }

    try {
        // Fetch the profile from the lu.ma API
        const response = await fetch(`https://lu.ma/user/${userId}`);
        
        if (!response.ok) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error fetching profile from lu.ma' }),
            };
        }

        const data = await response.json();

        // Return the profile data as JSON
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching profile from lu.ma' }),
        };
    }
};
