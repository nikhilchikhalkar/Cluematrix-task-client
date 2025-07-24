
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import CustomLoading from '../components/CustomLoading';

export default function ClassDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [cls, setCls] = useState(null);
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await api.get(`/classes/${id}`);
        setCls(res.data);
      } catch (err) {
        console.error("Failed to fetch class:", err);
      }
    };

    const fetchWorkout = async () => {
      if (user.role !== 'admin') {
        try {
          const res = await api.get(`/workouts/member/${user._id}`);
          const workoutForClass = res.data.find(w => w.class?._id === id);
          setWorkout(workoutForClass || null);
        } catch (err) {
          console.error("Failed to fetch workout:", err);
        }
      }
    };

    fetchClass();
    fetchWorkout();
  }, [id, user]);


   const baseBtn =
    "px-4 py-2 text-white font-semibold rounded shadow transition duration-300";
  const blueGradient =
    "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";
  const greenGradient =
    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";
  const redGradient =
    "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700";

  if (!cls) return <CustomLoading/>

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Link
        to={user.role === 'admin' ? '/admin/classes' : '/member/classes'}
        className="text-blue-600 hover:text-blue-800 transition mb-6  flex "
      >
        <ArrowLeft />Back to Classes
      </Link>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{cls.title}</h2>

        <div className="space-y-3 text-gray-700">
          <p><strong>Schedule:</strong> {cls.schedule}</p>
          <p><strong>Description:</strong> {cls.description}</p>
        </div>

        <hr className="my-6" />

        {user.role !== 'admin' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Workout Plan</h3>
            {workout ? (
              <a
                href={`http://localhost:5000/uploads/${workout.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className={`${baseBtn} ${greenGradient} text-sm`}
              >
                View / Download PDF
              </a>
            ) : (
              <p className="text-sm text-gray-500 italic">No workout plan assigned for this class.</p>
            )}
          </div>
        )}

        {user.role === 'admin' && (
          <p className="italic text-gray-500">Admins cannot see workout plans here.</p>
        )}
      </div>
    </div>
  );
}
