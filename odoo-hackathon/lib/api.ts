const API_BASE_URL = '/api';

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, data: any, message?: string) {
    super(message || data?.detail || 'An API error occurred');
    this.status = status;
    this.data = data;
  }
}

/**
 * A native fetch wrapper for the API.
 * Automatically includes credentials (cookies) and handles JSON parsing.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Important for sending/receiving JWT cookies
  });

  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}
