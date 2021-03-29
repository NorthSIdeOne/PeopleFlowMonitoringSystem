<template>
  <div id="app">
    <v-app >
      <slot name="navigation"></slot>

      <v-container fluid>
      <slot name="content"></slot>
      </v-container>
    </v-app>
  </div>
</template>

<script>

export default {

}
</script>