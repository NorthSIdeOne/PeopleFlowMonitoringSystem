<template>
  <v-data-table
      :headers="headers"
      :items="nodeConfigurations"
      sort-by="NODE_NAME"
      class="elevation-1 pt-16"

  >
    <template v-slot:top>
      <v-toolbar
          flat
      >
        <v-toolbar-title>Nodes Configurations</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
            v-model="dialog"
            max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >
              New Node
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.NODE_NAME"
                        label="Node Name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.MAC"
                        label="Mac"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.LOCATION"
                        label="Location"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.SNIFFING_TIME"
                        label="Sniffing time"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.CHANNEL_HOPPING"
                        label="Channel Hopping"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
          small
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
          color="primary"
          @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
import config from "../config/configuration"


export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Node Name',
        align: 'start',
        sortable: true,
        value: 'NODE_NAME',
      },
      { text: 'Mac', value: 'MAC' },
      { text: 'Location', value: 'LOCATION' },
      { text: 'Sniffing Time', value: 'SNIFFING_TIME' },
      { text: 'Channel Hopping Time', value: 'CHANNEL_HOPPING' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    nodeConfigurations: [],
    editedIndex: -1,
    editedItem: {
      NODE_NAME: '',
      MAC: '',
      LOCATION:'',
      SNIFFING_TIME: 0,
      CHANNEL_HOPPING: 0,
    },
    defaultItem: {
      NODE_NAME: '',
      MAC: '',
      LOCATION:'',
      SNIFFING_TIME: 0,
      CHANNEL_HOPPING: 0,
    },
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize() {
      const NODE_CONFIGURATION_URL = 'http://'+ config.SERVER +':'+ config.PORT+'/api/node_configurations'
      let initialData = await axios.get(NODE_CONFIGURATION_URL)
      initialData = [...initialData['data']]

      console.log(initialData)
      this.nodeConfigurations = initialData;
    },
    editItem(item) {
      this.editedIndex = this.nodeConfigurations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.nodeConfigurations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {

      this.delete(this.nodeConfigurations[this.editedIndex])
      this.nodeConfigurations.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.update(this.nodeConfigurations[this.editedIndex], this.editedItem)
        Object.assign(this.nodeConfigurations[this.editedIndex], this.editedItem)

      } else {
        this.insert(this.editedItem)
        this.nodeConfigurations.push(this.editedItem)
      }

      this.close()
    },
    update(oldData, newData) {
      console.log(newData)
      axios.post('http://'+ config.SERVER +':'+ config.PORT+'/api/node_configurations/update', {
        oldData: oldData,
        newData: newData
      })
    },
    insert(data) {
      axios.post('http://'+ config.SERVER +':'+ config.PORT+'/api/node_configurations/insert', {
        data: data
      })
    },
    delete(data) {
      axios.post('http://'+ config.SERVER +':'+ config.PORT+'/api/node_configurations/delete', {
        data: data
      })
    }
  }
}
</script>