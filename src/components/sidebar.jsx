import React, { Component } from 'react';
import styles from '../css/sidebar.module.css';

class Sidebar extends Component {
    render() {
        return (
            <ul className={styles.sidebar}>
                <li><i className="fas fa-home"></i>홈</li>
                <li><i className="fas fa-fire"></i>인기</li>
                <li><i className="fab fa-youtube-square"></i>구독</li>
                <li><i className="fas fa-box-open"></i>보관함</li>
            </ul>
        );
    }
}

export default Sidebar;