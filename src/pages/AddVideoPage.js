import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AddVideoPage.css';

function AddVideoPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('その他');
  const [notes, setNotes] = useState('');
  
  const navigate = useNavigate();
  
  // YouTubeのURLからビデオIDを抽出する関数
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // YouTubeのAPIからビデオ情報を取得する関数
  // 注: 実際のアプリではAPIキーが必要です
  const fetchVideoInfo = async (videoId) => {
    // ここでは簡易的に処理しています
    // 本番環境ではYouTube Data APIを使用してください
    try {
      // この部分は実際のAPIキーで置き換える必要があります
      // const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=YOUR_API_KEY`);
      // const data = await response.json();
      // return data.items[0].snippet;
      
      // APIなしでとりあえず進めるためのダミーデータ
      return {
        title: title || 'YouTube動画',
        channelTitle: 'チャンネル名', // APIがあれば自動取得
        thumbnails: {
          medium: {
            url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          }
        }
      };
    } catch (error) {
      console.error('Error fetching video info:', error);
      throw new Error('動画情報の取得に失敗しました');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // URLからビデオIDを抽出
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('無効なYouTube URLです');
      }
      
      // 動画情報を取得
      const videoInfo = await fetchVideoInfo(videoId);
      
      // Firestoreに保存
      const videoData = {
        youtubeId: videoId,
        url,
        title: title || videoInfo.title,
        channelName: videoInfo.channelTitle,
        thumbnailUrl: videoInfo.thumbnails.medium.url,
        category,
        notes,
        favorite: false,
        watchStatus: '未視聴',
        lastPlayPosition: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'videos'), videoData);
      
      // 保存成功後、ホームページに戻る
      navigate('/');
    } catch (error) {
      console.error('Error adding video:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-video-page">
      <h1>新しい動画を追加</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>YouTube URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..." 
            required
          />
        </div>
        
        <div className="form-group">
          <label>タイトル (空欄の場合、自動取得)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="動画のタイトル" 
          />
        </div>
        
        <div className="form-group">
          <label>カテゴリ</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="お気に入り">お気に入り</option>
            <option value="教育">教育</option>
            <option value="エンタメ">エンタメ</option>
            <option value="テック">テック</option>
            <option value="その他">その他</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>メモ</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="動画に関するメモを残せます"
            rows="4"
          ></textarea>
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? '保存中...' : '動画を保存'}
        </button>
      </form>
    </div>
  );
}

export default AddVideoPage;