const API_BASE_URL = 'https://openrouter.ai/api/v1';

async function fetchAvailableModels(apiKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data = await response.json();
    return data.data
      .map((model) => ({
        id: model.id,
        name: model.name || model.id,
        contextLength: model.context_length,
        pricePerToken: model.pricing?.prompt || '0',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw error;
  }
}

async function sendMessage(apiKey, modelId, messages) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://songsta.app',
        'X-Title': 'Songsta',
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (response.status === 500) {
        throw new Error('Internal server error - please try again later');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded - please wait before trying again');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key - please check your settings');
      }
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data?.choices?.[0]?.message) {
      throw new Error('Invalid response format from API');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to process API response');
  }
}

module.exports = { fetchAvailableModels, sendMessage };