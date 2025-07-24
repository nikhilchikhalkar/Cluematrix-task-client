
import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import CustomLoading from "../components/CustomLoading";

export default function ClassList() {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    schedule: "",
  });
  const [loading, setLoading] = useState(false); // loading state

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    if (user.role === "admin") {
      fetchAllClasses();
    } else {
      Promise.all([fetchAssignedClasses(), fetchWorkoutPlans()]).finally(() =>
        setLoading(false)
      );
    }
  }, [user]);

  const fetchAllClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedClasses = async () => {
    const res = await api.get("/classes");
    const assigned = res.data.filter((c) =>
      c.members.some((m) => m._id === user._id)
    );
    setClasses(assigned);
  };

  const fetchWorkoutPlans = async () => {
    const res = await api.get(`/workouts/member/${user._id}`);
    setWorkouts(res.data);
  };

  // const getWorkoutForClass = (classId) => {
  //   return workouts.find((w) => w.class?._id === classId);
  // };

  const editClass = (cls) => {
    setForm(cls);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteClass = async (id) => {
    setLoading(true);
    await api.delete(`/classes/${id}`);
    await fetchAllClasses();
  };

  const saveClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (form._id) {
      await api.put(`/classes/${form._id}`, form);
    } else {
      await api.post("/classes", form);
    }
    setForm({ title: "", description: "", schedule: "" });
    await fetchAllClasses();
  };

  const baseBtn =
    "px-4 py-2 text-white font-semibold rounded shadow transition duration-300";
  const blueGradient =
    "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";
  const greenGradient =
    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";
  const redGradient =
    "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CustomLoading />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {user.role === "admin" ? "All Classes" : "My Classes"}
      </h2>

      {/* Admin-only class creation/editing form */}
      {user.role === "admin" && (
        <form
          onSubmit={saveClass}
          className="mb-6 space-y-2 p-4 border rounded bg-gray-50"
        >
          <h3 className="text-lg font-semibold">
            {form._id ? "Edit Class" : "Create New Class"}
          </h3>
          <input
            className="border p-2 w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="border p-2 w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Schedule"
            value={form.schedule}
            onChange={(e) => setForm({ ...form, schedule: e.target.value })}
          />
          <button
            type="submit"
            className={`${baseBtn} ${greenGradient} text-sm`}
          >
            {form._id ? "Update" : "Create"} Class
          </button>
        </form>
      )}

      {classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <ul className="space-y-4">
          {classes.map((c) => (
            <li key={c._id} className="border p-4 rounded bg-white shadow">
              <div className="flex justify-between items-center">
                {/* Link to class details page */}
                <Link
                  to={`/member/classes/${c._id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {c.title}
                </Link>

                {user.role === "admin" && (
                  <div className="flex gap-4">
                    <button
                      className={`${baseBtn} ${blueGradient} text-xs px-3 py-1`}
                      onClick={() => editClass(c)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${baseBtn} ${redGradient} text-xs px-3 py-1`}
                      onClick={() => deleteClass(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
