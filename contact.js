// /.netlify/functions/contact.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
    
    try {
        const data = JSON.parse(event.body);
        
        // Validate required fields
        const required = ['name', 'email', 'phone', 'business'];
        for (const field of required) {
            if (!data[field]) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: `Missing required field: ${field}` 
                    })
                };
            }
        }
        
        // Send to CRM (example with Salesforce)
        const crmResponse = await fetch('https://your-crm-api.com/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CRM_API_KEY}`
            },
            body: JSON.stringify({
                lead: {
                    firstName: data.name.split(' ')[0],
                    lastName: data.name.split(' ').slice(1).join(' '),
                    email: data.email,
                    phone: data.phone,
                    company: data.business,
                    source: 'Website Form',
                    status: 'New'
                }
            })
        });
        
        if (!crmResponse.ok) {
            throw new Error('CRM integration failed');
        }
        
        // Send confirmation email
        await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: data.email }],
                    dynamic_template_data: {
                        name: data.name,
                        business: data.business
                    }
                }],
                from: { email: 'noreply@ukcallcenter.com', name: 'UK Call Center' },
                template_id: process.env.CONFIRMATION_TEMPLATE_ID
            })
        });
        
        // Send notification to sales team
        await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify({
                text: `🎯 New Lead from Website\n*Name:* ${data.name}\n*Business:* ${data.business}\n*Phone:* ${data.phone}\n*Email:* ${data.email}`
            })
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true,
                message: 'Thank you! We will contact you shortly.'
            })
        };
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};
