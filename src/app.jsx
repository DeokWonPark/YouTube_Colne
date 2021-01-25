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
  }

  APIKEY=process.env.REACT_APP_API_KEY;
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

  componentDidMount(){
    this.LoadVideoItems();
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
                
  render() {                      
    return <div className="inner">                   
      <Header                                                   
      onMainView={this.handleMainView}
      onSearch={this.handleSearch}                                                                                                   
      ></Header>                                         
      <section className="main" ref={this.dftRef}>
        <Sidebar onCategory={this.handleSearch}></Sidebar>
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

