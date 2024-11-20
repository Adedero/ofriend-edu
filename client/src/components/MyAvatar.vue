<script setup lang="ts">
import type { User } from '@/types/user.type';
import type { CSSProperties } from 'vue';

interface Props {
  user?: Partial<User>;
  shape?: 'circle' | 'square' | undefined;
  size?: "normal" | "large" | "xlarge" | undefined;
  avatarClass?: string;
  iconClass?: string;
  avatarStyle?: string | CSSProperties
  iconFill?: string;
  color?: string;
}

const {
  shape = 'circle',
  iconFill = '#001938'
} = defineProps<Props>();

</script>

<template>
  <div class="w-fit">
    <div v-if="user">
      <div v-if="user.picture" class="overflow-hidden grid place-content-center"
        :class="[shape === 'circle' ? 'rounded-full' : 'rounded-md', avatarClass]">
        <img :src="user.picture.url" :alt="user.name || 'user'" class="w-full object-cover">
      </div>

      <div v-else>
        <Avatar :label="user.name ? user.name[0] : 'O'" :size :class="avatarClass" :shape
          :style="avatarStyle" />
      </div>
    </div>

    <div v-else :class="iconClass">
      <MyIcon icon="user" :fill="iconFill" width="100%" height="100%" />
    </div>
  </div>
</template>