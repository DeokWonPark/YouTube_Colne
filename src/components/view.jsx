import React, { Component } from 'react';
import VideoView from './videoView';
import VideoInfo from './videoInfo';
import SideVideo from './sideVideo';

class View extends Component {
    render() {
        return <>
        <article className="VideoInfo">
            <VideoView></VideoView>
            <VideoInfo info={this.props.video_info}></VideoInfo>
        </article>
        <article className="SideVideo">
            <SideVideo
            videos={this.props.videos}
            onView={this.props.onView}
            ></SideVideo>
        </article>
      </>
    }
}

export default View;