class Youtube{
    constructor(key){
        this.key=key;
        this.getRequestOption={
            method: 'GET',
            redirect: 'follow'
        }
    }

    async GETResponse(uri){
        try {
            const response = await fetch(uri, this.getRequestOption);
            const result = await response.json();
            const promises = [];
            result.items.map((item) => {
                promises.push(this.LoadChannelItems(item.snippet.channelId, item)); //수행할 비동기 함수들을 삽입
            });

            return Promise.all(promises).then((values) => values); //병렬적으로 비동기 함수 실행
        } catch (error) {
            return console.log('error', error);
        }
    }

    async LoadChannelItems(channelId,item){
        try{
            const response=await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${this.key}`, this.getRequestOption)
            const result=await response.json();
            item.snippet.channels=result.items[0].snippet.thumbnails.medium.url;
            item.snippet.channel_description=result.items[0].snippet.description;
        }catch(error){
            console.log('error', error)
        }
        
        return new Promise((resolve,reject)=>{
            resolve(item);
        });
    }

    async LoadVideoItems(){
        const uri=`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=25&regionCode=kr&key=${this.key}`;
        const values = await this.GETResponse(uri);
        return values;
    }

    async SearchVideoItem(text){
        const uri=`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${text}&type=video&regionCode=kr&key=${this.key}`;
        const values=this.GETResponse(uri);
        return values;
    }

    async handleSucribeClick(item){
        const uri=`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${item.snippet.resourceId.channelId}&maxResults=10&key=${this.key}`;
        const values=await this.GETResponse(uri);
        return values;
    }

    async handleLikeVideo(auth){
        const uri=`https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResult=3&access_token=${auth}`;
        const values=await this.GETResponse(uri)
        return values;
      }

    async LoadSubscribe(auth){
        try{
            const response=await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50&access_token=${auth}`, this.getRequestOption)
            const result=await response.json();
            return result.items;
        }catch(error){
            console.log('error', error)
        }  
    }

    async subscribeInsert(channelId,auth){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${auth}`);
        myHeaders.append("Content-Type", "text/plain");
  
        const value={
          snippet:{
            resourceId:{
              channelId:channelId
            }
          }
        }
  
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(value),
          redirect: 'follow'
        };
  
        let status=null;
  
        try{
            const response=await fetch("https://www.googleapis.com/youtube/v3/subscriptions?part=snippet", requestOptions)
            const result=await response.status;
            status=Number.parseInt(result);
        }catch(error){
            console.log('error', error);
        }
        return status;
    }

    async subscribeDelete(issubscribe,auth){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${auth}`);
    
        const requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
        };
    
        let status=null;
    
        try{
            const response=await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?id=${issubscribe}`, requestOptions)
            const result=await response.status;
            status=Number.parseInt(result);
        }catch(error){
            console.log('error', error);
        }
        return status;
    }
}

export default Youtube