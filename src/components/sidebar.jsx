import React, { PureComponent } from 'react';
import styles from '../css/sidebar.module.css';
import classNames from 'classnames';
import Subscribebar from './subscribebar';

class Sidebar extends PureComponent {
    state={
        toggle:false,
    }

    handleHome=()=>{
        window.location.reload()
    }
    handleCategory=(item)=>{
        this.props.onCategory(item);
    }
    handleSucribe=()=>{
        if(this.props.auth==null){
            this.props.onAuth();
            return;
        }
        const state= this.state.toggle?false:true;
        if(state===true){
            this.subref.current.style.color="#ff1c1c";
        }
        else{
            if(this.subref.current!=null){
                this.subref.current.style.color="white";
            }
        }
        this.setState({toggle:state});
    }
    handleLikeVideo=()=>{
        this.props.onLike();
    }

    subref=React.createRef();
    clintX=null;
    componentDidMount(){
        if(this.subref.current!=null){
            this.clintX=this.subref.current.getBoundingClientRect().top;
        }
    }
    render() {
        return <div className={classNames(styles.sidebar,(this.props.toggle?styles.toggleon:""))}>
            <ul>
                <li onClick={this.handleHome}><i className="fas fa-home"></i>홈</li>
                <li onClick={this.handleLikeVideo}><i className="fas fa-fire"></i>좋아요</li>
                <li ref={this.subref} onClick={this.handleSucribe}><i className="fab fa-youtube-square"></i>구독</li>
                <li><i className="fas fa-box-open"></i>보관함</li>
                <li className={styles.categoryTitle}>카테고리</li>
                <li className={styles.category} onClick={this.handleCategory.bind(this,"롤")}><img src="https://raw.githubusercontent.com/DeokWonPark/YouTube_Colne/master/public/images/LOL.png" alt="LOL"></img>LOL</li>
                <li className={styles.category} onClick={this.handleCategory.bind(this,"kpop")}><img src="https://raw.githubusercontent.com/DeokWonPark/YouTube_Colne/master/public/images/music.png" alt="K-POP"></img>K-POP</li>
                <li className={styles.category} onClick={this.handleCategory.bind(this,"영화")}><img src="https://raw.githubusercontent.com/DeokWonPark/YouTube_Colne/master/public/images/movie.png" alt="Movie"></img>Movie</li>
            </ul>
            <Subscribebar 
            top={this.clintX} 
            on={this.state.toggle} 
            subscribe={this.props.subscribe} 
            onSubscribe={this.props.onSubscribe}>
            </Subscribebar>
        </div>
    }
}

export default Sidebar;