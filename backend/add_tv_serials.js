const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const tvSerials = [
  {
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student to secure his family\'s future.',
    release_date: '2008-01-20',
    runtime: 47,
    poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    type: 'tv_show',
    seasons: 5,
    episodes: 62
  },
  {
    title: 'Game of Thrones',
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    release_date: '2011-04-17',
    runtime: 57,
    poster_url: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    type: 'tv_show',
    seasons: 8,
    episodes: 73
  },
  {
    title: 'Stranger Things',
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.',
    release_date: '2016-07-15',
    runtime: 51,
    poster_url: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    type: 'tv_show',
    seasons: 4,
    episodes: 42
  },
  {
    title: 'The Crown',
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.',
    release_date: '2016-11-04',
    runtime: 58,
    poster_url: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
    type: 'tv_show',
    seasons: 6,
    episodes: 60
  },
  {
    title: 'The Mandalorian',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    release_date: '2019-11-12',
    runtime: 40,
    poster_url: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
    type: 'tv_show',
    seasons: 3,
    episodes: 24
  },
  {
    title: 'The Office',
    description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    release_date: '2005-03-24',
    runtime: 22,
    poster_url: 'https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg',
    type: 'tv_show',
    seasons: 9,
    episodes: 201
  },
  {
    title: 'Friends',
    description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
    release_date: '1994-09-22',
    runtime: 22,
    poster_url: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg',
    type: 'tv_show',
    seasons: 10,
    episodes: 236
  },
  {
    title: 'The Witcher',
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    release_date: '2019-12-20',
    runtime: 60,
    poster_url: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
    type: 'tv_show',
    seasons: 3,
    episodes: 24
  },
  {
    title: 'Peaky Blinders',
    description: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.',
    release_date: '2013-09-12',
    runtime: 60,
    poster_url: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
    type: 'tv_show',
    seasons: 6,
    episodes: 36
  },
  {
    title: 'Money Heist',
    description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.',
    release_date: '2017-05-02',
    runtime: 70,
    poster_url: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
    type: 'tv_show',
    seasons: 5,
    episodes: 41
  },
  {
    title: 'Sherlock',
    description: 'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.',
    release_date: '2010-07-25',
    runtime: 88,
    poster_url: 'https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg',
    type: 'tv_show',
    seasons: 4,
    episodes: 13
  },
  {
    title: 'The Boys',
    description: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.',
    release_date: '2019-07-26',
    runtime: 60,
    poster_url: 'https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg',
    type: 'tv_show',
    seasons: 4,
    episodes: 32
  },
  {
    title: 'Wednesday',
    description: 'Follows Wednesday Addams\' years as a student at Nevermore Academy, where she tries to master her emerging psychic ability.',
    release_date: '2022-11-23',
    runtime: 50,
    poster_url: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    type: 'tv_show',
    seasons: 1,
    episodes: 8
  },
  {
    title: 'The Last of Us',
    description: 'Twenty years after a fungal outbreak ravages the planet, survivors Joel and Ellie embark on a brutal journey across post-pandemic America.',
    release_date: '2023-01-15',
    runtime: 60,
    poster_url: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    type: 'tv_show',
    seasons: 1,
    episodes: 9
  },
  {
    title: 'House of the Dragon',
    description: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys.',
    release_date: '2022-08-21',
    runtime: 60,
    poster_url: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
    type: 'tv_show',
    seasons: 2,
    episodes: 18
  }
];

async function addTVSerials() {
  const client = await pool.connect();
  
  try {
    console.log('🎬 Adding TV Serials...\n');
    
    for (const show of tvSerials) {
      const query = `
        INSERT INTO movies (title, description, release_date, runtime, poster_url, type, seasons, episodes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (title) DO UPDATE 
        SET description = EXCLUDED.description,
            type = EXCLUDED.type,
            seasons = EXCLUDED.seasons,
            episodes = EXCLUDED.episodes
        RETURNING id, title;
      `;
      
      const result = await client.query(query, [
        show.title,
        show.description,
        show.release_date,
        show.runtime,
        show.poster_url,
        show.type,
        show.seasons,
        show.episodes
      ]);
      
      console.log(`✅ Added: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
    }
    
    console.log('\n🎉 All TV serials added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addTVSerials();
