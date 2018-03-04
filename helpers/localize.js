import locales from './../locales/'
import config from 'config'
import get from 'lodash/get'

export default (alias, variables = {}) => {


    /*
     * Get bot locale
     */
    const locale = config.get('locale').toLowerCase();


    /*
     * Check if locale exists
     * If not - default English
     */
    const values = locales[locale] ? locales[locale] : locales.en;



    /*
     * If alias found
     */
    if(get(values, alias, null)) {

        /*
         * Get string
         */
        let string = get(values, alias);

        /*
         * Make replacements
         */
        Object.keys(variables).forEach(key => string = string.replace((new RegExp(`{${key}}`,'g')), variables[key]));


        return string;

    } else return "Can't find localized string!";

}