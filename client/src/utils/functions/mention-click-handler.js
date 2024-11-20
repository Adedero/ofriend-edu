const onMentionClick = (event, router) => {
  if (event.target.classList.contains("mention-link")) {
    const userId = event.target.getAttribute("data-user");
    return router.push({
      name: "user-profile",
      params: {
        profileId: userId
      }
    });
  }
  return null;
}

export default onMentionClick;