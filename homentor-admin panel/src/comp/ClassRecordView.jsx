import { useState, useEffect } from "react";
import axios from "axios";

export default function ClassRecordView({ classBooking }) {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/class-records/class-booking/${classBooking._id}`
      );
      setRecords(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchRecords();
  };

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={handleOpen}
        className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700"
      >
        📊 Class Chart
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0  flex items-center justify-center z-[999]">
            <div className="bg-black opacity-50 absolute w-full h-full"></div>
          <div className="bg-white w-[90%] z-[1000] max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-4">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-2">
              <h1 className="text-lg font-semibold">
                Class Chart – {classBooking.studentName}
              </h1>
              <button
                onClick={() => setOpen(false)}
                className="text-red-600 font-bold text-xl"
              >
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="mt-4">
              {loading ? (
                <p className="text-gray-500 text-center">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100 text-xs">
                      <tr>
                        <th className="px-3 py-2 border">#</th>
                        <th className="px-3 py-2 border">Date</th>
                        <th className="px-3 py-2 border">Time In</th>
                        <th className="px-3 py-2 border">Time Out</th>
                        <th className="px-3 py-2 border">Duration</th>
                        <th className="px-3 py-2 border">Mentor</th>
                        <th className="px-3 py-2 border">Parent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r, i) => (
                        <tr key={r._id} className="border">
                          <td className="px-3 py-2 border">{i + 1}</td>

                          <td className="px-3 py-2 border">
                            {new Date(r.date).toLocaleDateString("en-IN")}
                          </td>

                          <td className="px-3 py-2 border">{r.timeIn || "-"}</td>

                          <td className="px-3 py-2 border">
                            {r.timeOut || "-"}
                          </td>

                          <td className="px-3 py-2 border">
                            {r.duration || "-"}
                          </td>

                          <td className="px-3 py-2 border">
                            {r.mentorTick ? (
                              <span className="text-green-600 font-semibold">
                                ✔
                              </span>
                            ) : (
                              <span className="text-red-600">✘</span>
                            )}
                          </td>

                          <td className="px-3 py-2 border">
                            {r.parentTick ? (
                              <span className="text-green-600 font-semibold">
                                ✔
                              </span>
                            ) : (
                              <span className="text-red-600">✘</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
