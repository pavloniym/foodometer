//During the test the env variable is set to test


import fs from 'fs'
import path from 'path'
import db from '../helpers/db'

import group_chat_created from '../events/group_chat_created'
import new_chat_members from '../events/new_chat_members'

const assert = require('chai').assert;
const database = 'foodometer_tests';
const databasePath = `${path.basename(__dirname)}/../db/${database}.db`;


const chats = [
    {
        id: '-23210152',
        members: [
            {first_name: 'Geralt', username: 'gerwant', id: 123561},
            {first_name: 'Triss', username: 'redhead', id: 753478},
            {first_name: 'Yennifer', username: 'witch', id: 1845389},
        ]
    },
    /*{
        id: '-23416572',
        members: []
    }*/
];


describe('DB', () => {


    it('should remove old test db', () => {
        if (fs.existsSync(databasePath)) {
            fs.unlinkSync(databasePath);
            assert.ok(true)
        }
    });

   it('should create db', () => {
        db.init(database, false).then(_ => {
            if (fs.existsSync(databasePath)) {
                assert.ok(true);
            } else assert.fail("Not created", "Should be created", "Error!");
        })
    });

});


describe('Events', () => {

    beforeEach(async function () {
        process.env.NODE_ENV = 'test';
        await db.init(database, false)
    });


    it('should add member on chat creation', async () => {

        let members = 0;

        chats.forEach(async c => {
            await group_chat_created(db, null, {chats_id: c.id,creator: c.members[0]});
            members = (await db.models.Members.getAllFromChat({chats_id: c.id})).length;
        });

        console.log(members);

        //assert.equal(members, chats.length);
    });

});

