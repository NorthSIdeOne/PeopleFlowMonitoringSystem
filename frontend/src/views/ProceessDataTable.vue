<template>
  <div>
    <!--  Table  -->
    <v-data-table
        :headers="headers"
        :items="filtered"
        item-key="name"
        class="elevation-1"
        :search="search"
        :custom-filter="filterText"
    >
    <!--   ***************Search bar****************   -->

      <template v-slot:top >
        <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
        ></v-text-field>

        <v-row no-gutters >
          <v-col

              cols="12"
              sm="12"

          >
            <v-card
                outlined
                tile

            >
              <v-card
                  flat
                  color="transparent"
              >
                <v-subheader>RSSI</v-subheader>

                <v-card-text>
                  <v-row>
                    <v-col class="px-4">
                      <v-range-slider
                          v-model="rssi_range"
                          :max="max"
                          :min="min"
                          hide-details
                          class="align-center"
                      >

                        <template v-slot:prepend>
                          <v-text-field
                              :value="rssi_range[0]"
                              class="mt-0 pt-0"
                              hide-details
                              single-line
                              type="number"
                              style="width: 60px"
                              @change="$set(rssi_range, 0, $event)"
                          ></v-text-field>
                        </template>

                        <template v-slot:append>
                          <v-text-field
                              :value="rssi_range[1]"
                              class="mt-0 pt-0"
                              hide-details
                              single-line
                              type="number"
                              style="width: 60px"
                              @change="$set(rssi_range, 1, $event)"
                          ></v-text-field>

                        </template>
                      </v-range-slider>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                    >
                      <v-select
                          v-model="room"
                          :items="rooms"
                          chips
                          label="Locations"
                          multiple
                          outlined
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card>
          </v-col>
        </v-row>

<!--        Time picker    -->

        <v-row>

<!--   ###########  Date picker ##############       -->

<!--          Menu with a date picker that store the date-->
<!--          in 'date1'.                                -->

          <v-col
              cols="6"
              lg="3"
              class="pl-5"
          >
            <v-menu
                v-model="datePicker1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="date1"
                    label="From "
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="date1"
                  no-title
                  @input="datePicker1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
<!--   ###########  Date picker ##############       -->

<!--          Menu with a date picker that store the date-->
<!--          in 'date1'.                                -->

          <v-col
              cols="6"
              lg="3"
              class="pl-5"
          >
            <v-menu
                v-model="datePicker2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="date2"
                    label="To "
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="date2"
                  no-title
                  @input="datePicker2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>


 <!--   ###########  Hour picker ##############       -->

<!--          Hour picker with a menu that pop up-->
<!--          an time picker.                    -->
<!--          The time is saved in 'time1'       -->
          <v-col
              cols="6"
              sm="3"
              class="pl-5"
          >
            <v-menu
                ref="menu"
                v-model="timePicker1"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time1"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="time1"
                    label="From "
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                  v-if="timePicker1"
                  v-model="time1"
                  full-width
                  @click:minute="$refs.menu.save(time1)"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-spacer></v-spacer>

<!--   ###########  Hour picker  ##############       -->

<!--          Hour picker with a menu that pop up-->
<!--          an time picker.                    -->
<!--          The time is saved in 'time2'       -->
          <v-col
              cols="6"
              sm="3"
              class="pl-5"
          >
            <v-dialog
                ref="dialog"
                v-model="timePicker2"
                :return-value.sync="time2"
                persistent
                width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="time2"
                    label="To"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                  v-if="timePicker2"
                  v-model="time2"
                  full-width
              >
                <v-spacer></v-spacer>
                <v-btn
                    text
                    color="primary"
                    @click="timePicker2 = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(time2)"
                >
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </template>

    </v-data-table>

  </div>

</template>

<script>
import axios from "axios";
import config from "../config/configuration"

const processedDataURL  = 'http://'+ config.SERVER +':'+ config.PORT+'/api/process_data'
const avalabileRoomsURL ='http://'+ config.SERVER +':'+ config.PORT+'/api/people_flow/rooms'

const RSSI              = 'RSSI'
const LAST_ACTIVE       = 'LAST_ACTIVE'
const LOCATION          = 'LOCATION'
const ROOM              = 'ROOM'

export default {

  comments:{

  },
  data () {

    return {
      room:null,
      rooms: [],
      date1: null,
      date2: null,
      datePicker1: false,
      datePicker2: false,
      time2:null,
      time1: null,
      timePicker1: false,
      timePicker2: false,
      min: -100,
      max: 0,
      rssi_range: [-100, 0],
      search: '',
      processedData: [],
    }
  },

  computed: {
    filtered(){
      let filetedProcessedData = this.processedData;

      filetedProcessedData = this.getRssiInterval(filetedProcessedData)
      filetedProcessedData = this.filterDate(filetedProcessedData)
      filetedProcessedData = this.filterTime(filetedProcessedData)
      filetedProcessedData = this.filterRoom(filetedProcessedData)
      console.log(filetedProcessedData)
      return filetedProcessedData
    },
    headers () {
      return [
        {
          text: 'Person name',
          align: 'start',
          sortable: true,
          value: 'PERSON_NAME',
        },
        {
          text: 'Location',
          value: 'LOCATION',
        },
        { text: 'MAC', value: 'MAC' },
        { text: 'RSSI', value: 'RSSI' },
        { text: 'SSID', value: 'SSID' },
        { text: 'Last active', value: 'LAST_ACTIVE' },
      ]
    },
  },


  methods: {
    /**
     *  Get all the avalabile rooms from
     *  roomsObject which is the object
     *  retrived from API.
     *
     * @param roomsObject contains all rooms avalabile
     * @returns an array with all avalabile rooms
     */
    async getRooms(){

      const roomsObject = await axios.get(avalabileRoomsURL);
      let rooms         = [];

      for(let key in roomsObject['data']){
        rooms.push(roomsObject['data'][key][ROOM])
      }
      return rooms;
    },
    /**
     *  Get processed data from the API
     *
     * @returns the processedData array
     */
    async getProcessedData()
    {
      let processedDataObj = await axios.get(processedDataURL)
      processedDataObj = [...processedDataObj['data']]

      for(let i in processedDataObj){
        processedDataObj[i][LAST_ACTIVE] = this.parseDate(new Date(processedDataObj[i][LAST_ACTIVE]))
      }
      return  processedDataObj
    },

    /**
     *  Filter the date and return all the
     *  processed data that are in between
     *  date1 and date2
     *
     */
    filterDate(processDataObj){

      let filteredData = []
      if( this.date1 === null || this.date2 === null) {
          return processDataObj
      }

      for(let index in processDataObj){
       if(this.compareDates(new Date(this.date1),new Date(processDataObj[index][LAST_ACTIVE]),new Date(this.date2)) === true)
             filteredData.push(processDataObj[index])
      }
      return filteredData
    },
    /**
     *  Filter the time and return all the
     *  processed data that are in between
     *  time1 and time2
     *
     */
    filterTime(processDataObj){
      let filteredData = []
      if( this.time1 === null || this.time2 === null) {
        return processDataObj
      }

      for(let index in processDataObj){
        if(this.compareTime(this.time1,new Date(processDataObj[index][LAST_ACTIVE]),this.time2) === true)
          filteredData.push(processDataObj[index])
      }
      return filteredData
    },

    /**
     *  Filter the locations and return all the
     *  processed data that contains the selected
     *  rooms from this.room
     *
     */
    filterRoom(processDataObj){
      let filteredData = []
      if( this.room === null || this.room.length === 0) {
        return processDataObj
      }
      for(let index in processDataObj){
        if(this.compareRooms(processDataObj[index][LOCATION],this.room) === true)
          filteredData.push(processDataObj[index])
      }
      return filteredData
    },

    /**
     *   Comapre if a date object is
     *   in between 2 dates.
     * @param obj1
     * @param obj2
     * @param obj3
     * @returns {boolean}
     */
    compareDates(obj1,obj2,obj3){

      let date1 = 10000*(obj1.getFullYear() + 1) + 100*(obj1.getMonth() + 1) + (obj1.getDate() + 1)
      let date2 = 10000*(obj2.getFullYear() + 1) + 100*(obj2.getMonth() + 1) + (obj2.getDate() + 1)
      let date3 = 10000*(obj3.getFullYear() + 1) + 100*(obj3.getMonth() + 1) + (obj3.getDate() + 1)

      if(date1 <= date2  && date2 <= date3) {
        return true
      }
      else {
        return false
      }
    },
    /**
     *  Compare if obj2 is in
     *  between 2 time object:
     *  obj1 and obj3.
     *  Ex:
     *   20:00 <= 21:30 <=22:00
     *
     * @param obj1 time1
     * @param obj2 time in between
     * @param obj3 time 2
     * @returns {boolean}
     */
    compareTime(obj1,obj2,obj3){

      let time1 = parseInt(obj1.split(":")[0]*100) + parseInt(obj1.split(":")[1])
      let time2 = parseInt(obj2.getHours()*100) + parseInt(obj2.getMinutes())
      let time3 = parseInt(obj3.split(":")[0])*100 + parseInt(obj3.split(":")[1])

      if(time1 <= time2 && time2 <= time3)
        return true
      else
        return false

    },
    /**
     *  Check if a room exist
     *  in the list with selected
     *  rooms (rooms)
     * @param room the room to be checked
     * @param rooms the list of rooms
     * @returns true if room exist in rooms
     */
    compareRooms(room,rooms)
    {
      for(let index in rooms)
      {
        if(room === rooms[index])
          return true
      }
      return  false
    },
    /**
     *   Parse the date to extract only
     * the Daty , the month ,the day of the month
     * the year and the hour
     *
     * @param dateobj
     * @returns string with day,month,day of the month,year,hour
     */
    parseDate (dateobj) {
      if (!dateobj) return null
      const date = dateobj.toString().split(' ')
      return (date[0] + " " + date[1] + " " + date[2] + " " + date[3]  + " " + date[4])
    },
    /**
     *  Get the data that are in between
     *  selected rssi range.
     *
     * @param value all the data
     * @returns data that corespond to the interval
     */
    getRssiInterval(value){
      let filteredData=[]
      for(const key in value){
        if( value[key][RSSI] >=this.rssi_range[0] && value[key][RSSI] <= this.rssi_range[1] )
          filteredData.push(value[key])
      }
      return filteredData;

    },
    /**
     *  FIlter for the search bar
     *
     * @param value
     * @param search
     * @returns {boolean}
     */
    filterText (value, search) {
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.indexOf(search) !== -1
    },
  },

  async mounted(){

        this.processedData =  await this.getProcessedData();
        this.rooms         =  await this.getRooms();

  },


}
</script>