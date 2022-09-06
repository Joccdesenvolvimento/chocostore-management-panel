import moment from 'moment';

export default (a, b) => {
  moment.locale('pt-br');

  const start = moment(a, 'YYYY-MM-DD');
  const end = moment(b, 'YYYY-MM-DD');

  return moment.duration(start.diff(end)).asDays();
};
