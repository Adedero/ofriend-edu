<template>
  <section class="h-full py-5 grid md:flex relative">
    <nav class="hidden md:block md:w-32 lg:w-56 xl:w-72 md:flex-shrink-0">
      <ReelNavbar />
    </nav>

    <div class="bg-yellow-400 flex-grow">
      <RouterView />
    </div>

    <div class="hidden overflow-y-auto px-2 lg:px-5 md:block md:w-32 lg:w-56 xl:w-72 md:flex-shrink-0">
      <ReelRightSidebar />
    </div>

    <div class="w-full h-10 absolute bottom-0 bg-red-400 md:hidden">
      MobileNavbar
    </div>
  </section>
</template>
