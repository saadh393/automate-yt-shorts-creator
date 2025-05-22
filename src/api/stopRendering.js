export default async function stopRendering() {
    try {
      const response = await fetch("/api/stop-rendering", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to stop rendering:", error);
      throw error;
    }
  }