
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('notes').del()
    .then(function () {
      return knex('users').del()
    })
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: 1, username: 'tom', password: 'password1' },
        { id: 2, username: 'hollie', password: 'password2' },
        { id: 3, username: 'ben', password: 'password3' }
      ]);
    })
    .then(function () {
      // Inserts seed entries
      return knex('notes').insert([
        { id: 1, title: 'Aulirel', date: new Date(2020, 05, 22), content: 'Attack swiftly, and without warning.', user_id: 1 },
        { id: 2, title: 'Khaine', date: new Date(2020, 05, 23), content: 'I walk again, a god among mere mortals.', user_id: 1 },
        { id: 3, title: 'Avenelle', date: new Date(2020, 05, 24), content: 'I have seen the future, and it is death.', user_id: 1 },

        { id: 4, title: 'Baharroth', date: new Date(2020, 05, 22), content: 'May the winds of fate guide my sword.', user_id: 2 },
        { id: 5, title: 'Ulthran', date: new Date(2020, 05, 23), content: 'When there is no other way, the perilous path is the only road to salvation.', user_id: 2 },
        { id: 6, title: 'Arienal', date: new Date(2020, 05, 24), content: 'The universe is tripatite: the sunlight of the material plane, the darkness of the spirit plane, and the twilight of the spaces betwixt the two.', user_id: 2 },

        { id: 7, title: 'Kelmon', date: new Date(2020, 05, 22), content: 'Gather the dead for war, let them join our ranks, lest we are forced to join theirs.', user_id: 3 },
        { id: 8, title: 'Mirehn Bielann', date: new Date(2020, 05, 23), content: 'The stars themselves once lived and died at our command, yet you still dare to oppose our will.', user_id: 3 },
        { id: 9, title: 'Nuadhu', date: new Date(2020, 05, 24), content: 'Feel the rush of the wind against your skin and hear her keening cry in your ears. ', user_id: 3 }
      ]);
    });
};
