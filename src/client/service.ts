import { Client, NewClient } from '../types';
import { NotFound } from '@curveball/http-errors';
import { knex, DbClient } from '../knex';

export async function findAll(): Promise<Client[]> {

  return (
    await knex.select().from('clients')
  ).map( record => mapRecord(record) );

}

export async function findById(id: number): Promise<Client> {

  const records = await knex.select()
      .from('clients')
      .where('id', id);

  if (records.length === 0) {
    throw new NotFound(`Could not find client with id ${id}`);
  }

  return mapRecord(records[0]);

}

export async function create(client: NewClient): Promise<Client> {

  const result = await knex('clients').insert({
    name: client.name,
    created_at: new Date(),
    modified_at: new Date()
  });

  return {
    ...client,
    id: result[0],
    href: `/client/${result[0]}`,
    createdAt: new Date(),
    modifiedAt: new Date()
  };

}

function mapRecord(input: DbClient): Client {

  return {
    id: input.id,
    href: `/client/${input.id}`,
    name: input.name,
    createdAt: input.created_at,
    modifiedAt: input.modified_at
  }

}
