const db = require('./src/config/database');

const fixBollywoodPosters = async () => {
  try {
    const updates = [
      {
        title: 'Gully Boy',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BNmExMTM4ZGItNDZhYi00MWNlLWE4NzAtMTg5NjE3NzY5OTk0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.indianexpress.com/2019/02/gully-boy-759.jpg'
      },
      {
        title: 'Andhadhun',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BZTRjNWEwMDktMDJhNy00ZmRlLWE5YzMtMzk2OTI0OTYzMTk5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201810/andhadhun.jpeg'
      },
      {
        title: 'Bajrangi Bhaijaan',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTc1NjUxNzgyNF5BMl5BanBnXkFtZTgwNjU0Mzg4NTE@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.news18.com/ibnlive/uploads/2015/07/bajrangi-bhaijaan.jpg'
      },
      {
        title: 'Zindagi Na Milegi Dobara',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BZGFkMjRhNjMtYjY3Yi00MjgxLWE4ZTctNjg2NjY5MzNlNGU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2016/07/15/Pictures/_c8e8e8e4-4a5f-11e6-b49b-c5e0d4c5f5c5.jpg'
      },
      {
        title: 'Drishyam',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYwOTUxNTQxNV5BMl5BanBnXkFtZTgwNzkwMzI2NjE@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.news18.com/ibnlive/uploads/2015/07/drishyam.jpg'
      },
      {
        title: 'Taare Zameen Par',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMDhjZWViN2MtNzgxOS00NmI4LThiZDQtZDI3MzM4MDE4NTc0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.indianexpress.com/2017/12/taare-zameen-par-759.jpg'
      },
      {
        title: 'Lagaan',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BOTI4NTNhZDMtMTQ5Yy00ZTdkLWJkZTgtMzI0YjcxNWQyMGVhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.indianexpress.com/2021/06/lagaan-1200.jpg'
      },
      {
        title: 'PK',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYzOTE2NjkxN15BMl5BanBnXkFtZTgwMDgzMTg0MzE@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.news18.com/ibnlive/uploads/2014/12/pk.jpg'
      },
      {
        title: 'Dangal',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.indianexpress.com/2016/12/dangal-759.jpg'
      },
      {
        title: '3 Idiots',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2ZGJmYzFhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        backdrop_url: 'https://images.indianexpress.com/2019/12/3-idiots-759.jpg'
      }
    ];

    console.log('🎬 Fixing Bollywood movie posters...\n');

    for (const update of updates) {
      const result = await db.query(
        'UPDATE movies SET poster_url = $1, backdrop_url = $2 WHERE title = $3 RETURNING id',
        [update.poster_url, update.backdrop_url, update.title]
      );
      
      if (result.rows.length > 0) {
        console.log(`✅ Fixed: ${update.title}`);
      }
    }

    console.log('\n✅ All Bollywood posters fixed!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

fixBollywoodPosters();
