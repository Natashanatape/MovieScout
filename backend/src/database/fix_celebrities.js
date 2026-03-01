const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function runUpdates() {
  try {
    console.log('🔄 Updating celebrity data...');
    
    // Update biographies
    await db.query(`
      UPDATE celebrities SET 
        biography = 'Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biographical and period films, he has received numerous accolades, including an Academy Award and three Golden Globe Awards. DiCaprio began his career in the late 1980s by appearing in television commercials. He achieved international stardom with Titanic (1997) and has since starred in critically acclaimed films like The Departed, Inception, and The Revenant.'
      WHERE name = 'Leonardo DiCaprio'
    `);
    
    await db.query(`
      UPDATE celebrities SET 
        biography = 'Scarlett Ingrid Johansson is an American actress and singer. The world''s highest-paid actress in 2018 and 2019, she has featured multiple times on the Forbes Celebrity 100 list. Johansson is particularly known for her work in the Marvel Cinematic Universe as Black Widow. She has been nominated for two Academy Awards and has won a Tony Award. Her versatile performances span from indie dramas to blockbuster action films.',
        profile_image = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
      WHERE name = 'Scarlett Johansson'
    `);
    
    await db.query(`
      UPDATE celebrities SET 
        biography = 'Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles, then a resurgence of commercial success later in his career. He is best known for playing Tony Stark/Iron Man in the Marvel Cinematic Universe. Downey has also starred in Sherlock Holmes films and received acclaim for his dramatic performances in Chaplin and Tropic Thunder.'
      WHERE name = 'Robert Downey Jr.'
    `);
    
    await db.query(`
      UPDATE celebrities SET 
        biography = 'Margot Elise Robbie is an Australian actress and producer. Known for her work in both blockbuster and independent films, she has received various accolades, including nominations for three Academy Awards and five BAFTA Awards. Robbie gained international recognition with The Wolf of Wall Street and has since starred in critically acclaimed films like I, Tonya, Lady Bird, and the blockbuster hit Barbie. She is also a successful producer through her company LuckyChap Entertainment.'
      WHERE name = 'Margot Robbie'
    `);
    
    await db.query(`
      UPDATE celebrities SET 
        biography = 'Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide. Hanks has won two Academy Awards for Best Actor for Philadelphia and Forrest Gump. He is known for his everyman persona and has starred in numerous beloved films including Cast Away, Saving Private Ryan, Toy Story franchise, and Apollo 13. He is considered one of America''s cultural icons.'
      WHERE name = 'Tom Hanks'
    `);

    console.log('✅ Biographies updated!');
    console.log('✅ Scarlett Johansson image fixed!');
    console.log('✅ All celebrity data updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runUpdates();