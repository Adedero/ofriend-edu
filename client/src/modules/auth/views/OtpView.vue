<script setup lang="ts">
import useFetch from '@/composables/use-fetch';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import fetchErrorHandler from '@/composables/use-fetch/functions/fetch-error-handler';
import utils from '@/utils';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

interface User {
  id: string; name: string; email: string; verified: boolean;
}

const user = ref<null | User>(null);
const OTP = ref('');

const loading = ref(false);
const err = ref<null | UseFetchError>(null);

const resendCount = ref(0);
const seconds = ref(60);
const timer = ref<ReturnType<typeof setInterval>>();
const verified = ref(false);

//send email on mounted
async function sendOtpEmail(userId: string) {
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<{ message: string; user: User }>(`auth/otp/mail?user_id=${userId}`, { method: 'POST', withCredentials: false });
  loading.value = false;
  if (error.value) {
    err.value = fetchErrorHandler(error.value, router);
    return false;
  }
  if (!data.value) return false;
  user.value = data.value.user as User;

  if (user.value.verified) {
    router.push({ name: 'sign-in' });
    return false
  }
  return true;
}

const resendOTP = () => sendOtpEmail(user.value?.id ?? route.query.user_id as string);

//verify OTP
const verificationError = ref<null | UseFetchError>(null);

async function verifyOtp() {
  verificationError.value = null;
  loading.value = true;
  const { data, error } = await useFetch<{ message: string; verified: boolean }>(
    `auth/account/verify?user_id=${user.value?.id}&otp=${OTP.value}`, { method: 'POST', withCredentials: false }
  );
  loading.value = false;
  if (error.value) {
    verificationError.value = fetchErrorHandler(error.value, router);
    return false;
  }
  if (!data.value) return false;

  verified.value = data.value.verified as boolean;

  if (verified.value) {
    setTimeout(() => {
      router.push({ name: 'sign-in' });
    }, 3000);
  }
}

const startTimer = () => {
  timer.value = setInterval(() => {
    if (seconds.value === 0) {
      clearInterval(timer.value);
    } else {
      seconds.value--;
    }
  }, 1000);
}

const stopTimer = () => clearInterval(timer.value);

onMounted(async () => {
  if (!route.query.user_id) {
    router.push('/');
    return;
  }
  const success = await sendOtpEmail(route.query.user_id as string);
  if (!success) return;
  startTimer();
});

onUnmounted(() => {
  stopTimer();
})
</script>

<template>
  <section class="h-full md:w-96">
    <h1 class="font-bold text-3xl mb-4">Account Verification</h1>

    <Message v-if="verified" severity="success">
      <div class="text-sm">
        <p>Your account has been verified.</p>
        <div class="flex items-center gap-2">
          <span class="pi pi-spinner pi-spin"></span>
          <p>You are being redirected. Please wait.</p>
        </div>
      </div>
    </Message>

    <div v-if="loading">
      <Loader text="Please wait" />
    </div>

    <div v-if="err">
      <FetchError :error="err" @retry="sendOtpEmail($route.query?.user_id as string)" />
    </div>

    <div v-if="user">
      <p v-if="resendCount < 1">
        Enter the OTP sent to your email <span class="font-semibold">{{ utils.maskEmail(user.email) }}</span>
      </p>
      <p v-else>
        The OTP has been resent to your email <span class="font-semibold">{{ utils.maskEmail(user.email) }}</span>
      </p>

      <div class="mt-5 grid gap-6">
        <div>
          <InputOtp v-model="OTP" :length="6" fluid integer-only mask />
        </div>

        <div v-if="verificationError">
          <Message severity="error">
            <p class="text-sm">{{ verificationError.message }}</p>
          </Message>
        </div>

        <div>
          <p>
            Didn't get the code?
            <button @click="resendOTP" :disabled="loading || seconds > 0"
              class="text-turquoise hover:underline disabled:text-slate-500 disabled:hover:no-underline">
              <span v-if="loading">Resending...</span>
              <span v-else>Resend {{ seconds ? `in ${seconds}s` : '' }}</span>
            </button>
          </p>
        </div>

        <div>
          <Button @click="verifyOtp" label="Confirm" icon="pi pi-check-square" icon-pos="right" :disabled="loading || OTP.length < 6" />
        </div>
      </div>
    </div>

    <p class="mt-3">Back to
      <RouterLink to="/" class="text-turquoise hover:underline font-semibold">Sign in.</RouterLink>
    </p>
  </section>
</template>
