import { useApp } from "@/context/app-provider";

export default function RenderedVideo() {
  const { renderedVideo } = useApp();

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Generated Video</h3>
      <video
        controls
        className="w-full rounded-lg shadow-lg"
        src={renderedVideo}
      >
        Your browser does not support the video tag.
      </video>
      <div className="mt-4">
        <a
          href={renderedVideo}
          download
          className="text-blue-500 hover:text-blue-600"
        >
          Download Video
        </a>
      </div>
    </div>
  );
}
