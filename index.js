const primaryCommentBox = document.getElementById("primaryCommentInputBox");
const primaryCommentBoxBtn = document.getElementById("post");
const commentContainer = document.getElementById("commentContainer");

let comments = [];

const localStorageComments = localStorage.getItem("comments");
comments =
  JSON.parse(localStorageComments)?.length > 0
    ? JSON.parse(localStorageComments)
    : comments;

function displayComments(CommentsList, parentElement) {
  
  if(comments.length){
  
  const commentListElement = document.createElement("ul");

  CommentsList.forEach((comment, index) => {
    const commentItem = document.createElement("li");
    const commentSpan = document.createElement("span");
    const replyButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const likes = document.createElement("button");
    const likeCount      = document.createElement("span");
    likes.textContent = "likes";
    likeCount.textContent = comment.likes;
    deleteButton.textContent = "Delete";

    replyButton.textContent = "Reply";
    commentSpan.textContent = comment.comment;
    commentItem.appendChild(commentSpan);
    commentItem.appendChild(replyButton);
    commentItem.appendChild(likes);
    likes.appendChild(likeCount);
    commentItem.appendChild(deleteButton);

    deleteButton.addEventListener("click", (e) => {
      CommentsList.splice(index, 1);
      commentContainer.innerHTML = "";
      saveInLocalStorage();
      displayComments(comments);
    });

    replyButton.addEventListener("click", (e) => {
      replyButton.disabled = true;
      const nestedCommentdiv = document.createElement("div");
      nestedCommentdiv.className = "reply";
      const nestedreply = document.createElement("input");
      const btn = document.createElement("button");
      btn.textContent = "addreply";
      nestedCommentdiv.appendChild(nestedreply);
      nestedCommentdiv.appendChild(btn);

      commentItem.appendChild(nestedCommentdiv);
      nestedreply.focus();

      btn.addEventListener("click", () => {
        if (nestedreply.value.trim() != "") {
          let reply = {
            comment: nestedreply.value,
            replies: [],
            likes : 0
          };
          comment.replies.push(reply);
          commentContainer.innerHTML = "";
          saveInLocalStorage();
          displayComments(comments);
        }
      });
    });

    likes.addEventListener("click", (e) => {
      comment.likes += 1;
      likeCount.textContent = comment.likes;
      saveInLocalStorage()
    })

    if (comment.replies && comment.replies.length > 0) {
      const repliesContainer = document.createElement("div");
      displayComments(comment.replies, repliesContainer);
      commentItem.appendChild(repliesContainer);
    }

    commentListElement.appendChild(commentItem);
  });
  //outside for each loop
  if (parentElement) {
    parentElement.appendChild(commentListElement);
  } else {
    commentContainer.appendChild(commentListElement);
  }
}
// if there is no comment then show no comment found
else{
  const noitem = document.createElement('div');
  noitem.textContent="NO COMMENT FOUND";
  commentContainer.appendChild(noitem);
}
}
displayComments(comments);

function saveInLocalStorage() {
  localStorage.setItem("comments", JSON.stringify(comments));
}

primaryCommentBoxBtn.addEventListener("click", (e) => {
  if (primaryCommentBox.value.trim() != "") {
    let comment = {
      comment: primaryCommentBox.value,
      replies: [],
      likes : 0
    };
    comments.push(comment);
  } else {
    return;
  }
  saveInLocalStorage();
  primaryCommentBox.value = "";
  commentContainer.innerHTML = "";
  displayComments(comments);
});
