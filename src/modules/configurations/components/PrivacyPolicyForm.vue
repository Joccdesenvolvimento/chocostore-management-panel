<template>
    <div class="content-scroll">
        <v-row justify="center">
            <v-col cols="8">
                <v-row class="mt-10">
                    <v-col cols="12" class="pb-0">
                        <p class="mb-0">Política de Privacidade da Empresa</p>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-textarea @change="onPolicyChange" v-model="privacyPolicy.policy"
                            no-resize counter dense outlined clear-icon="mdi-window-close" rows="10">
                        </v-textarea>
                    </v-col>
                </v-row>
                <v-row class="hidden-sm-and-down" justify="center">
                    <v-col cols="12" md="12">
                        <ButtonPrimary block @click="onSubmit" :loading="isButtonSubmitLoading" :disabled="!hasChange">
                            Salvar</ButtonPrimary>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>

export default {
    props: {
        privacyPolicy: {
            type: Object,
            default() {
                return {
                    policy: '',
                }
            }
        }
    },
    data() {
        return {
            isButtonSubmitLoading: false,
            hasChange: false,
        };
    },
    methods: {
        onPolicyChange(data) {
            this.hasChange = true;
        },

        onSubmit() {
            this.isButtonSubmitLoading = true;
            let policy = this.privacyPolicy.policy
            this.$emit('savePrivacyPolicy', {

                policy

            });

            this.isButtonSubmitLoading = false;

        },
    },
};
</script>
