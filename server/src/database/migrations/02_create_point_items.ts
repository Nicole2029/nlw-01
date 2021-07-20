import { table } from 'console';
import {Knex} from 'knex';


export async function up (knex: Knex){
    return knex.schema.createTable('point_items', table=>{
        table.increments('id').primary();

        table.integer('point_id')
        .notNullable()
        .references('id')
        .inTable('points');

        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('items');

    })
    //criar tabela
}
export async function down (knex: Knex){
    //voltar atras deletar tabela
    return knex.schema.dropTable('point_items');
}

