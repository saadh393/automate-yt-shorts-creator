export default function () {
  return (
    <div className="relative bg-white px-4 py-10 sm:rounded-3xl sm:px-10">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-sky-500">
          Get with all-access
        </h3>
        <a
          className="inline-flex justify-center rounded-lg text-sm font-semibold py-2 px-3 bg-slate-900 text-white hover:bg-slate-700"
          href="/all-access"
        >
          <span>
            Create Image <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </div>
  );
}
