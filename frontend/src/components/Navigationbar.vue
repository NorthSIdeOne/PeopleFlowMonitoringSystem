<template>

  <v-navigation-drawer
      permanent
      expand-on-hover
      app

  >
    <v-list>
      <v-list-item class="px-2">
              <div class="d-flex align-center">
                <v-img
                  alt="Vuetify Logo"
                  class="shrink mr-2"
                  contain
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/WIFI_icon.svg"
                  transition="scale-transition"
                  width="40"
                />
              </div>
      </v-list-item>

      <v-list-item link href="/">
        <v-list-item-content>
          <v-list-item-title class="title">
            People Flow System
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list
        nav
        dense
    >
      <v-list-item link href="/processdata">
        <v-list-item-icon>
          <v-icon>mdi-table</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Proccessed Data</v-list-item-title>
      </v-list-item>
      <v-list-item link href="/graphs">
        <v-list-item-icon>
          <v-icon>mdi-chart-areaspline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Grphics</v-list-item-title>
      </v-list-item>
      <v-list-item link href="/nodeconfiguration">
        <v-list-item-icon>
          <v-icon>mdi-radio-tower
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>Node configuration</v-list-item-title>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-account-cancel
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>Black list</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>

<script>



export default {
  components: {
  },
}
</script>



