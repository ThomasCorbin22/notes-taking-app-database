exports.up = function (knex, Promise) {
    return knex.schema.createTable('notes', (table) => {
        table.increments();
        // Card number doesn't reflect a number but rather an identifier, hence I have chosen to leave it as a string
        table.string('title');
        table.datetime('date', { precision: 6 }).defaultTo(knex.fn.now(6));
        table.string('content');
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id');
    });
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('notes');
}