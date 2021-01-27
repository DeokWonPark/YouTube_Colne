import React, { PureComponent } from 'react';
import styles from '../css/subscribebar.module.css';
import classNames from 'classnames';

class Subscribebar extends PureComponent {
    ulref=React.createRef();
    handleSubscribeClick=(item)=>{
        this.props.onSubscribe(item);
    }
    render() {
        if(this.props.top!=null && this.ulref.current!=null){
            this.ulref.current.setAttribute("style",`top:${this.props.top}px`);
        }
        return <ul className={classNames(styles.subscribebar,this.props.on?styles.view:"")} ref={this.ulref}>
            {this.props.subscribe.map((item)=>{
                return <li className={styles.subscribeItem} onClick={this.handleSubscribeClick.bind(this,item)}><img src={item.snippet.thumbnails.medium.url} alt="구독 이미지"></img><p>{item.snippet.title}</p></li>
            })}
        </ul>
    }
}

export default Subscribebar;