<template>
  <div>
    <v-card>
 <v-card-title  >

   <h3 style="color:#1d8dd7"> {{name}} </h3>

 </v-card-title>
    <v-row class="ml-16  mr-10 pt-5" >
      <v-col cols="12" sm="3" class="pl-16">
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
                label="Day"
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
      <v-col cols="12" sm="3" class="pl-16">
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
      <v-col cols="12" sm="3" class="pl-16">

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
      <v-col cols="12" sm="3" class="pt-8 pl-16">
        <v-btn
            depressed
            color="primary"
            @click="fillData()"
        >
          Apply
        </v-btn>
        <v-btn
            depressed
            color="primary"
            @click="reset()"
            class="ml-5"
        >
          Reset
        </v-btn>
      </v-col>

    </v-row>

  <v-row >
    <v-col cols="12" sm="11" class="pl-10">
    <line-chart :chart-data="datacollection" :options="this.options"></line-chart>
    </v-col>
  </v-row>

    </v-card>
  </div>

</template>

<script>
import LineChart from './LineChart.js'
import axios from "axios";
import config from '../config/configuration'

export default {
  props:['name'],
  components: {
    LineChart,
  },
  data () {
    return {
      date1: null,
      datePicker1: false,
      timePicker1:false,
      time1:null,
      timePicker2:false,
      time2:null,
      datacollection: null,
      times: null,
      processedData:null,
      options: {
         responsive: true,
        maintainAspectRatio:false,
         lineTension: 1,
         scales: {
                   yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: 'Nr of people'
                          },
                          ticks: {
                            beginAtZero: true,
                            padding: 25
                          }
                      }
                         ]
                 }
      }
    }
  },
  async mounted () {
    await this.fillData()
  },
  methods: {
    async reset(){

      this.date1=null;
      this.time1=null;
      this.time2=null;
      await this.fillData()
    },
    async fillData () {

      [this.times,this.processedData] = await this.getData();

      this.times = this.dateFormat(this.times)

      this.datacollection = {

        labels: this.times,
        datasets: [
          {
            label: this.name,
            backgroundColor: '#1d8dd7',
            data: this.processedData
          }
        ]
      }
    },
    async getData(){
      let GET_ROOM_DATA = null;

        if(this.date1 !== null && (this.time1 === null || this.time2 === null)){
         GET_ROOM_DATA = 'http://' + config.SERVER + ':' + config.PORT + '/api/people_flow/room/' + this.name + '/' + this.date1;
        }
        else if(this.date1 !== null && (this.time1 !== null && this.time2 !== null)){
          GET_ROOM_DATA = 'http://' + config.SERVER + ':' + config.PORT + '/api/people_flow/room/' + this.name + '/' + this.date1+'/'+this.time1 + '/'+this.time2;

        }else {
          let currentData = new Date();
          const date = currentData.getFullYear() + '-' + ("0" + currentData.getMonth()).slice(-2) + '-' + ("0" +currentData.getDay()).slice(-2);
          const time1 = ("0" +currentData.getHours()).slice(-2) + '-' + ("0" + currentData.getMinutes()).slice(-2);
          const time2 = ("0"+(currentData.getHours() + 3)).slice(-2) + '-' + ("0" +currentData.getMinutes()).slice(-2);
          GET_ROOM_DATA = 'http://' + config.SERVER + ':' + config.PORT + '/api/people_flow/room/' + this.name + '/'+date+'/'+time1 + '/'+time2;
        }

      let times = []
      let processedData = []
      let roomsObj = await axios.get(GET_ROOM_DATA)
      roomsObj = [...roomsObj['data']]
      for(let i in roomsObj)
      {
        times.push((roomsObj[i]['TIME']))
        processedData.push(roomsObj[i]['NR_OF_PEOPLE'])

      }

      return [times,processedData]
    },
    filterDate(dataToCheck,processedData,date){
      if(date === null)
        return [dataToCheck,processedData]

      let time = []
      let nrOfPeople =[]
      for(let i in dataToCheck){
        if(new Date(dataToCheck[i]).getFullYear() === new Date(date).getFullYear())
          if( new Date(dataToCheck[i]).getMonth() === new Date(date).getMonth())
            if( new Date(dataToCheck[i]).getDate() === new Date(date).getDate()) {
              time.push(dataToCheck[i])
              nrOfPeople.push(processedData[i])
            }
      }
      return [time,processedData]

    },
    filterHours(dataToCheck,processedData,h1,h2){

      if(h1 === null || h2 === null)
        return [dataToCheck,processedData]
      let time = []
      let procesedDataFiltered = []

      for(let i in dataToCheck){

        if( this.compareTime(h1,new Date(dataToCheck[i]),h2) === true){
          time.push(dataToCheck[i])
          procesedDataFiltered.push(processedData[i])
        }
      }
      return [time,procesedDataFiltered]
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
    dateFormat(dates){
      let time = []
      for(let i in dates){
        time.push( new Date(dates[i]).getHours() + ":" + new Date(dates[i]).getMinutes() + ":" +  new Date(dates[i]).getSeconds())
      }
      return time
    },

  }
}
</script>



<style>
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>