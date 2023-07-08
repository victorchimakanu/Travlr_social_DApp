import { get } from "http";

 export class Contract{
  wallet;

  constructor({wallet}){
    this.wallet = wallet;

    }

    async get_all_posts(){
      return await this.wallet.viewMethod({method: "get_all_posts"}); // we are using our wallet to call a method 
    }

    // connecting Dapp to function add_post
    async add_post (title, description, tags, media){
      return await this.wallet.callMethod({method: "add_post",       
    args: {
      title, description, tags, media               //passing in arguments into function
    }  
    });
    }

    async like_a_post(postId){
      return await this.wallet.callMethod({method: "like_a_post", 
      args: {
        postId
      }
    });
    }

    async get_posts_by_tag(tag){
      return await this.wallet.viewMethod({method: "get_posts_by_tag",
      args: {
        tag 
      } });
    }
  }
