---
name: api-service-client
description: Call a network API from a React app in this repository through a service module, with the key held in an environment variable and the error handled. Use when the user asks for an API integration, an AI feature, a fetch call, or a third-party service.
license: MIT
---

# Call an API from a service

A network call lives in `src/services/`, not in a component. The pattern comes from
`voice-notes-app/src/services/openRouterApi.ts`.

## The service module

```ts
export async function enhanceText(text: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const model = import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4.1';

  if (!apiKey) {
    throw new Error('API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
  }

  const response = await fetch('https://api.example.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: text }] }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content returned from the API');
  }

  return content.trim();
}
```

## Rules

- A key is never written in the source. It comes from `import.meta.env`, and the name starts
  with `VITE_` so Vite exposes it.
- The `.env.example` file holds the key name with a placeholder value. The `.env` file
  itself is never committed.
- A service module exports named functions. It exports no component and reads no context.
- A missing key fails at the call, with a message that names the variable to set.
- A failed response throws an error that holds the status code, so the caller can show it.
- A response that parses but holds nothing useful throws too. An empty result is not a
  success.
- The function returns the value the app needs, not the whole response body.

## Calling the service

A hook holds the loading state and the error, and the component reads the hook.

```ts
export function useSmartWrite() {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = useCallback(async (text: string): Promise<string | null> => {
    if (!text.trim()) return null;

    setIsEnhancing(true);
    setError(null);
    try {
      return await enhanceText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The request failed');
      return null;
    } finally {
      setIsEnhancing(false);
    }
  }, []);

  return { isEnhancing, error, enhance };
}
```

## A key in the environment

`.env.example` is committed. `.env` is not.

```
# .env.example
VITE_OPENROUTER_API_KEY=your_api_key_here
VITE_OPENROUTER_MODEL=openai/gpt-4.1
```

Add `.env` to `.gitignore` if it is not there already.

## A note about keys in the browser

A key with the `VITE_` prefix reaches the browser and is readable by anyone who opens the
app. That is fine for a key that is meant to be public, such as a key with a rate limit.
It is not fine for a secret. A secret belongs on a server, and the browser calls the
server instead of the third party.

## Testing a service

A test mocks `fetch`, so the test never calls the network.

```ts
it('returns the enhanced text', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ choices: [{ message: { content: 'Better text' } }] }),
  }));

  await expect(enhanceText('text')).resolves.toBe('Better text');
});
```

## Related

- `react-state-context` for the provider that holds the state of the call.
- `app-testing-vitest` for the test setup.
