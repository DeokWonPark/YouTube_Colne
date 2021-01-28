import React, { Component } from 'react';
import Video from './video';
import styles from '../css/videos.module.css';

class Videos extends Component {
    render() {
        let id;
        if(this.props.videos)
        return <section>
            <ul className={styles.videos}>
                {this.props.videos.map((item)=>{
                    let id;
                    if(item.id instanceof Object){
                        id=item.id.videoId;
                    }
                    else{
                        id=item.id;
                    }

                    return <Video
                    info={item}
                    key={id}
                    onView={this.props.onView}
                    view={false}
                    >
                    </Video>
                }
                )}
            </ul>
        </section>
    }
}

export default Videos;