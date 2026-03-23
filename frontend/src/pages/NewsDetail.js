import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/news/${id}`);
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-white text-2xl">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-white text-2xl">Article not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/news" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Back to News
        </Link>

        <article className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200';
              }}
            />
          )}

          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-purple-600 px-4 py-1 rounded-full text-sm font-bold capitalize">
                {article.category}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

            {article.author && (
              <p className="text-gray-400 mb-6">By {article.author}</p>
            )}

            {article.summary && (
              <p className="text-xl text-gray-300 mb-8 italic border-l-4 border-purple-500 pl-4">
                {article.summary}
              </p>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {article.content}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
