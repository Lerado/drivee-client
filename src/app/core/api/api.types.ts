interface ApiErrorResponse {
  error: string;
  status: number;
  message: string;
  path: string;
  timestamp: number
}

export { ApiErrorResponse };
