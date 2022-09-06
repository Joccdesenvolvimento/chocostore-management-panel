<template>
  <v-row justify="center">
    <v-dialog v-model="isVisible" persistent max-width="600px">
      <v-card>
        <v-card-title class="tw-flex tw-justify-center md:tw-justify-start">
          <span class="headline">Editar opção</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  hide-details
                  label="Nome da opção*"
                  v-model="optionToEdit.name"
                  @keyup.enter="handleEditOption"
                />
              </v-col>
              <v-col cols="12">
                <InputTextField
                  label="Descrição"
                  v-model="optionToEdit.description"
                  @keyup.enter="handleEditOption"
                />
              </v-col>
              <v-col cols="12">
                <InputTextField
                  type="number"
                  label="Valor adicional (em R$)"
                  v-model="optionToEdit.value"
                  @keyup.enter="handleEditOption"
                />
              </v-col>
              <v-col cols="12" class="tw-flex tw-justify-center ">
                <div class="d-flex align-center mx-6" >
                  <p class="mb-0">Inativo</p>
                  <v-switch
                    class="mx-2"
                    v-model="optionToEdit.isActive"
                    :ripple="false"
                    flat
                  ></v-switch>
                  <p class="mb-0">Ativo</p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="tw-flex tw-justify-center" >
          <v-spacer class="hidden-sm-and-down"></v-spacer>
          <v-btn color="primary" text @click="$emit('close', $event)"
            >Cancelar</v-btn
          >
          <ButtonPrimary block @click="handleEditOption">Pronto!</ButtonPrimary>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    option: {
      type: Object,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    optionToEdit() {
      return { ...this.option };
    },
  },
  methods: {
    handleEditOption() {
      this.$emit('save', this.optionToEdit);
    },
  },
};
</script>
