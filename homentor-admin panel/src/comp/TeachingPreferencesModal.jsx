export default function TeachingPreferencesModal({
  open,
  onClose,
  schoolPrefs,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Teaching Subjects
          </h3>
          <p className="text-sm text-gray-500">
            Class-wise subject preferences
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-4">
          {Object.entries(schoolPrefs).map(([cls, subjects]) => (
            <div
              key={cls}
              className="flex gap-4 items-start"
            >
              <div className="w-28 shrink-0 text-sm font-medium text-gray-700">
                {cls.replace("-", " ").toUpperCase()}
              </div>

              <div className="flex flex-wrap gap-1">
                {subjects.map((sub) => (
                  <span
                    key={sub}
                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
