export default async function renderQueueList() {
  try {
    const response = await fetch("/api/render-queue-list");
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
