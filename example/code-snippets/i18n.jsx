import React from 'react';
import createClass from 'create-react-class';
import DateRangePicker from 'react-daterange-picker';
import moment from 'moment';

/**
 * Load moment locales that you need in your app
 * to make the localeData available to the DatePicker
 */
require('moment/locale/ar');
require('moment/locale/fr');
require('moment/locale/it');
require('moment/locale/es');
require('moment/locale/de');

/**
 * Set the default moment locale
 */
moment.locale('en');

const DatePicker = createClass({
  getInitialState() {
    return {
      value: null,
      locale: 'en',
    };
  },

  selectLocale() {
    /**
     * Change the moment locale
     */
    moment.locale(this.refs.locale.value);

    /**
     * Update the locale component prop
     */
    this.setState({
      locale: this.refs.locale.value,
    });
  },

  render() {
    return (
      <div>
        <select ref="locale"
                onChange={this.selectLocale}
                name="locale"
                id="locale">
          <option value="en">EN</option>
          <option value="ar">AR</option>
          <option value="fr">FR</option>
          <option value="it">IT</option>
          <option value="es">ES</option>
          <option value="de">DE</option>
        </select>
        <DateRangePicker
          locale={this.state.locale}
          numberOfCalendars={2}
          selectionType="range"
          minimumDate={new Date()} />
      </div>
    );
  },
});


export default DatePicker;
