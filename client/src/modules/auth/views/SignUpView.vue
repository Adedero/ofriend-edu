<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import countries from '@/data/countries';
import useFetch from '@/composables/use-fetch';
import { type UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { z } from 'zod';
import fetchErrorHandler from '@/composables/use-fetch/functions/fetch-error-handler';
import myValidator from '@/validators';

const router = useRouter();

interface User {
  name: string;
  email: string;
  birthday: Date | null;
  gender: string;
  location: { country: string; region: string };
  password: { initial: string; repeat: string };
  hasAgreedToTerms: boolean;
}

const user = ref<User>({
  name: '',
  email: '',
  birthday: null,
  gender: '',
  location: { country: '', region: '' },
  password: { initial: '', repeat: '' },
  hasAgreedToTerms: false
});

const validator = ref<{ age?: string; email?: string, password?: string, confirmPassword?: string }>({});

const isSubmissionValid = computed(() => {
  return (
    user.value.name &&
    user.value.email &&
    user.value.birthday &&
    user.value.gender &&
    user.value.location.country &&
    user.value.location.region &&
    user.value.password.initial &&
    user.value.password.repeat &&
    user.value.password.initial.length >= 8 &&
    user.value.password.repeat.length >= 8 &&
    user.value.password.repeat === user.value.password.initial &&
    user.value.hasAgreedToTerms
  )
});

watch(
  () => user.value.password.initial,
  (value) => {
    validator.value.password = '';
    if (!value) return;
    if (value.length >= 8) return;
    validator.value.password = 'Password must be at least 8 characters.'
  }
);

watch(
  () => user.value.password.repeat,
  (value) => {
    validator.value.confirmPassword = '';
    if (!value) return;
    if (value !== user.value.password.initial) {
      validator.value.confirmPassword = 'Passwords do not match!'
    }
  }
);


const loading = ref(false);
const err = ref<UseFetchError | null>(null);

interface Data {
  message: string;
  user: { id: string; name: string; email: string }
}

const submit = async () => {
  err.value = null;

  const isValid = validateInput();
  if (!isValid) return;

  loading.value = true;
  const { data, error } = await useFetch<Data>('auth/register', { method: 'POST', body: user.value, withCredentials: false });
  loading.value = false;

  if (error.value) {
    err.value = fetchErrorHandler(error.value, router);
    return;
  }

  if (!data.value) return;

  const payload = data.value as Data;

  router.push({
    name: 'otp-verification',
    query: {
      user_id: payload.user.id
    }
  });
}

function validateInput () {
  validator.value = {};

  const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
  });

  const isOldEnough = myValidator.isOldEnough(user.value.birthday as Date || '', 15);
  if (!isOldEnough) {
    validator.value.age = 'You must be at least 15 years old to sign up'
    return false;
  }

  const validationResult = schema.safeParse({ email: user.value.email, password: user.value.password.initial });
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
  <section class="h-full md:w-[28rem]">
    <h1 class="font-bold text-3xl">Create Account</h1>
    <p>
      Got an account already?
      <RouterLink :to="{ name: 'sign-in' }" class="text-turquoise hover:underline">Sign in</RouterLink>
      instead.
    </p>

    <Message v-if="err" severity="error">
      <p class="text-sm">{{ err.message }}</p>
    </Message>

    <div class="relative mt-5 grid gap-5 grid-cols-2 md:grid-cols-6">
      <div class="w-full col-span-2 md:col-span-6">
        <InputText v-model.trim="user.name" placeholder="Full Name" fluid />
      </div>

      <div class="w-full md:col-span-3">
        <DatePicker v-model="user.birthday" :invalid="!!validator.age" dateFormat="dd/mm/yy" placeholder="Date of Birth"
          fluid />
        <small v-if="validator.age" class="text-red-500">{{ validator.age }}</small>
      </div>

      <div class="w-full md:col-span-3">
        <Select v-model="user.gender" :options="['Female', 'Male', 'Other']" placeholder="Gender" fluid />
      </div>

      <div class="w-full col-span-2 md:col-span-3">
        <Select v-model="user.location.country" filter :options="countries" checkmark :highlightOnSelect="false"
          placeholder="Country" fluid />
      </div>

      <div class="w-full col-span-2 md:col-span-3">
        <InputText v-model.trim="user.location.region" placeholder="State or Region" fluid />
      </div>

      <div class="w-full col-span-2 md:col-span-6">
        <InputText v-model.trim="user.email" :invalid="!!validator.email" type="email" placeholder="Email" fluid />
        <small v-if="validator.email" class="text-red-500">{{ validator.email }}</small>
      </div>

      <div class="w-full col-span-2 md:col-span-3">
        <Password v-model.trim="user.password.initial" toggleMask :invalid="!!validator.password" placeholder="Password"
          fluid />
        <small v-if="validator.password" class="text-red-500">{{ validator.password }}</small>
      </div>

      <div class="w-full col-span-2 md:col-span-3">
        <Password v-model.trim="user.password.repeat" toggleMask :invalid="!!validator.confirmPassword"
          :feedback="false" fluid placeholder="Confirm Password" />
        <small v-if="validator.confirmPassword" class="text-red-500">{{ validator.confirmPassword }}</small>
      </div>


      <div class="col-span-2 md:col-span-6 flex gap-2 ">
        <Checkbox v-model="user.hasAgreedToTerms" binary />
        <small>
          I agree to the
          <a href="/legal/terms-and-conditions" class="text-turquoise font-semibold hover:underline">
            Terms and Conditions
          </a>
          of Ofriend Edu and I give my consent to their
          <a href="/legal/privacy-policy" class="text-turquoise hover:underline font-semibold">
            Privacy Policy</a>.
        </small>
      </div>

      <div class="flex justify-end col-span-2 md:col-span-6">
        <Button @click="submit" :loading="loading" :disabled="loading || !isSubmissionValid" label="Sign up"
          icon="pi pi-arrow-right" icon-pos="right" />
      </div>

      <p class="text-sm">Already got an account yet? <RouterLink class="font-medium text-turquoise hover:underline"
          :to="{ name: 'sign-in' }">Sign in</RouterLink>.</p>
    </div>
  </section>
</template>
