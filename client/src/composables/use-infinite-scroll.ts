import { type Ref, onMounted, onUnmounted } from 'vue';

type UseScrollCallback = () => void | Promise<void>;

const useInfiniteScroll = (
  el: Ref<null | HTMLElement>,
  callback: UseScrollCallback,
  verticalOffset: number = 20
) => {
  const handleScroll = (e: Event) => {
    const container = e.target as HTMLElement;
    const { scrollHeight, scrollTop, clientHeight } = container;
    const offset = Math.max(0, verticalOffset);
    if (scrollTop + clientHeight >= scrollHeight - offset) {
      callback();
    }
  };

  onMounted(() => {
    if (el.value) {
      el.value.addEventListener('scroll', handleScroll);
    }
  });

  onUnmounted(() => {
    if (el.value) {
      el.value.removeEventListener('scroll', handleScroll);
    }
  });
};

export default useInfiniteScroll;
