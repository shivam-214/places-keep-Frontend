import { useEffect } from "react";
import { useState, useCallback, useRef } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, requestConfig) => {
    try {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      const response = await fetch(url, {
        method:
          requestConfig && requestConfig.method ? requestConfig.method : "GET",
        headers:
          requestConfig && requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig && requestConfig.body ? requestConfig.body : null,
        signal: httpAbortCtrl.signal,
      });

      const data = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(data.message);
      }

      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Something went wrong, please try again later.");
      throw err;
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const requests = activeHttpRequests.current;
    return () => {
      requests.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, clearError, sendRequest };
};
export default useHttp;
