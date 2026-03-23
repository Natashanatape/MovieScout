import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', '']
  });

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/polls`);
      setPolls(res.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/polls`,
        newPoll,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCreateForm(false);
      setNewPoll({ title: '', description: '', options: ['', ''] });
      fetchPolls();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create poll');
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/polls/${pollId}/vote`,
        { option_id: optionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh polls to get updated vote counts
      await fetchPolls();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to vote');
    }
  };

  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Community Polls</h1>
            <p className="text-purple-300">Vote and see what others think</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold"
          >
            {showCreateForm ? '✕ Cancel' : '+ Create Poll'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl mb-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Poll</h2>
            <form onSubmit={handleCreatePoll}>
              <input
                type="text"
                placeholder="Poll Title"
                value={newPoll.title}
                onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                className="w-full p-4 border border-gray-600 bg-gray-700/50 text-white rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newPoll.description}
                onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                className="w-full p-4 border border-gray-600 bg-gray-700/50 text-white rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                rows="3"
              />
              <div className="space-y-3 mb-4">
                <label className="text-purple-300 font-semibold">Poll Options:</label>
                {newPoll.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[index] = e.target.value;
                      setNewPoll({ ...newPoll, options: newOptions });
                    }}
                    className="w-full p-3 border border-gray-600 bg-gray-700/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    required
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="text-blue-400 mb-6 hover:text-blue-300 font-semibold transition"
              >
                + Add Another Option
              </button>
              <div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} onVote={handleVote} />
          ))}
        </div>

        {polls.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400 text-xl">No polls yet. Create the first one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PollCard = ({ poll, onVote }) => {
  const [options, setOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchPollDetails();
  }, [poll.id, poll.total_votes]); // Re-fetch when total votes change

  const fetchPollDetails = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/polls/${poll.id}`);
      setOptions(res.data.options);
    } catch (error) {
      console.error('Error fetching poll details:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
      <h3 className="text-2xl font-bold mb-3 text-white">{poll.title}</h3>
      {poll.description && (
        <p className="text-gray-300 mb-6 text-sm">{poll.description}</p>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              onVote(poll.id, option.id);
              setHasVoted(true);
            }}
            disabled={hasVoted}
            className="w-full p-4 border border-gray-600 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl hover:from-purple-600 hover:to-purple-700 text-left flex justify-between items-center text-white transition-all duration-300 transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-semibold">{option.option_text}</span>
            <span className="bg-purple-500/30 px-3 py-1 rounded-full text-sm">{option.vote_count} votes</span>
          </button>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
        <span>By {poll.username}</span>
        <span className="bg-blue-500/20 px-3 py-1 rounded-full">{poll.total_votes} total votes</span>
      </div>
    </div>
  );
};

export default Polls;
