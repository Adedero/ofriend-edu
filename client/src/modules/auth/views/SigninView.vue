<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUserStore from '@/stores/user.store';
import useFetch from '@/composables/use-fetch';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import fetchErrorHandler from '@/composables/use-fetch/functions/fetch-error-handler';
import { z } from 'zod';
import type { User } from '@/types/user.type';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const err = ref<UseFetchError | null>(null);

const user = ref({ email: '', password: '' });
const authenticatedUser = ref<Partial<User> | null>(null);
const validator = ref<{ email?: string, password?: string }>({});
const isSubmissionValid = computed(() => user.value.email && user.value.password);

const visible = ref(false);

const signin = async () => {
  err.value = null;

  const isValid = validateInput();
  if (!isValid) return;

  loading.value = true;
  const { data, error } = await useFetch('auth/sign-in', { method: 'POST', body: user.value, withCredentials: false });
  loading.value = false;

  if (error.value) {
    err.value = fetchErrorHandler(error.value, router);

    if (err.value?.name === 'SuspiciousLoginAttemptError') {
      visible.value = true;
      //Work on the backedn authentication
    }
    return;
  }

  if (!data.value) return;

  const { redirect } = route.query;

  authenticatedUser.value = data.value.user as Partial<User>;

  userStore.setUser(authenticatedUser.value.id, authenticatedUser.value);

  if (!authenticatedUser.value.verified) {
    router.push({
      name: 'otp-verification',
      query: { user_id: authenticatedUser.value.id, redirect },
    });
    return;
  }

  if (redirect) {
    router.push(redirect as string);
    return;
  }
  router.push({ name: 'dashboard', params: { user_id: authenticatedUser.value.id } });
}

function validateInput() {
  const UserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
  });

  validator.value = {};

  const validationResult = UserSchema.safeParse(user.value);
  if (!validationResult.success) {
    validationResult.error.errors.forEach((error) => {
      const field = error.path[0] as 'email' | 'password';
      validator.value[field] = error.message;
    });
    return false;
  }
  return true
}
</script>

<template>
  <section class="md:w-80">
    <h1 class="font-bold text-3xl">Sign in</h1>
    <p>To continue on Ofriend.</p>

    <Message v-if="err" severity="error">
      <p class="text-sm">{{ err.message }}</p>
    </Message>

    <div class="mt-6 grid gap-6">
      <div>
        <InputText v-model="user.email" class="w-full" placeholder="Email" fluid
          :class="{ 'p-invalid': validator.email }" />
        <small v-if="validator.email" class="text-red-500">{{ validator.email }}</small>
      </div>

      <div>
        <Password v-model="user.password" toggleMask :feedback="false" input-class="w-full" placeholder="Password" fluid
          :class="{ 'p-invalid': validator.password }" />
        <small v-if="validator.password" class="text-red-500">{{ validator.password }}</small>
      </div>

      <RouterLink :to="{ name: 'sign-in' }"
        class="justify-self-end -mt-3 text-stone-400 hover:underline hover:text-turquoise text-right">
        Forgot password?
      </RouterLink>

      <Button @click="signin" :loading="loading" :disabled="loading || !isSubmissionValid" label="Sign in"
        icon="pi pi-sign-in" icon-pos="right" />

      <p class="text-sm">Don't have an account yet? <RouterLink class="font-medium text-turquoise hover:underline"
          :to="{ name: 'sign-up' }">Create one</RouterLink>.</p>
    </div>

    <Dialog v-model:visible="visible" header="Verification Needed">
      <FlaggedSigninMessage v-if="user.email" @click="$router.push({
        name: 'otp-verification',
        query: {
          email: user.email,
          redirect: $route.query.redirect
        },
      })" />
    </Dialog>
  </section>
</template>
