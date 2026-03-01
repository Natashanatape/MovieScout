import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newList, setNewList] = useState({ name: '', description: '', is_public: true });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/lists', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLists(res.data.lists || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/lists', newList, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowCreate(false);
      setNewList({ name: '', description: '', is_public: true });
      fetchLists();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">My Lists</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-600"
          >
            + Create List
          </button>
        </div>

        {showCreate && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Create New List</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="List Name"
                value={newList.name}
                onChange={e => setNewList({...newList, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={newList.description}
                onChange={e => setNewList({...newList, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
              />
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={newList.is_public}
                  onChange={e => setNewList({...newList, is_public: e.target.checked})}
                  className="mr-2"
                />
                Make this list public
              </label>
              <div className="flex gap-3">
                <button type="submit" className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600">
                  Create
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map(list => (
            <Link
              key={list.id}
              to={`/list/${list.id}`}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">{list.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{list.description}</p>
              <span className="text-purple-400 text-sm">
                {list.is_public ? '🌐 Public' : '🔒 Private'}
              </span>
            </Link>
          ))}
        </div>

        {lists.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No lists yet. Create your first list!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLists;
