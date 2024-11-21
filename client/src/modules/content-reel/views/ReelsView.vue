<script setup lang="ts">
import { ref } from 'vue';
const handleScroll = () => {}
</script>

<template>
  <main @scroll="handleScroll" class="h-full overflow-y-auto">
    <PostCreator />
    <!-- <NoConnection v-if="err" @click="loadPosts" :loading="isLoading" />

    <div v-if="posts" id="posts-container" class="reel max-w-full mt-5 grid gap-10">
      <div v-for="post in posts" :key="post.id" class="min-w-0">

        <PostItem :post @on-like-click="(data) => data.isLiked ? post.likesCount++ : post.likesCount--"
          @on-post-edit="handlePostEdit" @on-post-shared="post.repostsCount++" @on-post-delete="deletePost"
          @on-comment-created="handleCommentCreated(post)" @userBlocked="removePostsByBlockedUser" />

        <div v-if="post.isCommentAdded" class="text-sm flex items-center gap-2 mt-2">
          <p>
            <b>You</b> added {{ post.addedCommentsCount < 2 ? 'a comment' : post.addedCommentsCount + ' comments' }}.
              </p>

              <Button @click="$router.push({ name: 'post', params: { postId: post.id } })" label="View comment"
                severity="secondary" size="small" class=" text-sm h-8" />
        </div>
      </div>

      <NoConnection v-if="moreErr" @click="loadMorePosts" :loading="isLoading" />
    </div>

    <div v-if="isLoading" class="grid gap-1">
      <PostSkeleton />
      <Divider />
      <PostSkeleton />
    </div> -->
  </main>
</template>
