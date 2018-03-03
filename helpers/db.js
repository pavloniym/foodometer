import Sequelize from 'sequelize'
import config from 'config'
import path from 'path'
import sqlite from 'sqlite3'

import Members from '../proxies/Members'
import Meals from '../proxies/Meals'
import MealsMembers from '../proxies/MealsMembers'

const db = config.get('db');


/*
 * Store models
 */
let models = {Members: null, Meals: null, MealsMembers: null};


/**
 * Resolve path to file
 * @param dir
 * @returns {string | *}
 */
const resolve = (dir) => path.join(__dirname, '..', dir);


/**
 * Create connection to database
 */
const init = async () => {

    const sequelize = new Sequelize({
        database: db,
        username: null,
        password: null,
        dialect: 'sqlite',
        storage: resolve(`/db/${db}.db`)
    });


    return sequelize.authenticate()
        .then(_ => {

            /*
             * Include Members' model
             * Include Meals' model
             */
            const members = sequelize.import(resolve("/models/Members"));
            const meals = sequelize.import(resolve("/models/Meals"));
            const meals_members = sequelize.import(resolve("/models/MealsMembers"));


            /*
             * Init proxies
             */
            models.Members = new Members(members, {meals, meals_members});
            models.Meals = new Meals(meals, {members, meals_members}, sequelize);
            models.MealsMembers = new MealsMembers(meals_members, {meals, members});


            /*
             * Sync models
             */
            sequelize.sync();

        })
        .catch(err => console.error('DB: Unable to connect to the database:', err));
};


export default {init, models};
