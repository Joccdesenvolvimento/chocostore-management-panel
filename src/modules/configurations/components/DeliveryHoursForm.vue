<template>
  <div class="content-scroll">
    <v-row justify="center" class="tw-pb-24 md:tw-pb-1" v-if="company">
      <v-col cols="10" md="8">
        <v-row class="mt-5">
          <v-col cols="12">
            <p class="tw-font-bold md:tw-font-medium">Horário de entrega</p>
            <p>Lembre de alterar os horários de funcionamento nos feriados.</p>
          </v-col>
        </v-row>
        <div class="hour-grid" v-for="hour in companyHours" :key="hour.weekday">
          <div class="tw-flex">
            <div class="tw-justify-start">
              <p>{{ getWeekDay(hour.weekday) }}</p>
            </div>
            <div class="tw-justify-end">
              <div class="hidden-md-and-up tw-justify-end">
                <v-btn
                  class="add-hour-button"
                  @click="handleClickDouble(hour)"
                  depressed
                >
                  <v-icon class="add-hour-icon"
                    >la {{ hour.isDouble ? 'la-times' : 'la-plus' }}</v-icon
                  >
                </v-btn>
              </div>
            </div>
          </div>
          <div>
            <InputTextField
              filled
              outlined
              v-mask="'##:##'"
              label="Início"
              v-model="hour.hour1"
              @change="onHourChange(hour)"
            ></InputTextField>
          </div>
          <div>
            <InputTextField
              filled
              outlined
              v-mask="'##:##'"
              label="Término"
              v-model="hour.hour2"
              @change="onHourChange(hour)"
            ></InputTextField>
          </div>
          <div v-show="hour.isDouble">
            <InputTextField
              filled
              outlined
              v-mask="'##:##'"
              label="Início"
              v-model="hour.hour3"
              @change="onHourChange(hour)"
            ></InputTextField>
          </div>
          <div v-show="hour.isDouble">
            <InputTextField
              filled
              outlined
              v-mask="'##:##'"
              label="Término"
              v-model="hour.hour4"
              @change="onHourChange(hour)"
            ></InputTextField>
          </div>
          <div class="hidden-sm-and-down">
            <v-btn
              class="add-hour-button"
              @click="handleClickDouble(hour)"
              depressed
            >
              <v-icon class="add-hour-icon"
                >la {{ hour.isDouble ? 'la-times' : 'la-plus' }}</v-icon
              >
            </v-btn>
          </div>
        </div>
      </v-col>
      <div v-if="isMobile == true && isChanged" style="margin-top: 12px; width: 30%">
        <ButtonPrimary
          :disabled="isLoading"
          :loading="isLoading"
          block
          @click="onSubmit"
          >Salvar!</ButtonPrimary
        >
      </div>
    </v-row>
    <div
      v-if="isMobile == false && isChanged"
      class="d-flex justify-center align-center"
     
      style="
        position: absolute;
        z-index: 999;
        bottom: 35px;
        height: 60px;
        width: 100%;
        background: white;
      "
    >
      <div  style="margin-top: 12px; width: 30%">
        <ButtonPrimary
          :disabled="isLoading"
          :loading="isLoading"
          block
          @click="onSubmit"
          >Salvar!</ButtonPrimary
        >
      </div>
    </div>

    <v-snackbar app v-model="isNotifyVisible" :color="notifyColor">
      {{ notifyMessage }}
      <v-btn
        :color="notifyColor == 'primary' ? 'white' : 'red'"
        icon
        @click="isNotifyVisible = false"
      >
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import days from '../utils/enums/days';
import moment from 'moment';

import ConfigurationService from '../services/configuration-service';

export default {
  props: {
    company: Object,
    isMobile:{
      type: Boolean,
      default:false
    }
  },
  data() {
    return {
      companyData: {},
      isLoading: false,
      isChanged: false,
      isNotifyVisible: false,
      notifyColor: '',
      notifyMessage: '',
      
    };
  },
  computed: {
    companyHours() {
      const days = [1, 2, 3, 4, 5, 6, 7];

      const defaultHours = days.map((hour) => ({
        weekday: `${hour}`,
        hour1: '09:00',
        hour2: '17:00',
        hour3: null,
        hour4: null,
        isDouble: false,
        companyId: this.companyData.id,
      }));

      const newCompanyHours =
        this.companyData.hours && this.companyData.hours.length > 0
          ? this.getMappedCompanyHours()
          : defaultHours;

      return newCompanyHours;
    },
  },
  created() {
    this.companyData = this.company;
   
  },
  watch: {
    company(newCompanyValue) {
      this.companyData = { ...newCompanyValue };
    },
  },
  methods: {
    getMappedCompanyHours() {
      const hours = [];

      for (const hour of this.companyData.hours) {
        hours.push({
          ...hour,
          isDouble: hour.isDouble
            ? true
            : hour.hour3 || hour.hour4
            ? true
            : false,
        });
      }

      return hours;
    },
    handleClickDouble(hour) {
      hour.isDouble = !hour.isDouble;

      if (!hour.isDouble) {
        hour.hour3 = null;
        hour.hour4 = null;
      }

      const allHours = this.companyData.hours;
      const hourIndex = allHours.findIndex((h) => h.weekday == hour.weekday);

      if (hourIndex >= 0) allHours.splice(hourIndex, 1, hour);

      this.companyData.hours = allHours;

      if (!hour.isDouble) this.onHourChange(hour);
    },
    getFilledHours() {
      return this.companyHours.filter(({ hour1, hour2, hour3, hour4 }) =>
        hour1 || hour2 || hour3 || hour4 ? true : false
      );
    },
    isRemainingHourEmpty({ hour1, hour2, hour3, hour4 }) {
      if (!hour1 || !hour2) return true;

      return false;
    },
    onHourChange(hour) {
      const filledHours = this.getFilledHours();

      if (filledHours.length <= 1) {
        const isRemainingHourEmpty =
          filledHours.length == 1
            ? this.isRemainingHourEmpty(filledHours[0])
            : true;

        if (isRemainingHourEmpty || filledHours.length <= 0) {
          this.$emit('error', 'Preencha pelo menos um dia');
          return;
        }
      }

      const hourFilter = this.companyHours.find(
        (h) => h.weekday == hour.weekday
      );

      this.isChanged = true;

      // this.$emit('saveHour', hourFilter);
    },
    async onSubmit(data) {
      this.isLoading = true;

      try {
        const promises = this.companyHours.map((hour) => {
          return ConfigurationService.editHour(hour);
        });

        await Promise.all(promises);

        this.showMessage('Salvo com sucesso');
      } catch (error) {
        this.showMessage('Erro ao tentar salvar horário', 'normal');
      }

      this.isLoading = false;
    },

    getWeekDay(index) {
      return days[index];
    },

    showMessage(message, color = 'primary') {
      this.notifyMessage = message;
      this.notifyColor = color;
      this.isNotifyVisible = true;
    },
  },
};
</script>

<style scoped>
.content-scroll {
  padding-bottom: 6rem;
}

.hour-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.hour-grid div {
  width: 100%;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
}

@media (max-width: 960px) {
  .hour-grid {
    display: flex;
    gap: 0.3rem;
    flex-direction: column;
  }
  .hour-grid div {
    margin-top: 0.5rem;
  }
}

.hour-field {
  padding-left: 1rem !important;
  padding-top: 0.6rem !important;
  height: 3.2rem !important;
  border-radius: 0.6rem;
  text-align: center;
}

.theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
  border-color: #f8f8f8 !important;
  background: #f8f8f8 !important;
}

.add-hour-button {
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem !important;
  height: 2rem !important;
  border-radius: 0.2rem;
}

.add-hour-icon {
  font-size: 1.2rem;
  color: black;
}

.subtitle-2 {
  font-family: 'poppins' !important;
  font-weight: normal;
}

p {
  margin-bottom: 0;
}
</style>

<style>
.v-text-field--filled:not(.v-text-field--single-line) input {
  margin-top: 0 !important;
}
</style>
