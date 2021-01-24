import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from '../css/header.module.css';

class Header extends PureComponent {
    inputRef=React.createRef();
    handleMainView=()=>{this.props.onMainView()}
    handleSearch=(event)=>{
        event.preventDefault();
        this.props.onSearch(this.inputRef.current.value)
    }
    render() {
        return (
            <header>
                <div className={styles.logo} onClick={this.handleMainView}>
                    <button className={classNames(styles.Btn, styles.logoBtn)}><img src="../../images/logo.png" alt="logo"/></button>
                    <span className={styles.logo_name}>Youtube</span>
                </div>
                <form className={styles.search} onSubmit={this.handleSearch}>
                    <input ref={this.inputRef} type="text" placeholder="Search.." id={styles.search_input}/>
                    <button className={classNames(styles.Btn, styles.searchBtn)}><img src="../../images/search.png" alt="search"/></button>
                </form>
                <button className={classNames(styles.Btn, styles.userBtn)}><i className="fas fa-user"></i></button>
            </header>
        );
    }
}

export default Header;