export default class MealsMembers {

    constructor(model, models = {}) {
        this.model = model;
        this.models = models;
    }



    /**
     * Check if meal's member exists
     * Create or remove him
     * @param meals_id
     * @param members_id
     * @returns {Promise<Model>}
     */
    async switch({meals_id, members_id}) {

        return this.model.findOne({
            where: {meals_id, members_id}
        }).then(member => {

            /*
             * If meal's member exists - destroy
             * If meal's member not exists - create
             */
            if(member) member.destroy();
            else this.add({meals_id, members_id});

        })
    }



    /**
     * Add meal's member
     * @param meals_id
     * @param members_id
     * @returns {Promise<void>}
     */
    async add({meals_id, members_id}) {
        return this.model.create({meals_id, members_id});
    }

}
