import React, { Component } from 'react';
import './app.css';
import Header from './components/header';
import Videos from './components/videos';
import Sidebar from './components/sidebar'

class App extends Component {
  state={
    videos:[

    ],
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
  handleVideoView=(video)=>{
    this.dftRef.current.style.display="none";
  }

  render() {
    return <div className="inner">
      <Header></Header>
      <section className="main" ref={this.dftRef}>
        <Sidebar></Sidebar>
        <Videos videos={this.state.videos} 
                onView={this.handleVideoView}>
        </Videos>
      </section>
    </div>
  }
}

export default App;

