import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Todo({ setToken }) {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  // ✅ CORRECT API URL - without /todo
  const API = import.meta.env.VITE_API_BASE_URL;

  // Get all Todos
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      // ✅ CORRECT ENDPOINT
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
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add Todo
  const handleAdd = async () => {
    if (!todo.trim()) return;

    try {
      const token = localStorage.getItem("token");
      // ✅ CORRECT ENDPOINT
      const res = await axios.post(`${API}/todo/add`, { title: todo }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos([...todos, res.data.todo]);
      setTodo("");
      toast.success("Todo Added Successfully!");
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

  // Actual Delete function
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      // ✅ CORRECT ENDPOINT
      await axios.delete(`${API}/todo/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(todos.filter((t) => t._id !== id));
      toast.error("Todo Deleted!");
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
      // ✅ CORRECT ENDPOINT
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
      toast.info("Todo Updated!");
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
        // ✅ CORRECT ENDPOINT
        await axios.delete(`${API}/todo/delete/${t._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      setTodos(todos.filter((t) => !t.selected));
      setSelectAll(false);
      toast.error("Selected Todos Deleted!");
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
    <div>
      <ToastContainer position="bottom-center" autoClose={2000} theme="dark" />
      <Navbar setToken={setToken} />

      <div className="relative mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">iTask - Manage your todos</h1>

        {/* Add Todo */}
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex">
            <input
              onChange={(e) => setTodo(e.target.value)}
              value={todo}
              type="text"
              placeholder="Add a todo"
              className="w-full rounded-full px-5 py-1 outline-none border border-gray-300 focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3}
              className="w-full bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>

        {/* Select All + Delete All */}
        <div className="flex justify-between items-center my-4">
          <div className="flex items-center gap-2">
            <input
              id="selectAll"
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <label htmlFor="selectAll" className="font-medium">Select All</label>
          </div>

          <button
            onClick={handleDeleteAll}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-bold"
          >
            Delete All
          </button>
        </div>

        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No Todos to display</div>}

          {todos.map((item) => (
            <div key={item._id} className="todo flex my-3 justify-between">
              <div className="flex gap-5">
                <input
                  type="checkbox"
                  checked={item.selected || false}
                  onChange={() => handleCheckbox(item._id)}
                />
              </div>

              <div className={`${item.isCompleted ? "line-through text-gray-500" : ""}`}>
                {item.title}
              </div>

              <div className="button flex h-full">
                <button
                  onClick={() => confirmEditTodo(item._id, item.title)}
                  className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                >
                  <FaEdit className="w-4 h-6" />
                </button>

                <button
                  onClick={() => confirmDeleteTodo(item._id)}
                  className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                >
                  <AiFillDelete className="w-4 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this todo?</p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  handleDelete(todoToDelete);
                  setShowDeleteModal(false);
                  setTodoToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTodoToDelete(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div className="flex justify-around">
              <button
                onClick={handleEditSave}
                className="bg-violet-800 hover:bg-violet-950 text-white px-4 py-2 rounded-md font-bold"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setTodoToEdit(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Todo;