import React, { Component } from 'react';
import './app.css';
import Header from './components/header';
import Videos from './components/videos';
import Sidebar from './components/sidebar'
import View from './components/view';

class App extends Component {
  state={
    videos:[

    ],
    video_info:{},
    View:<></>,
    toggle:false,
    auth:null,
  }

  APIKEY=process.env.REACT_APP_API_KEY;
  API_CLIENT_ID=process.env.REACT_APP_CLIENT_ID;

  LoadVideoItems=()=>{
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=2&regionCode=kr&key=${this.APIKEY}`, requestOptions)
      .then(response => response.json())
      .then((result) => {
        const promises=[];
        result.items.map((item)=>{
          promises.push(this.LoadChannelItems(item.snippet.channelId,item)); //수행할 비동기 함수들을 삽입
        });
    
        Promise.all(promises).then((values)=> this.setState({videos:values})); //병렬적으로 비동기 함수 실행
      })
      .catch(error => console.log('error', error));
  };

  LoadChannelItems=async (channelId,item)=>{
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
     await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${this.APIKEY}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        item.snippet.channels=result.items[0].snippet.thumbnails.medium.url;
        item.snippet.channel_description=result.items[0].snippet.description;
      })
      .catch(error => console.log('error', error));
    
      return new Promise((resolve,reject)=>{
        resolve(item);
      })
  }

  SearchVideoItem=(text)=>{
    
    if(this.dftRef.current.style.display==="none"){
      this.handleMainView();
    }
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${text}&type=video&regionCode=kr&key=${this.APIKEY}`, requestOptions)
      .then(response => response.json())
      .then((result) => {
        const promises=[];
        result.items.map((item)=>{
          promises.push(this.LoadChannelItems(item.snippet.channelId,item));
        });

        Promise.all(promises).then((values)=>{
          const videos=[...values];
          this.setState({videos});
        });
      })
      .catch(error => console.log('error', error));
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
      localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
    }
    if(localStorage.getItem('oauth2-test-params')!==null){
      token= JSON.parse(localStorage.getItem('oauth2-test-params'))['access_token'];
      this.setState({auth:token});
    }
  }

  handleAuth=()=>{
    if(this.state.auth===null){
      this.oauthSignIn();
    }
    else{
      this.oauthSignOut();
      //this.rest();
    }
  }
  // rest=()=>{
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow'
  //   };
    
  //   fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=10&access_token=${this.state.auth}`, requestOptions)
  //     .then(response => response.text())
  //     .then(result => console.log(result))
  //     .catch(error => console.log('error', error));
  // }

  oauthSignIn=()=> {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    const scope="https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner"

    const params = {'client_id': this.API_CLIENT_ID,
                  'redirect_uri': 'http://localhost:3000/',
                  'response_type': 'token',
                  'scope': scope,
                  'include_granted_scopes': 'true',
                  'state': 'pass-through value'};
  
    for (let p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    document.body.appendChild(form);
    form.submit();
  }

  oauthSignOut=()=>{
    const revokeTokenEndpoint = 'https://oauth2.googleapis.com/revoke';

    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', revokeTokenEndpoint);

    const tokenField = document.createElement('input');
    tokenField.setAttribute('type', 'hidden');
    tokenField.setAttribute('name', 'token');
    tokenField.setAttribute('value', this.state.auth);
    form.appendChild(tokenField);

    document.body.appendChild(form);
    form.submit();
    // event.preventDefault();
    localStorage.removeItem("oauth2-test-params");
    this.setState({auth:null});
    window.location.assign("http://localhost:3000/");
  }

  dftRef=React.createRef();
  viewRef=React.createRef();

  handleVideoView=async (video)=>{
    this.dftRef.current.style.display="none";
    this.viewRef.current.style.display="flex";

    const video_info={...video};
    await this.setState({video_info});

    this.setState({View:<View videos={this.state.videos} video_info={this.state.video_info} onView={this.handleOtherVideoView}></View>});

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
    this.setState({View:<View videos={this.state.videos} video_info={this.state.video_info} onView={this.handleOtherVideoView}></View>});
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
    this.SearchVideoItem(text);                           
  }

  handleToggle=()=>{
    const flag=(this.state.toggle?false:true);
    this.setState({toggle:flag});
  }

  componentDidMount(){
    this.LoadVideoItems();
    this.parseQueryString();
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
        <Sidebar onCategory={this.handleSearch} toggle={this.state.toggle}></Sidebar>
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

