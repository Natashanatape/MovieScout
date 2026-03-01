const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const detailedDescriptions = [
  { title: 'Breaking Bad', desc: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future. As he descends deeper into the criminal underworld, he transforms from a mild-mannered educator into a ruthless drug kingpin known as Heisenberg.' },
  { title: 'Game of Thrones', desc: 'Nine noble families wage war against each other in order to gain control over the mythical land of Westeros. Meanwhile, a force is rising after millenniums and threatens the existence of living men. An epic tale of power, betrayal, and survival in a world where summers span decades and winters can last a lifetime.' },
  { title: 'Stranger Things', desc: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl. Set in 1980s Indiana, a group of friends must confront an alternate dimension known as the Upside Down and the sinister forces that threaten their world.' },
  { title: 'The Crown', desc: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century. From her early days as a young princess to her ascension to the throne, witness the personal intrigues, romances, and political machinations behind the public face of one of the world\'s most famous monarchies.' },
  { title: 'The Mandalorian', desc: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic. After the fall of the Empire, a mysterious warrior protects a special child while navigating the dangerous criminal underworld, facing mercenaries, warlords, and remnants of the Imperial forces.' },
  { title: 'The Office', desc: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium. Shot in a single-camera setup, the show chronicles the everyday lives of office employees at the Scranton, Pennsylvania branch of the fictional Dunder Mifflin Paper Company, capturing their hilarious interactions and romantic entanglements.' },
  { title: 'Friends', desc: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan. Through countless cups of coffee at Central Perk, romantic relationships, career changes, and life\'s ups and downs, these friends navigate the complexities of life and love in New York City while supporting each other through thick and thin.' },
  { title: 'The Witcher', desc: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts. Destined to protect a young princess with mysterious powers, he must navigate political intrigue, dangerous creatures, and powerful magic while confronting his own destiny in a continent torn apart by war and supernatural threats.' },
  { title: 'Peaky Blinders', desc: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby. In the aftermath of World War I, the Shelby family builds a criminal empire in Birmingham, facing rival gangs, corrupt police, and political revolutionaries while trying to move up in the world.' },
  { title: 'Money Heist', desc: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain. Led by the enigmatic Professor, eight thieves take hostages and lock themselves in the Mint as they execute an intricate plan, while a police task force works to bring them down and tensions rise among the crew.' },
  { title: 'Sherlock', desc: 'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London. Armed with smartphones and the internet, Sherlock Holmes brings his legendary deductive reasoning to contemporary cases, from government conspiracies to serial killers, while maintaining his brilliant but socially awkward personality and complex friendship with Dr. John Watson.' },
  { title: 'The Boys', desc: 'A group of vigilantes known as "The Boys" set out to take down corrupt superheroes who abuse their superpowers. In a world where superheroes are celebrities managed by a powerful corporation, these ordinary humans fight back against the corrupt "Supes" who have become more interested in fame and profit than saving lives, exposing their dark secrets and crimes.' },
  { title: 'Wednesday', desc: 'Follows Wednesday Addams\' years as a student at Nevermore Academy, where she attempts to master her emerging psychic ability, thwart a monstrous killing spree, and solve the supernatural mystery that embroiled her parents 25 years ago. All while navigating her new and very tangled relationships at the school, dealing with teenage drama in her own uniquely dark way.' },
  { title: 'The Last of Us', desc: 'Twenty years after a fungal outbreak ravages the planet and transforms humans into aggressive creatures, hardened survivor Joel is hired to smuggle 14-year-old Ellie out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey across a post-pandemic America, as they must depend on each other for survival while confronting both infected and desperate humans.' },
  { title: 'House of the Dragon', desc: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen. Set 200 years before the events of Game of Thrones, this series chronicles the beginning of the end of House Targaryen, the events leading up to the Targaryen civil war known as the "Dance of the Dragons," and the downfall of the dynasty.' },
  { title: 'Taarak Mehta Ka Ooltah Chashmah', desc: 'A satirical comedy show that revolves around the residents of Gokuldham Society and their everyday adventures, conflicts, and celebrations. Through the eyes of Taarak Mehta, a columnist, the show depicts the lives of diverse families living in harmony, dealing with modern problems while maintaining traditional values, all presented with humor and social messages about unity and friendship.' },
  { title: 'CID', desc: 'Crime Investigation Department officers ACP Pradyuman, Inspector Daya, and Inspector Abhijeet solve complex criminal cases in Mumbai using forensic science and detective work. Each episode presents a new mystery involving murders, kidnappings, and other serious crimes, which the team solves through careful investigation, scientific analysis, and brilliant deduction, often with dramatic action sequences.' },
  { title: 'Kaun Banega Crorepati', desc: 'The Indian version of Who Wants to Be a Millionaire, hosted by legendary actor Amitabh Bachchan. Contestants from all walks of life answer increasingly difficult multiple-choice questions to win prize money up to one crore rupees. The show not only tests knowledge but also shares inspiring stories of ordinary Indians, their dreams, struggles, and determination to change their lives.' },
  { title: 'The Kapil Sharma Show', desc: 'A comedy talk show where celebrities are interviewed in a humorous setting by comedian Kapil Sharma and his ensemble cast. Through hilarious sketches, witty banter, and comic situations, Bollywood stars promote their films while engaging in light-hearted conversations. The show features recurring characters, musical performances, and celebrity guests sharing behind-the-scenes stories from the entertainment industry.' },
  { title: 'Mahabharat', desc: 'An epic mythological series based on the ancient Indian epic Mahabharata, depicting the legendary Kurukshetra War and the fates of the Kaurava and Pandava princes. The show explores themes of dharma, duty, family bonds, and the eternal battle between good and evil, featuring divine interventions, complex characters, and philosophical teachings that have shaped Indian culture for millennia.' },
  { title: 'Ramayan', desc: 'A classic mythological series based on the ancient Indian epic Ramayana, telling the story of Prince Rama\'s exile, his wife Sita\'s abduction by demon king Ravana, and the subsequent war to rescue her. The show depicts the triumph of good over evil, the importance of dharma and duty, and features beloved characters like Hanuman, Lakshmana, and the demon king Ravana in this timeless tale.' },
  { title: 'Bigg Boss', desc: 'A reality show where celebrities and commoners live together in a specially constructed house isolated from the outside world, under constant camera surveillance. Contestants compete in tasks, form alliances, and face eliminations based on public voting. The show captures drama, conflicts, friendships, and emotional moments as housemates navigate challenges while being cut off from family and the outside world for months.' },
  { title: 'Koffee with Karan', desc: 'A celebrity talk show hosted by filmmaker Karan Johar where Bollywood stars appear in pairs to discuss their personal and professional lives over coffee. Known for its candid conversations, rapid-fire rounds, and controversial revelations, the show offers an intimate look into the lives of celebrities, their relationships, career choices, and industry gossip in a glamorous setting.' },
  { title: 'Sarabhai vs Sarabhai', desc: 'A comedy series about an upper-class family in Mumbai and their quirky relationships, focusing on the clash between sophisticated mother-in-law Indravadan and her middle-class daughter-in-law Monisha. The show satirizes urban elite society through witty dialogues and situational comedy, featuring memorable characters dealing with everyday situations in their own unique, hilarious ways while maintaining family bonds.' },
  { title: 'Mirzapur', desc: 'A crime thriller series about power struggles in the lawless city of Mirzapur, where the ruthless Akhandanand Tripathi rules the mafia empire of guns, drugs, and lawlessness. When two brothers from a small town get involved in the criminal underworld, a violent chain of events unfolds involving gang wars, political corruption, betrayal, and revenge in the heartland of India.' },
  { title: 'Sacred Games', desc: 'A crime thriller based on Vikram Chandra\'s novel about Mumbai police officer Sartaj Singh who receives a mysterious phone call from gangster Ganesh Gaitonde warning him of an impending threat to the city in 25 days. As Sartaj races against time to save Mumbai, the series weaves together past and present, exploring the dark underbelly of the city, political conspiracies, and religious extremism.' },
  { title: 'Scam 1992', desc: 'A financial thriller based on the 1992 Indian stock market scam orchestrated by stockbroker Harshad Mehta, who manipulated the stock market and exploited loopholes in the banking system. The series chronicles his meteoric rise from a middle-class background to becoming the "Big Bull" of the stock market, his innovative but illegal methods, and his eventual downfall that shook the Indian financial system.' },
  { title: 'Panchayat', desc: 'A comedy-drama about an engineering graduate who, due to lack of better job options, becomes a secretary in a remote village panchayat office in Uttar Pradesh. The series follows his struggles to adapt to rural life, dealing with quirky villagers, limited resources, and bureaucratic challenges, while slowly developing an appreciation for the simple life and forming meaningful relationships with the locals.' }
];

async function updateDescriptions() {
  const client = await pool.connect();
  
  try {
    console.log('📝 Updating TV Show Descriptions...\n');
    
    for (const show of detailedDescriptions) {
      await client.query(
        `UPDATE movies SET description = $1 WHERE title = $2 AND type = 'tv_show'`,
        [show.desc, show.title]
      );
      console.log(`✅ Updated: ${show.title}`);
    }
    
    console.log('\n🎉 All descriptions updated with detailed overviews!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updateDescriptions();
