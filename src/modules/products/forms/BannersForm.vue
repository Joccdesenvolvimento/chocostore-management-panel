<template>
  <div class="text-center">
    <v-dialog
      persistent
      v-model="showDialog"
      fullscreen
      scrollable
      hide-overlay
      width="500"
    >
      <template v-slot:activator="{ on }">
        <slot name="activator" :on="on"></slot>
      </template>
      <v-card class="noBoxShadow">
        <v-card-title>
          <v-btn icon @click="$emit('close', $event)">
            <v-icon>la-angle-left</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters justify="center">
            <v-col cols="12" md="8">
              <v-row no-gutters>
                <v-col
                  class="mb-6 tw-text-center md:tw-text-left"
                  cols="12"
                  md="6"
                >
                  <span class="title">{{ title }}</span>
                </v-col>
                <v-col
                  cols="6"
                  md="6"
                  class="d-flex md:tw-justify-end tw-justify-center"
                >
                  <InputSwitch
                    :labels="labelsSwitch"
                    :value="banner.status"
                    @change="banner.status = $event.value"
                    :default="banner.status"
                  />
                </v-col>
              </v-row>
              <v-row no-margin>
                <v-col cols="12">
                  <InputTextField
                    label="Título"
                    v-model="banner.title"
                    required
                  />
                </v-col>
              </v-row>

              <v-row class="tw-justify-between" no-margin>
                <v-col cols="12" md="5">
                  <v-textarea
                    dense
                    outlined
                    :counter="400"
                    rows="5"
                    label="Descrição"
                    v-model="banner.description"
                  ></v-textarea>
                  <v-col class="tw-px-0 tw-pt-5">
                    <v-col cols="12" class="tw-p-0 tw-flex tw-justify-evenly">
                      <v-select
                        outlined
                        dense
                        @change="changeType"
                        :items="actionType"
                        v-model="selectedActionType"
                        item-text="label"
                        item-value="value"
                        label="Tipo da Ação"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="12"
                      class="tw-p-0 tw-flex tw-justify-evenly"
                      v-if="selectedActionType == 'Redirecionamento Interno'"
                    >
                      <v-col cols="12" class="tw-p-0 tw-flex tw-justify-evenly">
                        <v-select
                          outlined
                          dense
                          :items="internalActionType"
                          v-model="banner.internalActionType"
                          item-text="label"
                          item-value="value"
                          label="Destino do Redirecionamento"
                        ></v-select>
                      </v-col>
                    </v-col>
                    <v-col
                      cols="12"
                      class="tw-p-0 tw-flex tw-justify-evenly"
                      v-if="
                        selectedActionType != 'Sem ação' &&
                        selectedActionType != undefined
                      "
                    >
                      <InputTextField
                        :label="
                          selectedActionType == 'Link Externo'
                            ? 'Url de Redirecionamento'
                            : `Id do destino`
                        "
                        v-model="banner.redirectData"
                      />
                    </v-col>
                  </v-col>
                  <v-col class="tw-px-0 tw-pt-5">
                    <InputCustom
                      list
                      :listItems="orderList"
                      :allowNegativeNumbers="false"
                      :value="banner.order"
                      label="Ordem"
                      color="red"
                      :reset="reset"
                      @change="changeOrder"
                      @changeString="changeOrderString"
                      :textFieldOptions="{ 'hide-details': true, dense: true }"
                    />
                  </v-col>
                </v-col>
                <v-col cols="12" md="6">
                  <v-col cols="12" class="tw-p-0 tw-flex tw-justify-evenly">
                    <v-select
                      outlined
                      dense
                      :items="bannerGoal"
                      v-model="banner.selectedGoal"
                      item-text="label"
                      item-value="value"
                      label="Finalidade"
                    ></v-select>
                  </v-col>
                  <v-col
                    class="tw-p-0"
                    v-if="banner.selectedGoal == 'Ecommerce'"
                  >
                    <v-col cols="12" class="tw-p-0">
                      <v-select
                        outlined
                        dense
                        :items="bannerType"
                        v-model="banner.selectedType"
                        item-text="label"
                        item-value="value"
                        label="Tipo"
                      ></v-select>
                    </v-col>
                  </v-col>

                  <v-row justify="space-around">
                    <v-col cols="auto" align-self="center">
                      <p style="text-align: center">Foto Padrão</p>
                      <InputImagePreview
                        class="tw-pt-2 tw-pb-2"
                        :width="'100%'"
                        @change="changePhoto"
                        :url="urlExternal"
                        :reset="reset"
                      />
                    </v-col>
                    <v-col
                      cols="auto"
                      align-self="center"
                      class="tw-p-0 align-center"
                      v-if="
                        banner.selectedType == 'Principal' &&
                        banner.selectedGoal == 'Ecommerce'
                      "
                    >
                      <p style="text-align: center">Foto Mobile</p>
                      <InputImagePreview
                        class="tw-pt-2 tw-pb-2"
                        :width="'100%'"
                        imageInputLabel="2"
                        @change="changePhotoMobile"
                        :url="urlExternalMobile"
                        :reset="resetMobile"
                      />
                    </v-col>
                  </v-row>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        style="
                          display: flex;
                          align-items: baseline;
                          justify-content: center;
                        "
                        v-bind="attrs"
                        v-on="on"
                      >
                        <p style="font-size: 14px">
                          Guia de resolução e imagens
                        </p>
                        <p style="font-size: 12px; padding-left: 2px">(?)</p>
                      </span>
                    </template>
                    <span
                      ><p class="tw-text-center">
                        • Para o App, é recomendado que a resolução seja em HD
                        (720p)
                      </p>
                      <p class="tw-text-center">
                        • Para o E-commerce, é recomendado que a resolução seja
                        no mínimo em HD (sugerido para a web: 720x380 ou mais,
                        para mobile 420x380).
                      </p>
                      <p class="tw-text-center">
                        Além disso, é possível dar upload em várias imagens para
                        diferentes resoluções no E-commerce.
                      </p></span
                    >
                    <p class="tw-text-center">
                      • Para Banners Rápidos do E-commerce, é recomendado que a
                      resolução seja no mínimo em HD (sugerido: 1280x240)
                    </p>
                    <p class="tw-text-center">
                      • É importante que o tamanho das imagens seja no máximo
                      entre 200-400Kb para priorizar performance
                    </p>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        style="
                          display: flex;
                          align-items: baseline;
                          justify-content: center;
                        "
                        v-bind="attrs"
                        v-on="on"
                      >
                        <p style="font-size: 14px">
                          Guia de tipos e finalidades
                        </p>
                        <p style="font-size: 12px; padding-left: 2px">(?)</p>
                      </span>
                    </template>
                    <span>
                      <p class="tw-text-center">
                        • Rápido : Banners secundários das páginas, são menores
                        e com menos destaque que os banners principais
                      </p>
                      <p class="tw-text-center">
                        • Principal : Banners que aparecem na página principal
                      </p>
                    </span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-margin class="mt-12">
                <v-col cols="6">
                  <v-btn
                    depressed
                    block
                    @click="$emit('close', $event)"
                    color="normal"
                    >Voltar</v-btn
                  >
                </v-col>
                <v-col cols="6">
                  <ButtonPrimary
                    :loading="isSaving"
                    :disabled="disabledButtonSave"
                    block
                    @click="onSubmit"
                    >Pronto!</ButtonPrimary
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-snackbar app v-model="showNotify" :color="colorMessage">
        {{ message }}
        <v-btn
          :color="colorMessage == 'primary' ? 'white' : 'red'"
          icon
          @click="showNotify = false"
        >
          <v-icon>la la-close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-dialog>
    <v-snackbar
      v-if="notifyType == 'error'"
      app
      v-model="showNotify"
      :color="colorMessage"
    >
      {{ message }}
      <v-btn
        :color="colorMessage == 'primary' ? 'white' : 'red'"
        icon
        @click="showNotify = false"
      >
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-if="notifyType == 'success'"
      app
      v-model="showNotify"
      :color="colorMessage"
    >
      {{ message }}
      <v-btn
        :color="colorMessage == 'primary' ? 'white' : 'red'"
        icon
        @click="showNotify = false"
      >
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import formdata from 'form-data';
import awsUrls from '@/utils/aws-urls';
const { mapActions } = createNamespacedHelpers('products');

export default {
  props: {
    showDialog: {
      type: Boolean,
    },
    banner: {
      type: Object,
      default: () => ({
        companyId: window.localStorage.getItem('companyId'),
        photo: null,
        photoMobile: null,
        title: '',
        actionType: 'Sem ação',
        description: '',
        order: 0,
        orderString: 'Primeiro',
        internalActionType: '',
        redirectData: '',
        selectedGoal: '',
        selectedType: '',
        status: 'Ativo',
      }),
    },
    title: {
      default: 'Cadastrar banner',
    },
  },
  data() {
    return {
      resetMobile: null,
      reset: null,
      disabledButtonSave: false,
      isSaving: false,
      showNotify: false,
      colorMessage: null,
      message: null,
      notifyType: null,
      urlExternal: null,
      urlExternalMobile: null,
      bannerGoal: [
        { label: 'App', value: 'App' },
        { label: 'E-Commerce', value: 'Ecommerce' },
      ],
      actionType: ['Redirecionamento Interno', 'Link Externo', 'Sem ação'],
      internalActionType: [
        { label: 'Categoria', value: 'Categoria' },
        { label: 'Produto', value: 'Produto' },
      ],
      selectedActionType: '',
      labelsSwitch: [{ name: 'Inativo' }, { name: 'Ativo' }],
      bannerType: [
        { label: 'Principal', value: 'Principal' },
        { label: 'Rápido', value: 'Rápido' },
      ],
      orderList: [
        { id: 0, name: 'Primeiro' },
        { id: 1, name: 'Segundo' },
        { id: 2, name: 'Terceiro' },
        { id: 3, name: 'Quarto' },
        { id: 4, name: 'Quinto' },
      ],
    };
  },
  mounted() {
    if (this.banner.actionType) {
      this.selectedActionType = this.banner.actionType;
    } else {
      this.selectedActionType = 'Sem ação';
    }

    if (this.banner.photo) {
      this.urlExternal = `${awsUrls.AWS_URL}${awsUrls.FOLDER_BANNER}${this.banner.photo}`;
    } else {
      this.urlExternal = '';
    }
    if (this.banner.photoMobile) {
      this.urlExternalMobile = `${awsUrls.AWS_URL}${awsUrls.FOLDER_BANNER}${this.banner.photoMobile}`;
    } else {
      this.urlExternalMobile = '';
    }
  },
  watch: {
    'banner.selectedGoal'() {
      this.resetMobile = !this.resetMobile;
      this.banner.photoMobile = '';
    },
    'banner.selectedType'() {
      if (this.banner.selectedType == 'Rápido') {
        this.resetMobile = !this.resetMobile;
        this.banner.photoMobile = '';
      } /* else if (this.banner.selectedType == 'Principal') {
        this.reset = !this.reset;
        this.banner.photo = '';
      } */
    },
    'banner.photoMobile'(val) {
      console.log('val', val);
    },
    'banner.photo'(val) {
      console.log('valphoto', val);
    },
    urlExternal(val) {
      console.log('url', val);
    },
  },

  computed: {},
  methods: {
    ...mapActions([
      'createProduct',
      'editProduct',
      'deletePromotion',
      'boostPromotion',
      'findBoostHistoric',
      'createBanner',
      'getBanners',
      'editBanner',
    ]),
    changePhoto(photo) {
      console.log('valor atual', photo);
      this.banner.photo = photo;
    },
    changePhotoMobile(photo) {
      this.banner.photoMobile = photo;
      // console.log('setou', this.banner.photoMobile);
    },
    changeType(val) {
      this.banner.actionType = val;
    },
    changeOrder(order) {
      this.banner.order = order;
    },
    changeOrderString(orderString) {
      this.banner.orderString = orderString;
    },
    showMessage(message, type, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
      this.notifyType = type;
    },
    async onSubmit() {
      this.disabledButtonSave = true;
      this.isSaving = true;
      try {
        let formData = new formdata();
        if (this.banner.actionType == 'noAction') {
          this.banner.internalActionType = null;
          this.banner.redirectData = null;
        }
        if (this.banner.selectedGoal == 'App') {
          this.banner.selectedType = 'Rápido';
        }
        formData.append('companyId', this.banner.companyId);
        formData.append('title', this.banner.title);
        formData.append('actionType', this.banner.actionType);
        formData.append('description', this.banner.description);
        formData.append('internalActionType', this.banner.internalActionType);
        formData.append('order', this.banner.order);
        formData.append('orderString', this.banner.orderString);
        if (this.banner.photo) {
          formData.append('photo', this.banner.photo);
        } else {
          formData.append('photo', '');
        }
        if (!!this.banner.photoMobile) {
          formData.append('photoMobile', this.banner.photoMobile);
        } else {
          formData.append('photoMobile', '');
        }
        formData.append('redirectData', this.banner.redirectData);
        formData.append('selectedGoal', this.banner.selectedGoal);
        formData.append('selectedType', this.banner.selectedType);
        formData.append('status', this.banner.status);
        if (!this.banner.id) {
          await this.createBanner({ banner: formData }).then(() => {
            this.banner = {
              companyId: window.localStorage.getItem('companyId'),
              photo: null,
              photoMobile: null,
              title: '',
              actionType: 'Sem ação',
              description: '',
              order: 0,
              orderString: 'Primeiro',
              internalActionType: '',
              redirectData: '',
              selectedGoal: '',
              selectedType: '',
              status: 'Ativo',
            };
          });
        } else {
          formData.append('id', this.banner.id);
          await this.editBanner({ banner: formData }).then((response) => {
            this.banner = {
              companyId: window.localStorage.getItem('companyId'),
              photo: null,
              photoMobile: null,
              title: '',
              actionType: 'Sem ação',
              description: '',
              order: 0,
              orderString: 'Primeiro',
              internalActionType: '',
              redirectData: '',
              selectedGoal: '',
              selectedType: '',
              status: 'Ativo',
            };
          });
        }

        this.disabledButtonSave = false;
        this.isSaving = false;

        this.showMessage('Salvo com sucesso!', 'success', 'primary');
        this.reset = !this.reset;
        this.resetMobile = !this.resetMobile;
        this.selectedActionType = 'Sem ação';
        this.$emit('close');
      } catch (error) {
        this.disabledButtonSave = false;
        this.isSaving = false;
        this.showMessage(error.response.data.errors[0].message, 'error');
      }
    },
  },
};
</script>