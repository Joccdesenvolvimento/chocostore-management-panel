<template>
    <div class="text-center">
        <v-dialog persistent v-model="showDialog" width="500">
            <v-card>
                <v-card-title class="headline lighten-1" primary-title>
                    Sobre a empresa
                </v-card-title>

                <v-card-text style="display: flex; flex-direction: column; align-items: center">
                    <v-col cols="12">
                        <v-text-field v-model="about.title" label="Título" dense outlined clearable
                            clear-icon="mdi-window-close" hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="about.subtitle" label="Sub Título" dense outlined clearable
                            clear-icon="mdi-window-close" hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea v-model="about.text" no-resize dense outlined clearable
                            clear-icon="mdi-window-close" hide-details rows="7">
                            <template v-slot:label>
                                <div>
                                    Sobre
                                </div>
                            </template>
                        </v-textarea>
                    </v-col>

                </v-card-text>

                <v-card-actions>
                    <v-btn color="primary" class="mr-4" text @click="$emit('close', true)">Cancelar</v-btn>
                    <v-spacer></v-spacer>
                    <ButtonPrimary @click="onSubmit">Pronto!</ButtonPrimary>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

export default {
    props: {
        showDialog: {
            type: Boolean,
        },
        about: {
            type: Object,
            default: () => ({
                title: '',
                subtitle: '',
                text: ''
            })
        },
    },
    methods: {
        async onSubmit() {
            this.$emit('saveAbout', this.about)
            this.$emit('close', true)
        },

    },
};
</script>
