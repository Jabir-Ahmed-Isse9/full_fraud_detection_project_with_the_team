/**
 * Core HTTP client for the Express backend.
 * During development Vite proxies /api to localhost:5000. Set VITE_API_URL in
 * a deployed build when the API has a separate public origin.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Standard fetch wrapper with timeout, status checking, and error handling
 */
export async function fetchApi(endpoint, options = {}) {
  const { timeout = 8000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const url = `${BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  const isMultipart = typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(isMultipart ? {} : { "Content-Type": "application/json" }),
        ...(fetchOptions.headers || {}),
      },
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.detail || errorJson.message || errorJson.error) {
          errorMessage = errorJson.detail || errorJson.message || errorJson.error;
        }
      } catch {
        if (errorText) errorMessage += ` - ${errorText}`;
      }
      const err = new Error(errorMessage);
      err.status = response.status;
      throw err;
    }

    return await response.json();
  } catch (err) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      const timeoutErr = new Error("API request timed out (8s).");
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }
    throw err;
  }
}

/**
 * Check connectivity to the Express API and its ML dependency.
 */
export async function checkApiHealth() {
  try {
    const result = await fetchApi("/health", { timeout: 3000 });
    return {
      connected: true,
      mode: "Live ML Backend",
      baseUrl: BASE_URL,
      data: result,
      message: "Connected to fraud detection API",
    };
  } catch (err) {
    return {
      connected: false,
      mode: "Backend unavailable",
      baseUrl: BASE_URL,
      error: err.message,
      message: `Unable to connect to ${BASE_URL} (${err.message})`,
    };
  }
}
