import React, { Component } from 'react';
import Video from './video';
import styles from '../css/sideVideo.module.css';

class SideVideo extends Component {
    render() {
        return <div className={styles.Side}>
        <button className={styles.video_refresh}>추천 영상 새로고침</button>
        <ul className={styles.side_videos}>
            {this.props.videos.map((item)=><Video
                        info={item}
                        key={item.id}
                        onView={this.props.onView}
                        view={true}
                        >
                        </Video>
            )}
        </ul>
        </div>
    }
}

export default SideVideo;