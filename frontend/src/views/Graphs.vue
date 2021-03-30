<template>

  <v-container>
    <v-row>
<v-col>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
            :value="value"
            color="rgba(255, 255, 255, .7)"
            height="100"
            padding="24"
            stroke-linecap="round"
            smooth
        >
          <template v-slot:label="item">
            ${{ item.value }}
          </template>
        </v-sparkline>
      </v-sheet>
   </v-col>
      <v-col>


        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
          >
            <template v-slot:label="item">
              ${{ item.value }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-col>



    </v-row>
    <v-row>
      <v-col>
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
          >
            <template v-slot:label="item">
              ${{ item.value }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-col>
      <v-col>


        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
          >
            <template v-slot:label="item">
              ${{ item.value }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-col>



    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    value: [
      423,
      446,
      675,
      510,
      590,
      610,
      760,
    ],
  }),
}
</script>

