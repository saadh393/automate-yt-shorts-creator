export default async function clearCacheApi() {
  try {
    const response = await fetch("/api/clear-cache");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch queue list:", error);
    throw error;
  }
}
