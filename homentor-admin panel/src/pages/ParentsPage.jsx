import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";

const ParentsPage = () => {
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    const res = await axios.get(
      "https://homentor-backend.onrender.com/api/users"
    );
    setParents(res.data.data || []);
  };

  const filteredParents = parents.filter(
    (p) =>
      p.parentName?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.toString().includes(search)
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Parents Management</h1>

        {/* Search */}
        <input
          placeholder="Search by name or phone"
          className="border px-4 py-2 rounded-lg mb-4 w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">SNo.</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Children</th>
                <th className="px-4 py-3">Disclaimer</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParents.map((p, index) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3 w-[20%]">
                    {p.address ? `${p?.address?.street}, ${p?.address?.city}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.children?.length || 0}
                  </td>

                  {/* Disclaimer Status */}
                  <td className="px-4 py-3 text-center">
                    {p.disclaimerAccepted ? (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Accepted
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedParent(p)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Disclaimers
                    </button>
                  </td>
                </tr>
              ))}

              {filteredParents.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No parents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Disclaimer Modal */}
        {selectedParent && (
          <DisclaimerViewModal
            parent={selectedParent}
            onClose={() => setSelectedParent(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ParentsPage;
