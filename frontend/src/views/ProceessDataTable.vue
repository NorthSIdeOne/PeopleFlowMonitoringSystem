<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="desserts"
        item-key="name"
        class="elevation-1"
        :search="search"
        :custom-filter="filterOnlyCapsText"
    >
      <template v-slot:top>
        <v-text-field
            v-model="search"
            label="Search (UPPER CASE ONLY)"
            class="mx-4"
        ></v-text-field>

        <v-row no-gutters>
          <v-col
              v-for="n in 2"
              :key="n"
              cols="12"
              sm="6"
          >
            <v-card
                class="pa-2"
                outlined
                tile
            >
              <v-card
                  flat
                  color="transparent"
              >
                <v-subheader>Min and max range slider</v-subheader>

                <v-card-text>
                  <v-row>
                    <v-col class="px-4">
                      <v-range-slider
                          v-model="range"
                          :max="max"
                          :min="min"
                          hide-details
                          class="align-center"
                      >
                        <template v-slot:prepend>
                          <v-text-field
                              :value="range[0]"
                              class="mt-0 pt-0"
                              hide-details
                              single-line
                              type="number"
                              style="width: 60px"
                              @change="$set(range, 0, $event)"
                          ></v-text-field>
                        </template>
                        <template v-slot:append>
                          <v-text-field
                              :value="range[1]"
                              class="mt-0 pt-0"
                              hide-details
                              single-line
                              type="number"
                              style="width: 60px"
                              @change="$set(range, 1, $event)"
                          ></v-text-field>
                        </template>
                      </v-range-slider>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card>
          </v-col>
        </v-row>




      </template>

    </v-data-table>

  </div>


</template>

<script>
export default {
  data () {
    return {
      min: -100,
      max: 0,
      range: [-100, 0],
      search: '',
      calories: '',
      desserts: [
        {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        },
        {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        },
        {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Ant',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Unknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        }, {
          personname: 'Znknown',
          location: 'Livingroom',
          mac: 'dc:a6:32:ce:a7:56',
          rssi: -65,
          ssid: "Digi",
          lastactive: '2021-03-20T21:54:47.000Z'
        },
      ],
    }
  },
  computed: {
    headers () {
      return [
        {
          text: 'Person name',
          align: 'start',
          sortable: true,
          value: 'personname',
        },
        {
          text: 'Location',
          value: 'location',
          filter: value => {
            if (!this.calories) return true
            return value < parseInt(this.calories)
          },
        },
        { text: 'MAC', value: 'mac' },
        { text: 'RSSI', value: 'rssi' },
        { text: 'SSID', value: 'ssid' },
        { text: 'Last active', value: 'lastactive' },
      ]
    },
  },
  methods: {
    filterOnlyCapsText (value, search) {
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.indexOf(search) !== -1
    },
  },
}
</script>