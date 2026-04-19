export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const buildApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string
) => {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
};
