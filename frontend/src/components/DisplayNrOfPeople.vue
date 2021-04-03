<template>
  <div>


  <v-card
      class="mx-auto"
      cols="12"
      sm="12"
      max-width="100"
      max-height="60"

  >
    <v-card-title>
      <v-icon
          :color="checking ? 'red lighten-2' : 'indigo'"
          class="mr-12"
          size="20"
          @click="takePulse"
      >
        mdi mdi-account
      </v-icon>
      <v-row align="start">
        <div class="caption grey--text text-uppercase">
          Livingroom
        </div>
        <div>
          <span

              v-text="avg|| '—'"
          ></span>
          <strong v-if="avg">PEOPLE</strong>
        </div>
      </v-row>
      <v-spacer></v-spacer>
    </v-card-title>
  </v-card>

  </div>
</template>

<script>

export default {
  data: () => ({
    checking: false,
    heartbeats: [],
  }),
  computed: {
    avg () {
      return 5
    },
  },
  created () {
    this.takePulse(false)
  },
  methods: {

    async takePulse () {

      this.avg()

    },
  },
}
</script>