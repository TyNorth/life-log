import { defineStore } from 'pinia'

/**
 * @typedef {Object} JournalEntry
 * @property {string} id - Unique identifier for the entry (can be a timestamp or UUID).
 * @property {string} content - The text content of the journal entry.
 * @property {Date} date - The date and time the entry was created.
 * @property {string} [mood] - Optional mood associated with the entry.
 * @property {string[]} [tags] - Optional array of tags for the entry.
 */

export const useJournalStore = defineStore('journal', {
  state: () => ({
    /** @type {JournalEntry[]} */
    entries: [],
  }),
  actions: {
    /**
     * Fetches journal entries from Supabase (for paid users) or local storage (for free users).
     * @param {boolean} userIsPaid - Indicates if the user has a paid subscription.
     */
    async fetchEntries(userIsPaid) {
      if (userIsPaid) {
        try {
          const { data, error } = await this.$supabase.from('entries').select('*')
          if (error) {
            console.error('Error fetching entries from Supabase:', error)
          } else {
            this.entries = data
          }
        } catch (error) {
          console.error('Error fetching entries:', error)
        }
      } else {
        this.loadFromLocalStorage()
      }
    },

    /**
     * Adds a new journal entry.
     * @param {JournalEntry} newEntry - The new entry to be added.
     * @param {boolean} userIsPaid - Indicates if the user has a paid subscription.
     */
    async addEntry(newEntry, userIsPaid) {
      if (userIsPaid) {
        try {
          const { error } = await this.$supabase.from('entries').insert([newEntry])
          if (error) {
            console.error('Error adding entry to Supabase:', error)
          }
        } catch (error) {
          console.error('Error adding entry:', error)
        }
      }

      this.entries.push(newEntry)
      this.saveToLocalStorage()
    },

    /**
     * Updates an existing journal entry.
     * @param {JournalEntry} updatedEntry - The updated entry.
     * @param {boolean} userIsPaid - Indicates if the user has a paid subscription.
     */
    async updateEntry(updatedEntry, userIsPaid) {
      if (userIsPaid) {
        try {
          const { error } = await this.$supabase
            .from('entries')
            .update(updatedEntry)
            .eq('id', updatedEntry.id)
          if (error) {
            console.error('Error updating entry in Supabase:', error)
          }
        } catch (error) {
          console.error('Error updating entry:', error)
        }
      }

      const index = this.entries.findIndex((entry) => entry.id === updatedEntry.id)
      if (index !== -1) {
        this.entries.splice(index, 1, updatedEntry)
        this.saveToLocalStorage()
      }
    },

    /**
     * Deletes a journal entry.
     * @param {string} entryId - The ID of the entry to delete.
     * @param {boolean} userIsPaid - Indicates if the user has a paid subscription.
     */
    async deleteEntry(entryId, userIsPaid) {
      if (userIsPaid) {
        try {
          const { error } = await this.$supabase.from('entries').delete().eq('id', entryId)
          if (error) {
            console.error('Error deleting entry from Supabase:', error)
          }
        } catch (error) {
          console.error('Error deleting entry:', error)
        }
      }

      this.entries = this.entries.filter((entry) => entry.id !== entryId)
      this.saveToLocalStorage()
    },

    // Local Storage Helper Functions
    loadFromLocalStorage() {
      try {
        const storedEntries = localStorage.getItem('journalEntries')
        if (storedEntries) {
          this.entries = JSON.parse(storedEntries)
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    },
    saveToLocalStorage() {
      try {
        localStorage.setItem('journalEntries', JSON.stringify(this.entries))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    },
  },
})
