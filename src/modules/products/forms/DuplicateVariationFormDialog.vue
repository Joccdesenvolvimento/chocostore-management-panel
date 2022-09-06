<template>
  <div>
    <v-dialog v-model="isDuplicateDialogVisible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <h1 class="title">Duplicar variação</h1>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                hide-details
                autofocus
                label="Novo nome interno da variação*"
                v-model="variation.internalName"
                @keyup.enter="duplicateVariation"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn depressed class="mr-6" @click="$emit('close', true)" color="normal">Voltar</v-btn>
          <v-spacer></v-spacer>
          <ButtonPrimary
            block
            @click="duplicateVariation"
            :loading="isDuplicating"
            :disabled="isDuplicating"
          >Duplicar variação</ButtonPrimary>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar app v-model="isNotifyVisible" :color="colorMessage">
      {{ message }}
      <v-btn :color="colorMessage == 'primary' ? 'white' : 'red'" icon @click="hideNotification">
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('products');

export default {
  props: {
    isDuplicateDialogVisible: {
      type: Boolean,
      default: false
    },
    variation: {}
  },
  data() {
    return {
      isDuplicating: false,
      message: '',
      colorMessage: '',
      isNotifyVisible: false
    };
  },
  methods: {
    ...mapActions(['createVariation']),
    async duplicateVariation() {
      const variation = { ...this.variation };

      try {
        this.isDuplicating = true;
        const options = variation.options.map(option => {
          return {
            name: option.name,
            description: option.description,
            value: option.value ? option.value : null
          };
        });
        const newVariation = this.deleteKeys(variation, [
          'id',
          'createdAt',
          'updatedAt'
        ]);
        const createdVariation = await this.createVariation({
          variation: { ...variation, options }
        });

        this.isDuplicating = false;
        this.showMessage('Variação duplicada');
        this.$emit('wasDuplicated', { ...createdVariation.data });
      } catch (error) {
        this.isDuplicating = false;
        const message = error.response
          ? error.response.data.errors[0].message
          : error;
        this.showMessage(message, 'normal');
      }
    },
    deleteKeys(object, keys) {
      for (const key of keys) {
        delete object[key];
      }

      return object;
    },
    hideNotification() {
      this.isNotifyVisible = false;
    },
    showMessage(message, color = 'primary') {
      this.message = message;
      this.colorMessage = color;
      this.isNotifyVisible = true;
    }
  }
};
</script>
