import React, { Component } from 'react';
import styles from '../css/video.module.css';

class Video extends Component {
    handleVideoView=()=>{this.props.onView(this.props.info)}

    render() {
        const info=this.props.info.snippet;
        const img_url=info.thumbnails.medium.url;
        const title=info.title;
        const channelTitle=info.channelTitle;
        const channelUrl=info.channels;

        return <li className={styles.video} onClick={this.handleVideoView}>
            <img src={img_url} alt="thumbnail"/>
            <div className={styles.video_data}>
                <button className={styles.channelBtn}><img src={channelUrl} alt="channel"/></button>
                <span>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.channelTitle}>{channelTitle}</p>
                </span>
            </div>
        </li>
    }
}

export default Video;