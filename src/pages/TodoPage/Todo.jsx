import React, { useEffect, useState } from "react";
import { FaEdit, FaCheck, FaPlus, FaTrash, FaClipboardList, FaRegCheckCircle, FaRegCircle, FaTimes, FaBars } from "react-icons/fa";
import { AiFillDelete, AiOutlineLoading3Quarters, AiOutlineRocket } from "react-icons/ai";
import { MdDeleteSweep, MdAddTask } from "react-icons/md";
import { BsCalendarCheck, BsLightningFill } from "react-icons/bs";
import { GiAchievement } from "react-icons/gi";
import axios from "axios";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Todo({ setToken }) {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;

  // Get all Todos
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again!");
        return;
      }

      const res = await axios.get(`${API}/todo/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTodos(res.data.todos || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please login again.");
      } else {
        toast.error("Error fetching todos!");
      }
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Filter todos based on active tab
  const filteredTodos = todos.filter(todo => {
    switch (activeTab) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  // Add Todo
  const handleAdd = async () => {
    const trimmedTodo = todo.trim();
    if (trimmedTodo.length < 3) {
      toast.warning("Please enter at least 3 characters!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    // Duplicate check
    const isDuplicate = todos.some(t => t.title.toLowerCase() === trimmedTodo.toLowerCase());
    if (isDuplicate) {
      toast.error("This todo already exists!");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/todo/add`,
        { title: trimmedTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, res.data.todo]);
      setTodo("");
      toast.success("🎉 Todo Added Successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please login again.");
      } else {
        toast.error("Error adding todo!");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && todo.trim().length >= 3) {
      handleAdd();
    }
  };

  // Actual Delete function
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/todo/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(todos.filter((t) => t._id !== id));
      toast.error("🗑️ Todo Deleted!");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error deleting todo!");
      }
    }
  };

  // Open Delete modal
  const confirmDeleteTodo = (id) => {
    setTodoToDelete(id);
    setShowDeleteModal(true);
  };

  // Open Edit modal
  const confirmEditTodo = (id, title) => {
    setTodoToEdit(id);
    setNewTitle(title);
    setShowEditModal(true);
  };

  // Save Edit
  const handleEditSave = async () => {
    if (!newTitle.trim()) return toast.warning("Title cannot be empty!");

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/todo/edit/${todoToEdit}`, { title: newTitle }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(
        todos.map((t) =>
          t._id === todoToEdit ? { ...t, title: newTitle } : t
        )
      );
      setShowEditModal(false);
      setTodoToEdit(null);
      toast.info("✨ Todo Updated!");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error updating todo!");
      }
    }
  };

  const handleCompletedChange = async (todoId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login again!");

      const res = await axios.patch(
        `${API}/todo/todos/${todoId}`,
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTodos(prev =>
        prev.map(t =>
          t._id === todoId ? { ...t, completed: res.data.todo.completed } : t
        )
      );
    } catch (err) {
      toast.error("Failed to update todo!");
      console.error(err);
    }
  };

  const toggleSelectAll = () => {
    const newSelect = !selectAll;
    setSelectAll(newSelect);
    setTodos(todos.map(t => ({ ...t, selected: newSelect })));
  };

  // Delete all selected
  const handleDeleteAll = async () => {
    const selectedTodos = todos.filter((t) => t.selected);
    if (!selectedTodos.length) {
      toast.warning("No todos selected!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      for (let t of selectedTodos) {
        await axios.delete(`${API}/todo/delete/${t._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      setTodos(todos.filter((t) => !t.selected));
      setSelectAll(false);
      toast.error(`🔥 ${selectedTodos.length} Todos Deleted!`);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error deleting selected todos!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-blue-900">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="dark"
        className="mt-16"
        toastStyle={{
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(15, 25, 35, 0.9)',
        }}
      />
      <Navbar setToken={setToken} />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-24 left-4 z-40 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-3 rounded-full shadow-lg hover:shadow-teal-500/50 transition-all"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Mobile Add Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-full shadow-lg hover:shadow-teal-500/50 transition-all"
      >
        <FaPlus className="text-2xl" />
      </button>

      {/* Main Container */}
      <div className="flex h-[calc(100vh-80px)] pt-20">
        {/* Sidebar - Add Todo Section */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-full sm:w-80 lg:w-96 bg-gray-800/95 backdrop-blur-xl border-r border-teal-500/30 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 sm:p-6 border-b border-teal-500/30">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <MdAddTask className="text-teal-400" />
                  Create Task
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white p-2 hover:bg-teal-500/20 rounded-lg transition-all"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>

            {/* Add Todo Form */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Description
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => setTodo(e.target.value)}
                      onKeyPress={handleKeyPress}
                      value={todo}
                      type="text"
                      placeholder="What needs to be done?"
                      className="w-full bg-gray-700/50 border border-teal-500/30 rounded-lg px-4 py-3 pl-12 outline-none text-white placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                    <FaPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-400">
                      {todo.length > 0 ? `${todo.length}/3 characters` : "Min. 3 characters"}
                    </span>
                    <span className={`font-medium ${todo.length >= 3 ? 'text-green-400' : 'text-red-400'}`}>
                      {todo.length >= 3 ? '✓ Ready' : 'Too short'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleAdd}
                  disabled={todo.trim().length < 3}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-4 sm:px-6 py-3 rounded-lg transition-all flex items-center gap-2 justify-center shadow-lg hover:shadow-teal-500/30"
                >
                  <FaPlus />
                  Add New Task
                </button>

                {/* Quick Stats */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-teal-500/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <GiAchievement className="text-amber-400" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FaClipboardList className="text-teal-400" />
                        Total Tasks
                      </span>
                      <span className="text-white font-bold text-lg">{todos.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FaRegCheckCircle className="text-emerald-400" />
                        Completed
                      </span>
                      <span className="text-emerald-400 font-bold text-lg">
                        {todos.filter(t => t.completed).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FaRegCircle className="text-amber-400" />
                        Pending
                      </span>
                      <span className="text-amber-400 font-bold text-lg">
                        {todos.filter(t => !t.completed).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-teal-500/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <BsLightningFill className="text-amber-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={toggleSelectAll}
                      className="w-full text-left px-3 py-3 rounded-lg hover:bg-teal-500/20 text-gray-300 hover:text-white transition-all flex items-center gap-2"
                    >
                      <div className="p-2 rounded-lg bg-teal-500/20 border border-teal-500/30">
                        <FaClipboardList className="text-teal-400" />
                      </div>
                      <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      disabled={!todos.some(t => t.selected)}
                      className="w-full text-left px-3 py-3 rounded-lg hover:bg-red-600/20 disabled:hover:bg-gray-600/50 text-gray-300 hover:text-white disabled:text-gray-500 transition-all flex items-center gap-2"
                    >
                      <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                        <MdDeleteSweep className="text-red-400" />
                      </div>
                      <span>Delete Selected</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Todos List */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header */}
          <div className="bg-gray-800/30 border-b border-teal-500/30 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-500/30">
                    <BsCalendarCheck className="text-teal-400" />
                  </div>
                  <span>My Task Manager</span>
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full">
                    {filteredTodos.length} tasks
                  </span>
                </h1>
                <p className="text-gray-400 mt-2 text-sm sm:text-base flex items-center gap-2">
                  <AiOutlineRocket className="text-teal-400" />
                  Manage your daily tasks efficiently
                </p>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-800/50 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
                {[
                  { key: "all", label: "All", count: todos.length, icon: <FaClipboardList className="text-teal-400" /> },
                  { key: "active", label: "Active", count: todos.filter(t => !t.completed).length },
                  { key: "completed", label: "Completed", count: todos.filter(t => t.completed).length }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-teal-500/20'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key ? 'bg-white/20' : 'bg-gray-600/50'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-teal-500/30 hover:border-teal-400/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600">
                  <FaClipboardList className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{todos.length}</p>
                  <p className="text-teal-400 text-sm">Total Tasks</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                  <FaRegCheckCircle className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {todos.filter(t => t.completed).length}
                  </p>
                  <p className="text-emerald-300 text-sm">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-amber-500/30 hover:border-amber-400/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                  <FaRegCircle className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {todos.filter(t => !t.completed).length}
                  </p>
                  <p className="text-amber-300 text-sm">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Todos List */}
          <div className="flex-1 overflow-hidden p-4 sm:p-6">
            <div className="bg-gray-800/30 rounded-xl border border-teal-500/30 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <AiOutlineLoading3Quarters className="animate-spin text-3xl sm:text-4xl text-teal-400 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm sm:text-base">Loading your tasks...</p>
                    </div>
                  </div>
                ) : filteredTodos.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4 text-gray-600">📝</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
                        {activeTab === "all" ? "No tasks yet" : 
                         activeTab === "active" ? "No active tasks" : "No completed tasks"}
                      </h3>
                      <p className="text-gray-500 text-sm sm:text-base">
                        {activeTab === "all" ? "Create your first task to get started!" :
                         activeTab === "active" ? "All tasks are completed! 🎉" : "Complete some tasks to see them here"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTodos.map((item) => (
                      <div 
                        key={item._id} 
                        className="group flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-teal-500/20 hover:border-teal-400/50 transition-all hover:bg-teal-500/5"
                      >
                        <button
                          onClick={() => handleCompletedChange(item._id, item.completed)}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            item.completed
                              ? 'bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-400 text-white'
                              : 'border-gray-500 hover:border-teal-400'
                          }`}
                        >
                          {item.completed && <FaCheck className="text-xs" />}
                        </button>
                        
                        <span className={`flex-1 text-sm sm:text-base break-words ${
                          item.completed ? "line-through text-gray-500" : "text-white font-medium"
                        }`}>
                          {item.title}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => confirmEditTodo(item._id, item.title)}
                            className="p-2 text-gray-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg transition-all"
                            title="Edit task"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => confirmDeleteTodo(item._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Delete task"
                          >
                            <AiFillDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm mx-4 text-center border border-teal-500/30">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <FaTrash className="text-2xl text-red-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Delete Task</h2>
            <p className="text-gray-400 mb-6">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(todoToDelete);
                  setShowDeleteModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 text-white px-4 py-3 rounded-lg font-semibold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm mx-4 text-center border border-teal-500/30">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
              <FaEdit className="text-2xl text-teal-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Edit Task</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
              className="w-full bg-gray-700 border border-teal-500/30 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-white placeholder-gray-400 transition-all"
              placeholder="Enter task title..."
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 text-white px-4 py-3 rounded-lg font-semibold transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Todo;