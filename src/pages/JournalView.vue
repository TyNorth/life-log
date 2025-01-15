<template>
  <div class="q-pa-md flex flex-center journal-page">
    <q-toggle
      v-model="darkMode"
      @update:model-value="$q.dark.toggle"
      checked-icon="sym_o_dark_mode"
      unchecked-icon="sym_o_light_mode"
      color="accent"
      class="dark-mode-toggle sticky-top"
    />
    <q-btn
      fab
      size="xl"
      style="background-image: url('https://cdn.quasar.dev/img/avatar.png'); background-size: cover"
      @click="showMenuDialog = true"
      class="sticky-top-left"
    >
    </q-btn>
    <q-list style="border-radius: 8px" bordered separator class="journal-list">
      <q-item v-for="entry in journalStore.entries" :key="entry.id" class="q-item">
        <q-item-section side class="timestamp-section">
          <q-item-label caption lines="3">
            {{ formatDate(entry.date) }}
          </q-item-label>
        </q-item-section>
        <q-item-section class="entry-content">
          <q-item-label>{{ entry.content }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showNewEntryDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">New Journal Entry</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newEntryContent"
            outlined
            type="textarea"
            autogrow
            placeholder="Write your thoughts here..."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="addEntry" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <q-fab
    fab
    unelevated
    direction="up"
    icon="sym_o_add"
    aria-label="New Entry"
    color="accent"
    class="sticky-fab"
  >
    <q-fab-action
      color="accent"
      icon="sym_o_add"
      @click="showNewEntryDialog = true"
      aria-label="quick note"
    ></q-fab-action>
    <q-fab-action
      color="accent"
      icon="sym_o_note_stack_add"
      @click="showEditorDialog = true"
      aria-label="new note"
    ></q-fab-action>
  </q-fab>

  <q-banner rounded class="bg-primary full-width sticky-bottom flex flex-center">
    <div class="flex flex-center text-body text-weight-bold">My Journal {{ currentTime }}</div>
  </q-banner>

  <q-dialog
    transition-show="slide-up"
    transition-hide="slide-down"
    transition-duration="1500"
    class="editor-banner"
    v-model="showEditorDialog"
    maximized
  >
    <q-card>
      <q-card-section>
        <q-editor
          :dark="$q.dark.isActive ? true : false"
          v-model="newEntryContent"
          ref="editorRef"
          toolbar-rounded
          :toolbar="[
            [
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify'],
              },
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                options: ['left', 'center', 'right', 'justify'],
              },
            ],
            ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
            ['save', 'hr', 'link', 'custom_btn'],
            ['print', 'fullscreen'],
            [
              {
                label: $q.lang.editor.formatting,
                icon: $q.iconSet.editor.formatting,
                list: 'no-icons',
                options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
              },
              {
                label: $q.lang.editor.fontSize,
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
              },
              {
                label: $q.lang.editor.defaultFont,
                icon: $q.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana',
                ],
              },
              'removeFormat',
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo'],
            ['viewsource'],
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana',
          }"
        >
          <template v-slot:save>
            <q-btn
              dense
              rounded
              no-caps
              ref="saveRef"
              no-wrap
              unelevated
              label="Save"
              size="sm"
              icon="sym_o_save"
            />
          </template>
        </q-editor>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Save" color="primary" @click="addEntryFromDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showMenuDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Settings</div>
      </q-card-section>

      <q-list>
        <q-item clickable v-ripple>
          <q-item-section>First Setting</q-item-section>
          <q-item-section side> </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useJournalStore } from '../stores/journal'
import { format } from 'date-fns' // Or another date formatting library
import { useQuasar } from 'quasar'

const darkMode = computed(() => {
  return $q.dark.mode
})

const showMenuDialog = ref(false)

const $q = useQuasar()
const showEditorDialog = ref(false)
const currentTime = computed(() => {
  return format(Date.now(), 'MMM d, yyyy h:mm a')
})
const journalStore = useJournalStore()
const showNewEntryDialog = ref(false)
const newEntryContent = ref('')

const addEntry = () => {
  const newEntry = {
    id: Date.now(), // Or generate a UUID
    content: newEntryContent.value,
    date: new Date(),
  }
  journalStore.addEntry(newEntry /* userIsPaid */)
  newEntryContent.value = ''
  showNewEntryDialog.value = false
}

const addEntryFromDialog = () => {
  // ... (logic to add entry using newEntryContent.value)
  try {
    addEntry()
    $q.notify({
      message: 'Entry added!',
      color: 'positive',
    })
    showEditorDialog.value = false // Close the dialog
  } catch (error) {
    $q.notify({
      message: 'SOmething went wrong!',
      color: 'negative',
    })
    console.log('error saving entry: ', error)
  }
}

const formatDate = (date) => {
  return format(date, 'MMMM d, yyyy h:mm:ss a') // Customize the format as needed
}

watch($q.dark.isActive, (newValue) => {
  darkMode.value = newValue
})

onMounted(() => {
  journalStore.loadFromLocalStorage()
})
</script>

<style lang="scss">
.journal-page {
  position: relative;
  min-height: 100vh;
}
.sticky-bottom {
  position: fixed;
  bottom: 0;
  z-index: 9; /* Ensure banner is above other content */
  color: white;
}

.sticky-top {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 8;
}

.sticky-top-left {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 8;
}

.sticky-fab {
  position: fixed;
  bottom: 25px;
  right: 10px;
  z-index: 10;
}

.q-item {
  /* Added for content alignment */
  display: flex;
  justify-content: space-between;
}

.editor-banner {
  height: 300px;
}

.journal-list {
  width: 100%;
}

.timestamp-section {
  width: 30%; /* Adjust as needed */
  max-width: 150px;
}

.entry-content {
  width: 70%; /* Adjust as needed */
}
</style>
