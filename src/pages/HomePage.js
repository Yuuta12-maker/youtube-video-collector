import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import VideoCard from '../components/VideoCard';

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  
  // カテゴリリスト（実際のアプリでは動的に生成することも可能）
  const categories = ['all', 'お気に入り', '教育', 'エンタメ', 'テック', 'その他'];

  useEffect(() => {
    // Firestoreからデータを取得
    const fetchVideos = async () => {
      try {
        const videoCollection = collection(db, 'videos');
        const videoSnapshot = await getDocs(videoCollection);
        const videoList = videoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVideos(videoList);
      } catch (error) {
        console.error('Error fetching videos: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // 検索とフィルタリング
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          video.channelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || video.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="home-page">
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="動画を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="no-videos">
          <p>動画が見つかりませんでした。</p>
          <Link to="/add" className="btn">動画を追加する</Link>
        </div>
      ) : (
        <div className="video-grid">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;