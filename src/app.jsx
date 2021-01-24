import React, { Component } from 'react';
import './app.css';
import Header from './components/header';
import Videos from './components/videos';
import Sidebar from './components/sidebar'
import VideoView from './components/videoView';
import VideoInfo from './components/videoInfo';
import SideVideo from './components/sideVideo';

class App extends Component {
  state={
    videos:[

    ],
    video_info:{},
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

  componentDidMount(){
    this.LoadVideoItems();
  }


  dftRef=React.createRef();
  viewRef=React.createRef();

  handleVideoView=(video)=>{
    this.dftRef.current.style.display="none";
    this.viewRef.current.style.display="flex";

    const video_info={...video};
    this.setState({video_info});

    const script=document.createElement('script');
    script.src="https://www.youtube.com/player_api";

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

    let player;
      window.onYouTubePlayerAPIReady=()=>{
          console.log(window.YT);
          player = new window.YT.Player('ytplayer', {
            height: '100%',
            width: '100%',
            videoId: `${video.id}`,
            playerVars:{
              autoplay:1,
            }
          });
      }
  }

  handleMainView=()=>{
    // this.dftRef.current.style.display="flex";
    // this.viewRef.current.style.display="none";
  }

  render() {
    return <div className="inner">
      <Header onMainView={this.handleMainView}></Header>
      <section className="main" ref={this.dftRef}>
        <Sidebar></Sidebar>
        <Videos videos={this.state.videos} 
                onView={this.handleVideoView}>
        </Videos>
      </section>
      <section className="videoView" ref={this.viewRef}>
        <article className="VideoInfo">
          <VideoView></VideoView>
          <VideoInfo info={this.state.video_info}></VideoInfo>
        </article>
        <article className="SideVideo">
          <SideVideo
          videos={this.state.videos}
          ></SideVideo>
        </article>
      </section>
    </div>
  }
}

export default App;

