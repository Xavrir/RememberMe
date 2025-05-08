// API Configuration
const config = {
    // OpenAI API for AI Chat
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo' // Using more stable model
    },
    
    // Emergency Services API for SOS
    emergency: {
        apiKey: process.env.EMERGENCY_API_KEY || '',
        endpoints: {
            contacts: '/api/emergency-contacts',
            sendAlert: '/api/send-alert',
            hospitals: '/api/nearby-hospitals'
        }
    },

    // User Profile API
    profile: {
        apiKey: process.env.PROFILE_API_KEY || '',
        endpoints: {
            userInfo: '/api/user',
            updateProfile: '/api/user/update',
            medicalRecords: '/api/user/medical-records',
            securitySettings: '/api/user/security'
        }
    }
};

// Utility function to make API calls
async function makeApiCall(endpoint, method = 'GET', data = null, apiKey = null) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const options = {
            method,
            headers,
            body: data ? JSON.stringify(data) : null
        };

        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API call failed');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export configuration and utilities
export { config, makeApiCall }; 