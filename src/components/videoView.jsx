import React, { Component } from 'react';
import styles from '../css/videoView.module.css';

class VideoView extends Component {
    
    render() {
        return <div id="ytplayer" className={styles.video_view}></div>
    }
}

export default VideoView;