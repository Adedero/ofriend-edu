<template>
  <main class="h-dvh lg:grid lg:grid-cols-5">
    <section class="hidden bg-no-repeat bg-center bg-[url(../assets/img/onboarding-img.png)] lg:block lg:col-span-2">
      <h1 class="text-white font-bold text-3xl ml-10 mt-20">
        Discover New <br />Learning Interests.
      </h1>
    </section>

    <section class="grid place-content-center gap-4 px-5 py-10 h-full overflow-y-auto lg:col-span-3">
      <RouterLink to="/">
        <MyIcon icon="logo-dark" width="128" height="47" />
      </RouterLink>

      <RouterView />
    </section>
  </main>
</template>
