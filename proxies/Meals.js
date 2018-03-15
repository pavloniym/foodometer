export default class Meals {

    constructor(model, models = {}, sequelize = null) {
        this.model = model;
        this.models = models;
        this.sequelize = sequelize;


        /*
         * Get meal's eaters
         */
        this.model.belongsToMany(this.models.members, {
            as: 'Eaters',
            through: 'meals_members',
            foreignKey: 'meals_id',
            otherKey: 'members_id',
            constraints: false
        });


        /*
         * Get chat members where meal was created
         */
        this.model.hasMany(this.models.members, {
            as: 'Members',
            foreignKey: 'chats_id',
            sourceKey: 'chats_id',
            constraints: false
        });



        this.model.belongsTo(this.models.members, {
            as: 'Payer',
            foreignKey: 'payers_id',
            constraints: false
        })

    }


    /**
     * Create new meal in chat
     * Attach it to message
     * @param chats_id
     * @returns {Promise<void>}
     */
    async create({chats_id}) {
        return this.model.create({chats_id})
    };


    /**
     * Get meal from chat
     * @param meals_id
     * @param raw
     * @returns {Promise<Model>}
     */
    async get({meals_id, raw = false}) {
        return this.model.findOne({
            where: {id: meals_id},
            include: ['Eaters', 'Members', 'Payer'],
            raw
        });
    };



    /**
     * Clear all meals from chat
     * @param chats_id
     * @returns {Promise<Array<Model>>}
     */
    async clear({chats_id}) {
        return this.model.destroy({
            where: {chats_id}
        });
    }


    /**
     * Update payer
     * @param meals_id
     * @returns {Promise<*>}
     */
    async payer({meals_id}) {


        const meal = await this.get({meals_id});
        const eaters = meal.Eaters instanceof Array ? meal.Eaters.map(e => e.id) : [];


        const paid = (await this.sequelize.query(`
            select 

            m.id,
            count(mm.members_id) as eaters,
            m.payers_id
            
            from meals as m
            inner join meals_members as mm on m.id = mm.meals_id and mm.members_id IN (:eaters)
            inner join members as me on me.id = mm.members_id
            
            where m.id != :meals_id and m.confirmed = 1
            group by m.id
            
            having eaters = :eaters_number
            order by m.createdAt desc
            limit :meals_limit`,
            {
                replacements: {
                    eaters: eaters,
                    meals_id: meal.id,
                    eaters_number: eaters.length,
                    meals_limit: (eaters.length - 1) < 0 ? 0 : (eaters.length - 1),
                }, type: this.sequelize.QueryTypes.SELECT
            }
        )).map(p => p.payers_id);


        Array.prototype.diff = function(a) {
            return this.filter(function(i) {return a.indexOf(i) < 0;});
        };


        /*
         * Get eaters who are not pay yet
         * In last meals
         */
        const payers = eaters.diff(paid);


        /*
         * Get payers_id and update meal
         */
        return meal.updateAttributes({payers_id: payers[0] ? payers[0] : null})


    }


}