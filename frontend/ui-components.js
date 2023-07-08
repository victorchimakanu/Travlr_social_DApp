import React from 'react';

export function SignInPrompt({greeting, onClick}) {
  return (
    <main>
      <h1>
        Travlr Gaming Dapp
      </h1>
      <p>
        Welcome to the Travlr Gaming Social Dapp running on ("testnet"). It works
        just like the main network ("mainnet"), but using NEAR Tokens that are
        only for testing!
      </p>
      <br/>
      <p style={{ textAlign: 'center' }}>
        <button onClick={onClick}>Sign in with NEAR Wallet</button>
      </p>
    </main>
  );
}

export function SignOutButton({accountId, onClick}) {
  return (
    <button style={{ float: 'right' }} onClick={onClick}>
      Sign out {accountId}
    </button>
  );
}

export function AddPost({contract , setAllPosts}){
  const [uiPleaseWait, setUiPleaseWait] = React.useState(true); 

  function handlePostSubmission(e){
    e.preventDefault();
    setUiPleaseWait(true);

    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var tags = document.getElementById("tags").value;
    var media = document.getElementById("media").value;
    contract.add_post(title, description, tags, media)      // directly calling function from smart contract (make sure its available for use in App.js)
    .then (async() => { return contract.get_all_posts(); })
    .then(setAllPosts)
    .finally(() => {
      setUiPleaseWait(false);
    });

  }
  return (
    <>
    <h2> Add Post </h2>
    <form onSubmit = {handlePostSubmission}>
      <label>Title</label> 
      <input placeholder="title" id="title"/> <br />
      <br />
      <label>Description</label> 
      <input placeholder="description" id="description"/><br />
      <br />
      <label>Tags</label>
      <input placeholder="tag1,tag2,tag3" id="tags"/><br />
      <br />
      <label>Media</label>
      <input placeholder="media" id="media" />
      <br/> <br />
      <button>Upload post</button>
    </form>
    </>
  )

}

// how we call contract function
export function Post ({ post, setAllPosts, setUiPleaseWait, contract }) {

  function like_a_post(e, index){
    e.preventDefault(); 
    setUiPleaseWait(true); 

    contract.like_a_post(index)   //index is the post Id 
      .then(async () => {return contract.get_all_posts(); })
      .then(setAllPosts)      // to see updates
      .finally(() => {
        setUiPleaseWait(false);   
      })
  }
  return(
    <>
    <h3>{post.title}                              </h3>    
    <p>{post.description}                         </p>
    <img src = {post.media} width = "500"/>
    <>Posted by {post.owner_id}</>
    <p>Likes: {post.users_who_liked.length}       </p>
    <button onClick={event => like_a_post(event, post.id)}>
      Like this post ❤️
    </button>
    {post.tags.map(( tag, tagIndex) => {
      return (
        <i key= {tagIndex}> #{tag}</i>
      )
    })
    
    
    }
    <br />
    </>
  )
}

export function PostsByTag({setUiPleaseWait,contract, setAllPosts}){

  const [postsByTag, setPostsByTag] = React.useState([]);



  function get_posts_by_tag(e){
    e.preventDefault();
    setUiPleaseWait(true);

    var tag = document.getElementById("tag").value;

    contract.get_posts_by_tag(tag)
    .then(setPostsByTag)
    .finally(() => {
      setUiPleaseWait(false);
    });
  }

  return(
    <>
    
    <h2>Get posts by tag</h2>
    <form onSubmit={get_posts_by_tag}>
      <label>Tag</label>
      <input placeholder="tag" id="tag" />
      <button>Get post</button>
      <AllPosts allPosts={postsByTag} setUiPleaseWait = {setUiPleaseWait}
      setAllPosts ={setAllPosts} contract={contract}/>
    </form>
    
    </>
  )

}

//using javascript to loop over allPosts, if it has a value we call allPosts.map to get its value and index
export function AllPosts({ allPosts, setAllPosts, setUiPleaseWait,contract  }){
  return (
    <>
                
    { allPosts ? allPosts.map((post, index) => {
      if (post[1]){
        post = post[1]

      }
      return(
        <div key = {index}>
           <Post post={post} setAllPosts={setAllPosts} 
           setUiPleaseWait={setUiPleaseWait} contract={contract} />
       
        </div>
      
      )
    })
    : "No Posts"
  } 
  <br></br><br/>
    </>
  );
}