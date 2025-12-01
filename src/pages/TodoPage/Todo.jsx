import React, { useEffect, useState } from "react";
import { FaEdit, FaCheck, FaPlus, FaTrash, FaClipboardList, FaRegCheckCircle, FaRegCircle, FaTimes, FaBars, FaFire, FaStar, FaBell } from "react-icons/fa";
import { AiFillDelete, AiOutlineLoading3Quarters, AiOutlineRocket } from "react-icons/ai";
import { MdTask, MdDeleteSweep, MdAddTask, MdDashboard, MdPalette } from "react-icons/md";
import { BsThreeDotsVertical, BsCalendarCheck, BsLightningFill } from "react-icons/bs";
import { GiAchievement } from "react-icons/gi";
import { TbBrandSpeedtest } from "react-icons/tb";
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
  const [isMobile, setIsMobile] = useState(false);
  const [colorTheme, setColorTheme] = useState("purple"); // purple, blue, green, orange

  // Color themes
  const themes = {
    purple: {
      primary: "from-purple-600 to-pink-600",
      secondary: "from-indigo-600 to-purple-600",
      accent: "from-violet-600 to-purple-600",
      light: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      text: "text-purple-400",
      bg: "from-gray-900 via-purple-900 to-blue-900"
    },
    blue: {
      primary: "from-blue-600 to-cyan-600",
      secondary: "from-sky-600 to-blue-600",
      accent: "from-teal-600 to-cyan-600",
      light: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      text: "text-blue-400",
      bg: "from-gray-900 via-blue-900 to-cyan-900"
    },
    green: {
      primary: "from-emerald-600 to-green-600",
      secondary: "from-lime-600 to-emerald-600",
      accent: "from-green-600 to-emerald-600",
      light: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      bg: "from-gray-900 via-emerald-900 to-green-900"
    },
    orange: {
      primary: "from-orange-600 to-red-600",
      secondary: "from-amber-600 to-orange-600",
      accent: "from-red-600 to-orange-600",
      light: "from-orange-500/20 to-red-500/20",
      border: "border-orange-500/30",
      text: "text-orange-400",
      bg: "from-gray-900 via-orange-900 to-red-900"
    }
  };

  const theme = themes[colorTheme];

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get all Todos
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/todo/todos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(res.data.todos || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        toast.error("Session expired. Please login again.");
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
        return !todo.selected;
      case "completed":
        return todo.selected;
      default:
        return true;
    }
  });

  // Add Todo with animation
  const handleAdd = async () => {
    if (!todo.trim()) {
      toast.warning("Please enter a todo!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/todo/add`, { title: todo }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos([...todos, res.data.todo]);
      setTodo("");
      toast.success("🎉 Todo Added Successfully!", {
        icon: '🚀',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }
      });
      if (isMobile) setSidebarOpen(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error adding todo!");
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && todo.length > 3) {
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
      toast.error("🗑️ Todo Deleted!", {
        icon: '💥',
        style: {
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        }
      });
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
      toast.info("✨ Todo Updated!", {
        icon: '🎯',
        style: {
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        }
      });
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

  // Checkbox toggle
  const handleCheckbox = (id) => {
    setTodos(
      todos.map((t) => (t._id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  // Select all toggle
  const toggleSelectAll = () => {
    const newSelect = !selectAll;
    setSelectAll(newSelect);
    setTodos(todos.map((t) => ({ ...t, selected: newSelect })));
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
      toast.error(`🔥 ${selectedTodos.length} Todos Deleted!`, {
        icon: '💥',
        style: {
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        }
      });
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

  // Change theme
  const changeTheme = (newTheme) => {
    setColorTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}!`, {
      icon: '🎨',
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-500`}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="dark"
        className="mt-16"
        toastStyle={{
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(30, 30, 40, 0.9)',
        }}
      />
      <Navbar setToken={setToken} />

      {/* Theme Selector */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => changeTheme("purple")}
          className={`p-2 rounded-full ${colorTheme === "purple" ? "bg-purple-600 ring-2 ring-purple-400" : "bg-gray-800/80"} backdrop-blur-sm`}
          title="Purple Theme"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
        </button>
        <button
          onClick={() => changeTheme("blue")}
          className={`p-2 rounded-full ${colorTheme === "blue" ? "bg-blue-600 ring-2 ring-blue-400" : "bg-gray-800/80"} backdrop-blur-sm`}
          title="Blue Theme"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
        </button>
        <button
          onClick={() => changeTheme("green")}
          className={`p-2 rounded-full ${colorTheme === "green" ? "bg-emerald-600 ring-2 ring-emerald-400" : "bg-gray-800/80"} backdrop-blur-sm`}
          title="Green Theme"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-green-500"></div>
        </button>
        <button
          onClick={() => changeTheme("orange")}
          className={`p-2 rounded-full ${colorTheme === "orange" ? "bg-orange-600 ring-2 ring-orange-400" : "bg-gray-800/80"} backdrop-blur-sm`}
          title="Orange Theme"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-red-500"></div>
        </button>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-24 left-4 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-2xl animate-pulse hover:animate-none transition-all duration-300 hover:scale-110"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Mobile Add Button */}
      <button
        onClick={() => {
          setTodo("");
          if (isMobile) {
            setSidebarOpen(true);
          }
        }}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-full shadow-2xl animate-bounce hover:animate-none transition-all duration-300 hover:scale-110"
      >
        <FaPlus className="text-2xl" />
      </button>

      {/* Main Container - Full Screen */}
      <div className="flex h-[calc(100vh-80px)] pt-20 md:pt-24">
        {/* Sidebar - Add Todo Section */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-full sm:w-80 bg-gray-800/90 backdrop-blur-xl border-r ${theme.border} transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 sm:p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <MdAddTask className={`${theme.text} animate-pulse`} />
                  Create Task
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white p-2 hover:bg-gray-700/50 rounded-lg transition-all"
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
                  <div className="relative group">
                    <input
                      onChange={(e) => setTodo(e.target.value)}
                      onKeyPress={handleKeyPress}
                      value={todo}
                      type="text"
                      placeholder="What needs to be done?"
                      className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl px-4 py-3 pl-12 outline-none text-white placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                    />
                    <FaPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-400">
                      {todo.length > 0 ? `${todo.length}/3 characters` : "Min. 3 characters"}
                    </span>
                    <span className={`font-medium flex items-center gap-1 ${
                      todo.length >= 3 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {todo.length >= 3 ? <><FaCheck /> Ready</> : 'Too short'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleAdd}
                  disabled={todo.length <= 3}
                  className={`w-full bg-gradient-to-r ${theme.primary} hover:opacity-90 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-4 sm:px-6 py-3 rounded-2xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-xl flex items-center gap-2 justify-center group text-sm sm:text-base relative overflow-hidden`}
                >
                  <span className="relative z-10">
                    <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                  </span>
                  <span className="relative z-10">Add New Task</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>

                {/* Quick Stats */}
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <GiAchievement className="text-yellow-400" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FaClipboardList />
                        Total Tasks
                      </span>
                      <span className="text-white font-bold text-lg">{todos.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FaRegCheckCircle className="text-green-400" />
                        Completed
                      </span>
                      <span className="text-green-400 font-bold text-lg">
                        {todos.filter(t => t.selected).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <FaRegCircle className="text-orange-400" />
                        Pending
                      </span>
                      <span className="text-orange-400 font-bold text-lg">
                        {todos.filter(t => !t.selected).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <BsLightningFill className="text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={toggleSelectAll}
                      className="w-full text-left px-3 py-3 rounded-xl hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group hover:translate-x-2"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${theme.light} ${theme.border} border`}>
                        <FaClipboardList className="text-white" />
                      </div>
                      <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      disabled={!todos.some(t => t.selected)}
                      className="w-full text-left px-3 py-3 rounded-xl hover:bg-red-600/20 disabled:hover:bg-gray-600/50 text-gray-300 hover:text-white disabled:text-gray-500 transition-all duration-300 flex items-center gap-2 group hover:translate-x-2"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30">
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Todos List */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header */}
          <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/30 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 flex-wrap">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <BsCalendarCheck className="text-purple-400" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    My Task Manager
                  </span>
                  <span className={`bg-gradient-to-r ${theme.primary} text-white text-xs sm:text-sm px-3 py-1.5 rounded-full animate-pulse`}>
                    {filteredTodos.length} tasks
                  </span>
                </h1>
                <p className="text-gray-400 mt-2 text-sm sm:text-base flex items-center gap-2">
                  <AiOutlineRocket className="text-purple-400" />
                  Manage your daily tasks efficiently
                </p>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 w-full sm:w-auto overflow-x-auto">
                {[
                  { key: "all", label: "All", count: todos.length, icon: <FaClipboardList /> },
                  { key: "active", label: "Active", count: todos.filter(t => !t.selected).length, icon: <FaFire className="text-orange-400" /> },
                  { key: "completed", label: "Completed", count: todos.filter(t => t.selected).length, icon: <FaStar className="text-yellow-400" /> }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.key
                        ? `bg-gradient-to-r ${theme.primary} text-white shadow-lg`
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
            <div className={`bg-gradient-to-br ${theme.light} backdrop-blur-sm rounded-2xl p-4 sm:p-6 border ${theme.border} hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${theme.primary}`}>
                  <FaClipboardList className="text-xl sm:text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{todos.length}</p>
                  <p className={`${theme.text} text-xs sm:text-sm`}>Total Tasks</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-emerald-500/30 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                  <FaRegCheckCircle className="text-xl sm:text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {todos.filter(t => t.selected).length}
                  </p>
                  <p className="text-emerald-300 text-xs sm:text-sm">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-orange-500/30 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                  <FaRegCircle className="text-xl sm:text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {todos.filter(t => !t.selected).length}
                  </p>
                  <p className="text-orange-300 text-xs sm:text-sm">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Todos List */}
          <div className="flex-1 overflow-hidden p-4 sm:p-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 h-full flex flex-col shadow-2xl">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <AiOutlineLoading3Quarters className="animate-spin text-3xl sm:text-4xl text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm sm:text-base animate-pulse">Loading your tasks...</p>
                    </div>
                  </div>
                ) : filteredTodos.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4 text-gray-600 animate-bounce">📝</div>
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
                    {filteredTodos.map((item, index) => (
                      <div 
                        key={item._id} 
                        className="group flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-purple-500/50 hover:from-purple-900/20 hover:to-gray-900/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <button
                          onClick={() => handleCheckbox(item._id)}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                            item.selected
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400 text-white shadow-lg'
                              : 'border-gray-500 hover:border-purple-400 text-transparent hover:shadow-purple-500/20 hover:shadow-lg'
                          }`}
                        >
                          {item.selected && <FaCheck className="text-xs" />}
                        </button>
                        
                        <span className={`flex-1 text-sm sm:text-base break-words transition-all duration-300 ${
                          item.selected 
                            ? "line-through text-gray-500" 
                            : "text-white font-medium"
                        }`}>
                          {item.title}
                        </span>

                        <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() => confirmEditTodo(item._id, item.title)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-300 hover:scale-110"
                            title="Edit task"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => confirmDeleteTodo(item._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-110"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-sm mx-4 text-center shadow-2xl border border-gray-700/50 backdrop-blur-xl animate-slideUp">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <FaTrash className="text-2xl text-red-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Delete Task</h2>
            <p className="text-gray-400 mb-6">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(todoToDelete);
                  setShowDeleteModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-sm mx-4 text-center shadow-2xl border border-gray-700/50 backdrop-blur-xl animate-slideUp">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <FaEdit className="text-2xl text-blue-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Edit Task</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 text-sm sm:text-base backdrop-blur-sm"
              placeholder="Enter task title..."
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
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