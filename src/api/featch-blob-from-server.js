const fetchBlobFromServer = async (imageUrl) => {
  try {
    const response = await fetch(`/api/fetch-image?url=${encodeURIComponent(imageUrl)}`);
    if (!response.ok) throw new Error("Failed to fetch image");
    return await response.blob();
  } catch (error) {
    console.error("Error fetching image blob:", error);
    return null;
  }
};

export default fetchBlobFromServer;
