
import React, { useState, useEffect } from "react";
import api from "../api";
import CustomLoading from "../components/CustomLoading";

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [uploadForms, setUploadForms] = useState({});
  const [classDropdownOpen, setClassDropdownOpen] = useState({});
  const [loading, setLoading] = useState(false); // loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchMembers(), fetchClasses()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchMembers = async () => {
    const res = await api.get("/members");
    setMembers(res.data);
  };

  const fetchClasses = async () => {
    const res = await api.get("/classes");
    setClasses(res.data);
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form._id) {
        await api.put(`/members/${form._id}`, form);
      } else {
        await api.post("/members", form);
      }
      setForm({ name: "", email: "", password: "" });
      await fetchMembers();
    } finally {
      setLoading(false);
    }
  };

  const edit = (m) => setForm({ _id: m._id, name: m.name, email: m.email });

  const del = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/members/${id}`);
      await fetchMembers();
    } finally {
      setLoading(false);
    }
  };

  const toggleClassAssignment = async (classId, memberId, isAssigned) => {
    setLoading(true);
    try {
      if (isAssigned) {
        await api.post(`/classes/${classId}/unassign/${memberId}`);
      } else {
        await api.post(`/classes/${classId}/assign/${memberId}`);
      }
      await fetchClasses();
    } finally {
      setLoading(false);
    }
  };

  const isMemberInClass = (cls, memberId) =>
    cls.members.some((m) => m._id === memberId);

  const handleUploadChange = (e, memberId) => {
    const { name, value, files } = e.target;
    setUploadForms((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [name]: files ? files[0] : value,
      },
    }));
  };

  const handleUploadSubmit = async (e, memberId) => {
    e.preventDefault();
    const formState = uploadForms[memberId];
    if (!formState?.class || !formState?.file) {
      alert("Please select class and PDF file");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("member", memberId);
      fd.append("class", formState.class);
      fd.append("file", formState.file);
      await api.post("/workouts/upload", fd);
      alert("Workout PDF uploaded!");
      setUploadForms((prev) => ({
        ...prev,
        [memberId]: { class: "", file: null },
      }));
    } finally {
      setLoading(false);
    }
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
      <>
        <CustomLoading />
      </>
    );
  }

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-8">
      {/* Member Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Member</h2>
        <form
          onSubmit={save}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <input
            className="border border-gray-300 p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border border-gray-300 p-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border border-gray-300 p-2 rounded"
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <button className={`${baseBtn} ${blueGradient}`}>
              {form._id ? "Update" : "Add"} Member
            </button>
          </div>
        </form>
      </div>

      {/* Members List */}
      <div className="space-y-6">
        {members.map((member) => (
          <div
            key={member._id}
            className="bg-white shadow-sm rounded-lg p-4 flex flex-col lg:flex-row lg:items-start justify-between gap-6"
          >
            {/* Basic Info */}
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.email}</p>
            </div>

            {/* Class Assignments */}
            <div className="flex-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setClassDropdownOpen((prev) => ({
                      ...prev,
                      [member._id]: !prev[member._id],
                    }))
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded text-left bg-gray-50 hover:bg-gray-100"
                >
                  {classes
                    .filter((cls) => isMemberInClass(cls, member._id))
                    .map((c) => c.title)
                    .join(", ") || "Assign Classes"}
                </button>

                {classDropdownOpen[member._id] && (
                  <div className="absolute z-20 bg-white border rounded mt-2 max-h-48 overflow-y-auto w-full shadow-lg">
                    {classes.map((cls) => {
                      const isAssigned = isMemberInClass(cls, member._id);
                      return (
                        <label
                          key={cls._id}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() =>
                              toggleClassAssignment(
                                cls._id,
                                member._id,
                                isAssigned
                              )
                            }
                            className="mr-2"
                          />
                          {cls.title}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Workout */}
            <div className="flex-1">
              <form
                onSubmit={(e) => handleUploadSubmit(e, member._id)}
                className="space-y-2 text-sm"
              >
                <select
                  name="class"
                  onChange={(e) => handleUploadChange(e, member._id)}
                  className="border px-2 py-2 w-full rounded"
                  value={uploadForms[member._id]?.class || ""}
                  required
                >
                  <option value="">Select Class</option>
                  {classes
                    .filter((cls) => isMemberInClass(cls, member._id))
                    .map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.title}
                      </option>
                    ))}
                </select>
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  onChange={(e) => handleUploadChange(e, member._id)}
                  className="block w-full"
                  required
                />

                <button className={`${baseBtn} ${greenGradient} text-sm`}>
                  Upload Workout
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1">
              <button
                className={`${baseBtn} ${blueGradient} text-xs px-3 py-1`}
                onClick={() => edit(member)}
              >
                Edit
              </button>
              <button
                className={`${baseBtn} ${redGradient} text-xs px-3 py-1`}
                onClick={() => del(member._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
