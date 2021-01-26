import React, { Component } from 'react';
import styles from '../css/sidebar.module.css';
import classNames from 'classnames';

class Sidebar extends Component {
    handleHome=()=>{
        window.location.reload()
    }
    handleCategory=(item)=>{
        this.props.onCategory(item);
    }

    render() {
        return (
            <ul className={classNames(styles.sidebar,(this.props.toggle?styles.toggleon:""))}>
                <li onClick={this.handleHome}><i className="fas fa-home"></i>홈</li>
                <li><i className="fas fa-fire"></i>인기</li>
                <li><i className="fab fa-youtube-square"></i>구독</li>
                <li><i className="fas fa-box-open"></i>보관함</li>
                <li className={styles.categoryTitle}>카테고리</li>
                <li className={styles.category} onClick={this.handleCategory.bind(this,"롤")}><img src="../../images/LOL.png" alt="LOL"></img>LOL</li>
                <li className={styles.category} onClick={this.handleCategory.bind(this,"kpop")}><img src="../../images/music.png" alt="K-POP"></img>K-POP</li>
                <li className={styles.category} onClick={this.handleCategory.bind(this,"영화")}><img src="../../images/movie.png" alt="Movie"></img>Movie</li>
            </ul>
        );
    }
}

export default Sidebar;