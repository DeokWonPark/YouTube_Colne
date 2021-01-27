import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from '../css/header.module.css';

class Header extends PureComponent {
    inputRef=React.createRef();
    logoutRef=React.createRef();
    handleMainView=()=>{this.props.onMainView()}
    handleSearch=(event)=>{
        event.preventDefault();
        this.props.onSearch(this.inputRef.current.value)
    }
    handleToggle=()=>{this.props.onToggle()}
    handleAuth=()=>{
        if(this.props.auth===null){
            this.props.onAuth();
            return;
        }
        else{
            this.logoutRef.current.style.display="block";
        }
    }
    handleSignOut=()=>{
        this.props.onAuth();
        this.logoutRef.current.style.display="none";
    }
    handleLeave=()=>{
        this.logoutRef.current.style.display="none";
    }
    handleEnter=()=>{
        if(this.props.auth!==null){
            this.logoutRef.current.style.display="block";
        }
    }
    render() {
        return <>
            <header onMouseLeave={this.handleLeave}>
                <div className={styles.logo}>
                    <button className={classNames(styles.Btn, styles.toggleBtn)} onClick={this.handleToggle}><i className="fas fa-bars"></i></button>
                    <button className={classNames(styles.Btn, styles.logoBtn)} onClick={this.handleMainView}><img src="../../images/logo.png" alt="logo"/></button>
                    <span className={styles.logo_name} onClick={this.handleMainView}>Youtube</span>
                </div>

                <form className={styles.search} onSubmit={this.handleSearch}>
                    <input ref={this.inputRef} type="text" placeholder="Search.." id={styles.search_input}/>
                    <button className={classNames(styles.Btn, styles.searchBtn)}><img src="../../images/search.png" alt="search"/></button>
                </form>
                <button className={classNames(styles.Btn, styles.userBtn,(this.props.auth===null?"":styles.auth))} 
                onClick={this.handleAuth}
                onMouseEnter={this.handleEnter}
                >
                <i className="fas fa-user"></i>
                </button>
                <button className={styles.logoutBtn} ref={this.logoutRef} onMouseEnter={this.handleEnter} onClick={this.handleSignOut}>LogOut</button>
            </header>
        </>
    }
}

export default Header;