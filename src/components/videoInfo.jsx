import React, { PureComponent } from 'react';
import styles from '../css/videoInfo.module.css';
import classNames from 'classnames';

class VideoInfo extends PureComponent {

    state={
        issubscribe:null,
    }

    tags=[];
    title=null;
    date=null;
    channelLogo=null;
    channelTitle=null;
    description=null;
    SubBtn=React.createRef();

    getProps=()=>{
        this.tags=[];

        if(Object.keys(this.props.info).length===0){
            return;
        }

        for(let i in this.props.info.snippet.tags){
            if(i>=5){
                break;
            }
            this.tags.push(this.props.info.snippet.tags[i]);
        }
        this.title=this.props.info.snippet.title;
        // this.date=this.props.info.snippet.publishedAt;
        this.channelLogo=this.props.info.snippet.channels;
        this.channelTitle=this.props.info.snippet.channelTitle;
        this.description=this.props.info.snippet.channel_description;
    }

    isSubscribe=()=>{
        let flag=false;
        this.props.subscribe.map((item)=>{
            if(item.snippet.resourceId.channelId===this.props.info.snippet.channelId){
                this.setState({issubscribe:item.id});
                flag=true;
            }
        });
        if(!flag){
            this.setState({issubscribe:null});
        }
    }

    handleSubscribe=async ()=>{
        this.SubBtn.current.setAttribute("disabled","disabled");
        await this.props.onSubscribe(this.state.issubscribe,this.props.info.snippet.channelId);
        this.isSubscribe();
        this.SubBtn.current.removeAttribute("disabled");
    }
    componentDidMount(){
        this.isSubscribe();
    }
    render() {

        {
            this.getProps();
        }

        return <>
        <div className={styles.video_info}>
            <span className={styles.hash_tag}>
                {this.tags.map((tag)=><button>#{tag}</button>)}
            </span>
            <h3 className={styles.video_title}>{this.title}</h3>
            {/* <p>{this.date}</p> */}
            <div className={styles.controlBtns}>
                <button><i className="fas fa-thumbs-up"></i></button>
                <button><i className="fas fa-thumbs-down"></i></button>
                <button><i className="fas fa-share-square"></i></button>
                <button><i className="fas fa-folder-plus"></i></button>
            </div>
        </div>
        <hr/>
        <div className={styles.channel_info}>
            <div className={styles.channel_logo}>
                <button className={styles.channel_img}><img src={this.channelLogo} alt="channel_logo"/></button>
                <p>{this.channelTitle}</p>
            </div>
            <button className={classNames(styles.subscribe, this.state.issubscribe?styles.subscribing:"")} onClick={this.handleSubscribe} ref={this.SubBtn}>구독</button>
        </div>
        <span className={styles.description}>
            {this.description}
        </span>
        </>
    }
}

export default VideoInfo;