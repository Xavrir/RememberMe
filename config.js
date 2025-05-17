// API Configuration
/*
 * Konfigurasi API:
 * 1. Menggunakan GPT-4o mini sebagai model utama via OpenRouter
 * 2. OpenAI API sebagai fallback pertama
 * 3. OpenRouter dengan Claude dan model lainnya sebagai fallback terakhir
 */
const config = {
    // OpenAI API for AI Chat (Fallback 1)
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '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',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo' // Using more stable model
    },
    
    // GPT-4o mini via OpenRouter (Model Utama)
    gpt4omini: {
        apiKey: process.env.GPT4OMINI_API_KEY || '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',
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'openai/gpt-4o-mini'
    },
    
    // OpenRouter API Configuration (Fallback 2)
    openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY || '6260ab16f77e46ad92896d706fdce099',
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        models: {
            primary: 'anthropic/claude-3-opus:beta',
            fallbacks: [
                'anthropic/claude-3-haiku',
                'openai/gpt-3.5-turbo',
                'google/gemini-pro',
                'meta-llama/llama-3-8b-chat'
            ]
        },
        requestHeaders: {
            'HTTP-Referer': 'https://rememberme.app',
            'X-Title': 'RememberMe App'
        }
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
async function makeApiCall(endpoint, method = 'GET', data = null, apiKey = null, headers = {}) {
    try {
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };
        
        if (apiKey) {
            requestHeaders['Authorization'] = `Bearer ${apiKey}`;
        }

        const options = {
            method,
            headers: requestHeaders,
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

// Utility function to call OpenAI API directly
async function callOpenAIAPI(message, systemPrompt = "Anda adalah asisten kesehatan yang membantu. Berikan informasi kesehatan yang akurat dan berguna. Jawab dalam Bahasa Indonesia.") {
    try {
        const response = await makeApiCall(
            config.openai.endpoint,
            'POST',
            {
                model: config.openai.model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 800
            },
            config.openai.apiKey
        );
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
}

// Utility function to call GPT-4o mini via OpenRouter
async function callGPT4oMiniAPI(message, systemPrompt = "Anda adalah asisten kesehatan yang membantu. Berikan informasi kesehatan yang akurat dan berguna. Jawab dalam Bahasa Indonesia.") {
    try {
        const headers = {
            ...config.openrouter.requestHeaders
        };
        
        const response = await makeApiCall(
            config.gpt4omini.endpoint,
            'POST',
            {
                model: config.gpt4omini.model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 800
            },
            config.gpt4omini.apiKey,
            headers
        );
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error("GPT-4o mini API Error:", error);
        throw error;
    }
}

// Utility function to call OpenRouter API (Fallback)
async function callOpenRouterAPI(message, model = config.openrouter.models.primary, systemPrompt = "Anda adalah asisten kesehatan yang membantu. Berikan informasi kesehatan yang akurat dan berguna. Jawab dalam Bahasa Indonesia.") {
    try {
        const response = await makeApiCall(
            config.openrouter.endpoint,
            'POST',
            {
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 800
            },
            config.openrouter.apiKey,
            config.openrouter.requestHeaders
        );
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error("OpenRouter API Error:", error);
        throw error;
    }
}

// Export configuration and utilities
export { config, makeApiCall, callOpenAIAPI, callGPT4oMiniAPI, callOpenRouterAPI }; 