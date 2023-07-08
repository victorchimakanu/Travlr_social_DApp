import { NearBindgen, near, call, view, UnorderedMap, Vector } from 'near-sdk-js';

class Post{
  id: string;
  title: string;
  description: string;
  tags: Vector;
  media: string; 
  users_who_liked: string[];
  owner_id: string;
  

  constructor(id: string, title: string, description: string, tags: Vector, media: string)
  {
    this.id= id;
    this.title= title;
    this.description= description;
    this.tags= tags;
    this.media= media;
    this.users_who_liked= [];
    this.owner_id = near.predecessorAccountId(); // refers to whoeevr called the function that triggered this constructor

  }

}

@NearBindgen({})
class TravlrGaming {

  posts: UnorderedMap;
  number_of_posts: number;
  likes_by_user_id: UnorderedMap; // shows all the posts user has liked
  posts_by_tag: UnorderedMap;     // shows all the posts by a gamer tag 

  constructor(){                  //called when you deploy the first time 
    this.posts = new UnorderedMap("p");
    this.number_of_posts = 0; 
    this.likes_by_user_id = new UnorderedMap("l");
    this.posts_by_tag = new UnorderedMap ("t");
  }

  add_posts_by_tag(post: Post, tags: string[]) {
    for (var i = 0; i < tags.length; i++){
      var tag = tags[i];
      var posts_for_tag;                    // for each tag we get or set its list of posts
    if (this.posts_by_tag.get(tag) == null) {
        posts_for_tag = [];      //if there isn't any post for the tag , return an empty list 
    }            
    else {
      posts_for_tag = this.posts_by_tag.get(tag);  //if there is a post for the tag, get the post
    }
    posts_for_tag.push(post); 
    this.posts_by_tag.set(tag, posts_for_tag);
    }

  }


  @call({})  // TO CHANGE STATE 
  add_post ({title, description, tags, media}) : Post {
    var id = this.number_of_posts.toString();   // sets id
    tags = tags.split(",");
    var post = new Post (id, title, description, tags, media);  // creates new post object with these properties to define the post
    this.posts.set(id, post); // sets post in our collection
    this.number_of_posts++;   // increase number of posts 
    
    this.add_posts_by_tag(post, tags);

    return post;
  }
  @view({}) //function is of type view because it doesnt chnag eany of the data in the contract (read only)
  get_all_posts({}){
    return this.posts.toArray();
  }

  add_post_to_my_liked(sender_id, post){
    var likes;

    if (this.likes_by_user_id.get(sender_id) != null) {
      likes = this.likes_by_user_id.get(sender_id);
    }
    else {
      likes = [];
    }
    likes.push(post);
    this.likes_by_user_id.set(sender_id, likes); 
  }

  @call({})
  like_a_post({ postId }): Post{

    postId = postId.toString(); //makes sure the post id is a string 
    if (this.posts.get(postId) == null){
      return null;
    }

    var post = this.posts.get(postId) as Post; // gets the post we are going to like 
    var sender_id = near.predecessorAccountId(); //whoever called the function is sender id
    post.users_who_liked.push(sender_id)    //gets added to who liked the post
    this.posts.set(postId, post); // updates post in our collection 

    this.add_post_to_my_liked(sender_id, post);
    return post;

  }

  @call({})
  get_my_liked_posts({}) : Post[] {
    var my_liked_posts;
    var sender_id = near.predecessorAccountId();
    if (this.likes_by_user_id.get(sender_id) != null) {
      my_liked_posts = this.likes_by_user_id.get(sender_id);
    }
    else {
      return [];
    }
    return my_liked_posts;
  }

  @view({})   //because the function will not change any data and doesnt require a signer 
  get_posts_by_tag ({tag}) {
    if (this.posts_by_tag.get(tag) ==null) {
      return [];
    }
    return this.posts_by_tag.get(tag);

  }

}


