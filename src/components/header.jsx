import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from '../css/header.module.css';

class Header extends PureComponent {
    handleMainView=()=>{this.props.onMainView()}
    render() {
        return (
            <header>
                <div className={styles.logo} onClick={this.handleMainView}>
                    <button className={classNames(styles.Btn, styles.logoBtn)}><img src="../../images/logo.png" alt="logo"/></button>
                    <span className={styles.logo_name}>Youtube</span>
                </div>
                <div className={styles.search}>
                    <input type="text" placeholder="Search.." id={styles.search_input}/>
                    <button className={classNames(styles.Btn, styles.searchBtn)}><img src="../../images/search.png" alt="search"/></button>
                </div>
                <button className={classNames(styles.Btn, styles.userBtn)}><i className="fas fa-user"></i></button>
            </header>
        );
    }
}

export default Header;