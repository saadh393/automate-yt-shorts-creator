export default async function getQueueList() {
  try {
    const response = await fetch("/api/queue_list");
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
