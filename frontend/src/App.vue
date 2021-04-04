<template>
  <v-app>
<!--    <v-app-bar-->
<!--      app-->
<!--      color="black"-->
<!--      dark-->
<!--    >-->
<!--      <div class="d-flex align-center">-->
<!--        <v-img-->
<!--          alt="Vuetify Logo"-->
<!--          class="shrink mr-2"-->
<!--          contain-->
<!--          src="https://upload.wikimedia.org/wikipedia/commons/4/44/WIFI_icon.svg"-->
<!--          transition="scale-transition"-->
<!--          width="40"-->
<!--        />-->

<!--&lt;!&ndash;        <v-img&ndash;&gt;-->
<!--&lt;!&ndash;          alt="People flow system"&ndash;&gt;-->
<!--&lt;!&ndash;          class="shrink mt-1 hidden-sm-and-down"&ndash;&gt;-->
<!--&lt;!&ndash;          contain&ndash;&gt;-->
<!--&lt;!&ndash;          min-width="100"&ndash;&gt;-->
<!--&lt;!&ndash;          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"&ndash;&gt;-->
<!--&lt;!&ndash;          width="100"&ndash;&gt;-->
<!--&lt;!&ndash;        />&ndash;&gt;-->
<!--      </div>-->

<!--      <v-spacer></v-spacer>-->

<!--    </v-app-bar>-->

    <v-main>

      <MainPage>
        <template v-slot:navigation>
        <NavigationBar></NavigationBar>
        </template>

        <template v-slot:content>
          <div id="app">
          <router-link to="/proccessdata"></router-link>
            <router-link to="/graphs"></router-link>
            <router-link to="/nodeconfiguration"></router-link>
          </div>
          <router-view/>

        </template>

      </MainPage>
    </v-main>
  </v-app>
</template>

<script>

import NavigationBar from './components/Navigationbar';
 import MainPage from './components/MainPage';
 //import ProceessDataTable from "@/components/ProceessDataTable";

export default {
  name: 'App',

  components: {
   // HelloWorld,
   //  Navigation,
    NavigationBar,
    MainPage,
    //ProceessDataTable
  },

  data: () => ({
    //
  }),
};
</script>
