<template>


<div>
  <div class="text-center mb-16 ">
     <h1>
       Rooms Occupation
     </h1>

  </div>

 <div v-for="(item,index) in rooms.length" :key="item" >

<!--  <v-row >-->

<!--    <v-col cols="12"  sm="6" v-if="index % 2 === 1 ">-->
<!--      <chart :name="rooms[index-1]"/>-->
<!--    </v-col>-->
<!--    <v-col cols="12"  sm="6" v-if=" (index+1) % 2 === 0 ">-->
<!--      <chart :name="rooms[index]"/>-->
<!--    </v-col>-->
<!--    <v-col cols="12"  sm="6" v-if=" rooms.length%2 === 1 && index === rooms.length-1">-->
<!--      <chart :name="rooms[index]"/>-->
<!--    </v-col>-->
<!--  </v-row>-->
<div  class="pb-16">
   <chart :name="rooms[index]"/>
</div>
 </div>

</div>
</template>

<script>
import  chart from '../components/ChartComponent'
import axios from "axios";
import config from "../config/configuration";

const GET_ROOMS_URL = 'http://'+ config.SERVER +':'+ config.PORT+'/api/people_flow/rooms';

export default {

  components: {
    chart
  },
  data(){
    return{
      rooms:[],
    }
  },
  methods:{
    async getRooms(){
      let rooms =[]
      let roomsObj = await axios.get(GET_ROOMS_URL)
      roomsObj = [...roomsObj['data']]
      for(let i in roomsObj)
      {
        rooms.push(roomsObj[i]['ROOM'])
      }
      return rooms
    },


  },

  async mounted() {

    this.rooms = await this.getRooms();
  }
}
</script>