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
    handleToggle=()=>{this.props.onToggle()}
    handleAuth=()=>{this.props.onAuth()}
    render() {
        return (
            <header>
                <div className={styles.logo}>
                    <button className={classNames(styles.Btn, styles.toggleBtn)} onClick={this.handleToggle}><i className="fas fa-bars"></i></button>
                    <button className={classNames(styles.Btn, styles.logoBtn)} onClick={this.handleMainView}><img src="../../images/logo.png" alt="logo"/></button>
                    <span className={styles.logo_name} onClick={this.handleMainView}>Youtube</span>
                </div>

                <form className={styles.search} onSubmit={this.handleSearch}>
                    <input ref={this.inputRef} type="text" placeholder="Search.." id={styles.search_input}/>
                    <button className={classNames(styles.Btn, styles.searchBtn)}><img src="../../images/search.png" alt="search"/></button>
                </form>
                <button className={classNames(styles.Btn, styles.userBtn,(this.props.auth===null?"":styles.auth))} onClick={this.handleAuth}><i className="fas fa-user"></i></button>
            </header>
        );
    }
}

export default Header;