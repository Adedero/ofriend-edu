<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import sanitize from '../../utils/sanitize';
import { useRouter } from 'vue-router';

interface Props {
  text?: string;
}
const { text } = defineProps<Props>();

const router = useRouter();

const truncated = ref(true);
const showReadMoreButton = ref(true);
const textContainer = ref<HTMLElement | null>(null);
const buttonText = computed(() => truncated.value ? 'Read more' : 'Show less');

const toggleFullText = () => {
  truncated.value = !truncated.value
  if (!textContainer.value) return;
  if (truncated) {
    textContainer.value.style.display = '-webkit-box';
    return;
  };
  textContainer.value.style.display = 'block';
}

function checkIfTextExceedsLines() {
  const LINE_CLAMP = 5;
  if (textContainer.value) {
    textContainer.value.style.display = 'block';
    textContainer.value.style.maxHeight = 'none';
    const lineHeight = parseFloat(getComputedStyle(textContainer.value).lineHeight);
    const maxHeight = lineHeight * LINE_CLAMP;
    if (textContainer.value.scrollHeight > maxHeight) {
      showReadMoreButton.value = true;
      textContainer.value.style.display = '-webkit-box';
      return;
    }
    showReadMoreButton.value = false;
    return;
  }
}

const handleClick = (event: Event) => {
  const el = event.target as HTMLElement;
  if (!el || !el.classList.contains('mention-link')) return;
  const userId = el.getAttribute('data-user');
  router.push({
    name: 'user-social-profile',
    params: { profile_id: userId }
  });
  return;
}

onMounted(() => {
  if (!textContainer.value) return;
  checkIfTextExceedsLines();
  textContainer.value.addEventListener('click', handleClick)
});

</script>

<template>
  <div v-if="text">
    <div ref="textContainer" v-html="sanitize(text)" class="whitespace-pre-wrap" :class="{ reduced: truncated }"></div>

    <Button v-if="showReadMoreButton" @click="toggleFullText"
      size="small" severity="info" text class="mt-1">
      {{ buttonText }}
    </Button>
  </div>
</template>

<style scoped>
.reduced {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
