import React, { Component } from 'react';
import Video from './video';
import classNames from 'classnames';
import styles from '../css/videos.module.css';

class Videos extends Component {
    render() {
        return <section>
            <ul className={styles.videos}>
                {this.props.videos.map((item)=><Video
                            info={item}
                            key={item.id}
                            onView={this.props.onView}
                            view={false}
                            >
                            </Video>
                )}
            </ul>
        </section>
    }
}

export default Videos;