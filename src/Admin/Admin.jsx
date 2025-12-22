import  { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

const AdminNavbar = ({ activeTab, setActiveTab }) => {
  const tabs = ["Dashboard", "Users", "Feedback"];
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_BASE_URL;


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login"); 
    }, 500);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`hover:text-blue-400 px-3 py-1 rounded ${
              activeTab === tab ? "text-blue-400 font-bold bg-gray-800" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          Role: <span className="text-green-400 font-bold">Admin</span>
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

const StatsCard = ({ title, value }) => (
  <div className="bg-white shadow-lg p-6 rounded-lg text-center border border-gray-200 hover:shadow-xl transition-shadow">
    <h2 className="text-gray-600 text-lg font-medium">{title}</h2>
    <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
  </div>
);

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    
    if (role !== "admin") {
      toast.error("Unauthorized! Admin access required");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
      return;
    }
  }, [navigate]);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }
      
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }
      
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }
      
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch feedbacks");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStats();
      await fetchUsers();
      await fetchFeedbacks();
      setLoading(false);
    };
    
    if (localStorage.getItem("role") === "admin") {
      loadData();
    }
  }, []);

  const updateRole = async (id, role) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${role}?`)) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      
      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }
      
      toast.success("Role updated successfully ✅");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role ❌");
    }
  };

  const deleteUser = async (id, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }
      
      toast.success("User deleted successfully ✅");
      fetchUsers();
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user ❌");
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/admin/feedbacks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }
      
      toast.success("Feedback deleted successfully ✅");
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete feedback ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-6">
        {loading ? (
          <div className="text-center mt-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500 text-lg">Loading admin data...</p>
          </div>
        ) : (
          <>
            {activeTab === "Dashboard" && (
              <>
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title="Total Users" value={stats.totalUsers ?? 0} />
                  <StatsCard title="Total Admins" value={stats.totalAdmins ?? 0} />
                  <StatsCard title="Total Feedbacks" value={stats.totalFeedbacks ?? 0} />
                  <StatsCard 
                    title="Avg Rating" 
                    value={stats.avgRating ? `${parseFloat(stats.avgRating).toFixed(1)} ⭐` : "0 ⭐"} 
                  />
                </div>
              </>
            )}

            {/* ---------------- Users Tab ---------------- */}
            {activeTab === "Users" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
                  <span className="text-sm text-gray-500">Total: {users.length} users</span>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center p-6 text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u._id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{u.name}</td>
                            <td className="p-3">{u.email}</td>
                            <td className="p-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                u.role === "admin" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {u.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    updateRole(u._id, u.role === "admin" ? "user" : "admin")
                                  }
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  {u.role === "admin" ? "Make User" : "Make Admin"}
                                </button>
                                <button
                                  onClick={() => deleteUser(u._id, u.name)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ---------------- Feedback Tab ---------------- */}
            {activeTab === "Feedback" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Feedback Management</h1>
                  <span className="text-sm text-gray-500">Total: {feedbacks.length} feedbacks</span>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Feedback</th>
                        <th className="p-3 text-left">Rating</th>
                        <th className="p-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center p-6 text-gray-500">
                            No feedbacks found
                          </td>
                        </tr>
                      ) : (
                        feedbacks.map((fb) => (
                          <tr key={fb._id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-medium">{fb.userId?.name || fb.name || "Anonymous"}</div>
                              <div className="text-sm text-gray-500">
                                {fb.userId?.email || fb.email || "No email"}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="max-w-xs truncate" title={fb.suggestion || fb.feedback || "No feedback"}>
                                {fb.suggestion || fb.feedback || "No feedback"}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${
                                      i < (fb.rating || 0) ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                                <span className="ml-2 font-medium">{fb.rating || 0}/5</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => deleteFeedback(fb._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}