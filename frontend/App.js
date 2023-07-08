import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';

import { AddPost, AllPosts, PostsByTag, SignInPrompt, SignOutButton } from './ui-components';


export default function App({ isSignedIn, contract, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();
  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);
  const [allPosts, setAllPosts] = React.useState([]);

  React.useEffect(() => {
    contract.get_all_posts() //calling function from near interface 
      .then(setAllPosts)    // set all the posts 
      .catch(alert)         // check if theres issues
      .finally(() => {
        setUiPleaseWait(false);
      });

    }, []);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
  }


  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1> Welcome to Travlr </h1>
        <PostsByTag setUiPleaseWait ={setUiPleaseWait} contract={contract} setAllPosts={setAllPosts} postsByTag/>

        <h2>All Posts</h2>  
        <AllPosts allPosts={allPosts} setAllPosts={setAllPosts} setUiPleaseWait={setUiPleaseWait} contract={contract}/>
        <AddPost contract ={contract} setAllPosts={setAllPosts}/>
        <br></br>
      </main>
    </>
  );
}
