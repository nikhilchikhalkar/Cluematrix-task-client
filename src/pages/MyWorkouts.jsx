

import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';

export default function MyWorkouts() {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (!user || !user._id) return;

    api.get(`/workouts/member/${user._id}`)
      .then(res => {
        // Filter valid fileUrl plans
        const assignedPlans = res.data.filter(p => p.fileUrl);

        // Deduplicate by classId (keep latest _id)
        const uniqueByClass = assignedPlans.reduce((acc, plan) => {
          const classId = plan.class?._id || 'no-class';
          if (!acc[classId] || plan._id > acc[classId]._id) {
            acc[classId] = plan;
          }
          return acc;
        }, {});

        setPlans(Object.values(uniqueByClass));
      })
      .catch(err => console.error('Error fetching workout plans:', err));
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Assigned Workout Plans</h2>
      {plans.length === 0 ? (
        <p className="text-gray-600">No workout plans assigned yet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-4">
          {plans.map(p => (
            <li key={p._id} className="space-y-1">
              <p><strong>Class:</strong> {p.class?.title || 'N/A'}</p>
              <a
                // href={`http://localhost:5000/uploads/${p.fileUrl}`}
                href={`${process.env.REACT_APP_API_BASE_FILE_URL}uploads/${p.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View / Download Workout PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
