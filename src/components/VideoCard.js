import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <Link to={`/watch/${video.id}`} className="video-card-link">
        <div className="thumbnail-container">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="video-thumbnail" 
          />
          {video.favorite && <span className="favorite-badge">★</span>}
          <span className={`status-badge status-${video.watchStatus}`}>
            {video.watchStatus}
          </span>
        </div>
        <div className="video-info">
          <h3 className="video-title">{video.title}</h3>
          <p className="channel-name">{video.channelName}</p>
          <p className="video-category">{video.category}</p>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;