import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import YouTube from 'react-youtube';
import './WatchVideoPage.css';

function WatchVideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [player, setPlayer] = useState(null);
  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoDoc = doc(db, 'videos', id);
        const videoSnap = await getDoc(videoDoc);
        
        if (videoSnap.exists()) {
          const videoData = {
            id: videoSnap.id,
            ...videoSnap.data()
          };
          setVideo(videoData);
          setNotes(videoData.notes || '');
        } else {
          setError('動画が見つかりませんでした');
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('動画の読み込み中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
    
    // クリーンアップ関数: 終了時に再生位置を保存
    return () => {
      savePlayPosition();
    };
  }, [id]);
  
  // 動画の準備完了時に呼ばれる関数
  const onReady = (event) => {
    setPlayer(event.target);
    
    // 最後に視聴していた位置から再開
    if (video && video.lastPlayPosition) {
      event.target.seekTo(video.lastPlayPosition);
    }
    
    // 視聴ステータスを更新
    updateWatchStatus('視聴中');
  };
  
  // 5秒ごとに再生位置を保存
  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        savePlayPosition();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [player]);
  
  // 再生位置を保存する関数
  const savePlayPosition = async () => {
    if (player && video) {
      const currentTime = player.getCurrentTime();
      try {
        const videoRef = doc(db, 'videos', id);
        await updateDoc(videoRef, {
          lastPlayPosition: currentTime,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Error saving play position:', error);
      }
    }
  };
  
  // 視聴ステータスを更新する関数
  const updateWatchStatus = async (status) => {
    if (video) {
      try {
        const videoRef = doc(db, 'videos', id);
        await updateDoc(videoRef, {
          watchStatus: status,
          updatedAt: new Date()
        });
        
        // 状態も更新
        setVideo(prev => ({ ...prev, watchStatus: status }));
      } catch (error) {
        console.error('Error updating watch status:', error);
      }
    }
  };
  
  // メモを保存
  const saveNotes = async () => {
    if (video) {
      try {
        const videoRef = doc(db, 'videos', id);
        await updateDoc(videoRef, {
          notes,
          updatedAt: new Date()
        });
        alert('メモを保存しました');
      } catch (error) {
        console.error('Error saving notes:', error);
        alert('メモの保存に失敗しました');
      }
    }
  };
  
  // お気に入り状態を切り替え
  const toggleFavorite = async () => {
    if (video) {
      try {
        const newFavoriteStatus = !video.favorite;
        const videoRef = doc(db, 'videos', id);
        await updateDoc(videoRef, {
          favorite: newFavoriteStatus,
          updatedAt: new Date()
        });
        
        // 状態も更新
        setVideo(prev => ({ ...prev, favorite: newFavoriteStatus }));
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">動画を読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/" className="btn">ホームに戻る</Link>
      </div>
    );
  }

  if (!video) {
    return <div className="not-found">動画が見つかりませんでした</div>;
  }

  // YouTube Player のオプション
  const opts = {
    height: '450',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
    },
  };

  return (
    <div className="watch-page">
      <div className="video-container">
        <YouTube
          videoId={video.youtubeId}
          opts={opts}
          onReady={onReady}
          onEnd={() => updateWatchStatus('視聴済み')}
          onStateChange={(e) => {
            if (e.data === 0) { // 動画終了
              updateWatchStatus('視聴済み');
            }
          }}
        />
      </div>
      
      <div className="video-info">
        <div className="video-header">
          <h1 className="video-title">{video.title}</h1>
          <div className="video-actions">
            <button 
              className={`btn-icon ${video.favorite ? 'favorite-active' : ''}`}
              onClick={toggleFavorite}
            >
              {video.favorite ? '★' : '☆'} お気に入り
            </button>
            <div className="watch-status">
              視聴状態: <span className={`status-${video.watchStatus}`}>{video.watchStatus}</span>
            </div>
          </div>
        </div>
        
        <div className="video-meta">
          <p>チャンネル: {video.channelName}</p>
          <p>カテゴリ: {video.category}</p>
        </div>
        
        <div className="video-notes">
          <h3>メモ</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="この動画に関するメモを入力..."
            rows="5"
          ></textarea>
          <button className="btn" onClick={saveNotes}>メモを保存</button>
        </div>
      </div>
    </div>
  );
}

export default WatchVideoPage;