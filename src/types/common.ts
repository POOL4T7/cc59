// Define error type for API responses
export type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};
