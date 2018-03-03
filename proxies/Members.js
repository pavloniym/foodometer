class Members {

    constructor(model, models = {}) {
        this.model = model;
        this.models = models;
    }


    /**
     * Get all members for selected chat
     * @param chats_id
     * @param raw
     * @param paranoid
     * @returns {Promise<Array<Model>>}
     */
    async getAllFromChat({chats_id, raw = false, paranoid = true}) {
        return this.model.findAll({
            where: {chats_id},
            raw,
            paranoid
        })
    }


    /**
     * Get member from chat
     * @param chats_id
     * @param users_id
     * @param raw
     * @param paranoid
     * @returns {Promise<Model>}
     */
    async get({chats_id, users_id, raw = false, paranoid = true}) {
        return this.model.findOne({
            where: {chats_id, users_id},
            raw,
            paranoid
        });
    };


    /**
     * Add new member to chat
     * @param chats_id
     * @param users_id
     * @param name
     * @param username
     */
    async add({chats_id, users_id, name, username}) {
        return this.model.create({chats_id, users_id, name, username})
    };



    /**
     * Find member by id
     * @param members_ids
     * @param raw
     * @returns {Promise<Array<Model>>}
     */
    async find({members_ids, raw = false}) {
        return this.model.findAll({
            where: {id: members_ids},
            raw
        })
    }

}

export default Members;