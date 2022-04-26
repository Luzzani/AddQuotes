import { useRef, useEffect, useState } from "react";

import classes from "./NewCommentForm.module.css";
import useHttp from "../../hooks/use-http";
import { addComment } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";



const NewCommentForm = (props) => {

  const [input, setInput] = useState('');
  const commentTextRef = useRef();
  
  const { sendRequest, status, error } = useHttp(addComment);
  
  const { onAddedComment } = props;
  
  useEffect(() => {
    if (status === "completed" && !error) {
      onAddedComment();
    }
  }, [status, error, onAddedComment]);

  const onChangeCommentHanlder =(event)=>{
    setInput(event.target.value);
  }
  
  const submitFormHandler = (event) => {
    event.preventDefault();
    const enteredText = commentTextRef.current.value;
    const commentIsValid = enteredText.trim().length > 0; 
    
    if (!commentIsValid) {
      commentTextRef.current.focus();
    }else{
      sendRequest({ commentData: { text: enteredText }, quoteId: props.quoteId });
    }
    setInput('');
  };

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      {status === "pending" && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.control} onSubmit={submitFormHandler}>
        <label htmlFor="comment">Your Comment</label>
        <textarea value={input} id="comment" rows="5" ref={commentTextRef} onChange={onChangeCommentHanlder}></textarea>
      </div>
      <div className={classes.actions}>
        <button className="btn">Add Comment</button>
      </div>
    </form>
  );
};

export default NewCommentForm;
