import React, { Component } from 'react';
import './app.css';
import Header from './components/header';
import Videos from './components/videos';
import Sidebar from './components/sidebar'
import View from './components/view';

class App extends Component {
  state={
    videos:[],
    subscribe:[],
    video_info:{},
    View:<></>,
    toggle:false,
    auth:null,
  }

  LoadSubscribe=async ()=>{
    if(this.state.auth===null){
      return;
    }
    const items=await this.props.youtube.LoadSubscribe(this.state.auth);
    const subscribe=[...items];
    this.setState({subscribe});
    return;
  }

  handleSucribeClick=(item)=>{
    if(this.dftRef.current.style.display==="none"){
      this.handleMainView();
    }

    this.props.youtube.handleSucribeClick(item)
    .then((values)=>{
      const videos=[...values];
      this.setState({videos});
    });
  }

  handleLikeVideo=()=>{
    if(this.state.auth==null){
      this.props.oauth.oauthSignIn();
      return;
    }
    if(this.dftRef.current.style.display==="none"){
      this.handleMainView();
    }

    this.props.youtube.handleLikeVideo(this.state.auth)
    .then((values)=>{
      const videos=[...values];
      this.setState({videos});
    });
  }
  
  handleSubscribe=async (issubscribe,channelId)=>{ 
    if(this.state.auth===null){
      this.props.oauth.oauthSignIn();
    }
    if(issubscribe===null){
      //post
      const status=await this.props.youtube.subscribeInsert(channelId,this.state.auth);
      if(status<400){
        await this.LoadSubscribe();
        this.setState({View:<View 
          videos={this.state.videos} 
          video_info={this.state.video_info}
          subscribe={this.state.subscribe} 
          onView={this.handleOtherVideoView}
          onSubscribe={this.handleSubscribe}></View>});
      }
    }
    else{
      //delete
      const status=await this.props.youtube.subscribeDelete(issubscribe,this.state.auth);
      if(status<400){
        await this.LoadSubscribe();
        this.setState({View:<View 
          videos={this.state.videos} 
          video_info={this.state.video_info}
          subscribe={this.state.subscribe} 
          onView={this.handleOtherVideoView}
          onSubscribe={this.handleSubscribe}></View>});
      }
    }
  }

  parseQueryString=()=>{
    const fragmentString = window.location.hash.substring(1);
    const params = {};
    let token;
    let regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
      localStorage.setItem('oauth2-params', JSON.stringify(params) );
    }
    if(localStorage.getItem('oauth2-params')!==null){
      token= JSON.parse(localStorage.getItem('oauth2-params'))['access_token'];
      this.setState({auth:token});
    }
  }

  handleAuth=()=>{
    if(this.state.auth===null){
      this.props.oauth.oauthSignIn();
    }
    else{
      this.props.oauth.oauthSignOut(this.state.auth);
      localStorage.removeItem("oauth2-params");
      this.setState({auth:null});
      window.location.assign("https://deokwonpark.github.io/YouTube_Colne/");
    }
  }

  dftRef=React.createRef();
  viewRef=React.createRef();

  handleVideoView=async (video)=>{
    this.dftRef.current.style.display="none";
    this.viewRef.current.style.display="flex";

    const video_info={...video};
    await this.setState({video_info});

    this.setState({View:<View 
      videos={this.state.videos} 
      video_info={this.state.video_info}
      subscribe={this.state.subscribe} 
      onView={this.handleOtherVideoView}
      onSubscribe={this.handleSubscribe}></View>});

    let player;

    let id;
    if(video.id instanceof Object){
        id=video.id.videoId;
    }
    else{
        id=video.id;
    }

    if(window.YT!=null){
      player = new window.YT.Player('ytplayer', {
        height: '100%',
        width: '100%',
        videoId: `${id}`,
        playerVars:{
          autoplay:1,
        }
      });
    }
    else{
      const script=document.createElement('script');
      script.src="https://www.youtube.com/player_api";
      script.classList.add("YouTube_api");

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

      window.onYouTubePlayerAPIReady=()=>{
        player = new window.YT.Player('ytplayer', {
          height: '100%',
          width: '100%',
          videoId: `${id}`,
          playerVars:{
            autoplay:1,
          }
        });
      }
    }
  }

  handleOtherVideoView=async (video)=>{

    const video_info={...video};
    await this.setState({video_info});

    this.setState({View:<></>});
    this.setState({View:<View 
      videos={this.state.videos} 
      video_info={this.state.video_info}
      subscribe={this.state.subscribe} 
      onView={this.handleOtherVideoView}
      onSubscribe={this.handleSubscribe}></View>});
    let player;

    let id;
    if(video.id instanceof Object){
        id=video.id.videoId;
    }
    else{
        id=video.id;
    }

    
    player = new window.YT.Player('ytplayer', {
      height: '100%',
      width: '100%',
      videoId: `${id}`,
      playerVars:{
        autoplay:1,
      }
    });
    
  }
          
  handleMainView=()=>{
    this.dftRef.current.style.display="flex";    
    this.viewRef.current.style.display="none";     
    this.setState({View:<></>});
  }                                

  handleSearch=(text)=>{
    if(this.dftRef.current.style.display==="none"){
      this.handleMainView();
    }
    this.props.youtube.SearchVideoItem(text)
    .then((values)=>{
      const videos=[...values];
      this.setState({videos});
    });                           
  }

  handleToggle=()=>{
    const flag=(this.state.toggle?false:true);
    this.setState({toggle:flag});
  }

  async componentDidMount(){
    this.props.youtube.LoadVideoItems()
    .then((values)=>this.setState({videos:values}));

    await this.parseQueryString();
    this.LoadSubscribe();
  }
                
  render() {                      
    return <div className="inner">                   
      <Header                                                   
      onMainView={this.handleMainView}
      onSearch={this.handleSearch} 
      onToggle={this.handleToggle}
      onAuth={this.handleAuth}
      auth={this.state.auth}                                                                                                  
      ></Header>                                         
      <section className="main" ref={this.dftRef}>
        <Sidebar 
        onCategory={this.handleSearch} 
        toggle={this.state.toggle} 
        auth={this.state.auth}
        onAuth={this.props.oauth.oauthSignIn}
        subscribe={this.state.subscribe}
        onSubscribe={this.handleSucribeClick}
        onLike={this.handleLikeVideo}
        ></Sidebar>
        <Videos videos={this.state.videos}      
                onView={this.handleVideoView}>
        </Videos>
      </section>
      <section className="videoView" ref={this.viewRef}>
        {this.state.View}
      </section>
    </div>
  }
}

export default App;

