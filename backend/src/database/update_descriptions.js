const db = require('../config/database');

const updateDescriptions = async () => {
  try {
    const updates = [
      { 
        title: 'The Lord of the Rings: The Return of the King', 
        description: 'The culmination of nearly 10 years of filmmaking, Peter Jackson\'s epic trilogy comes to a close with this final chapter. Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring. The former Fellowship members must band together one last time to defend Minas Tirith from Sauron\'s forces while Frodo and Sam continue their perilous journey to destroy the Ring. With stunning battle sequences, emotional character arcs, and a satisfying conclusion to the beloved saga, this film won 11 Academy Awards including Best Picture, tying the record for most Oscars won by a single film.' 
      },
      { 
        title: 'Schindler\'s List', 
        description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis. Initially motivated by profit and the cheap labor that the Jewish community provides, Schindler\'s perspective shifts as he witnesses the horrors of the Holocaust firsthand. With the help of his accountant Itzhak Stern, Schindler begins to use his factory as a refuge, ultimately saving the lives of more than 1,100 Jews. Steven Spielberg\'s masterpiece is a powerful and haunting portrayal of one man\'s transformation from war profiteer to humanitarian hero, filmed in stark black and white to emphasize the historical gravity of the events depicted.' 
      },
      { 
        title: 'The Lord of the Rings: The Fellowship of the Ring', 
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron. Young Frodo Baggins inherits a mysterious ring from his uncle Bilbo, only to discover it is the One Ring of Power that the dark lord Sauron needs to conquer Middle-earth. Guided by the wizard Gandalf, Frodo must leave his comfortable home and embark on a perilous quest to Mount Doom, the only place where the Ring can be destroyed. Joined by his loyal friends Sam, Merry, and Pippin, along with the ranger Aragorn, the elf Legolas, the dwarf Gimli, and the warrior Boromir, the Fellowship faces countless dangers as they journey through treacherous lands filled with orcs, trolls, and other dark creatures.' 
      },
      { 
        title: 'Star Wars: Episode V - The Empire Strikes Back', 
        description: 'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda on the swamp planet Dagobah, while his friends are pursued across the galaxy by Darth Vader and the Imperial forces. Han Solo and Princess Leia seek refuge in Cloud City, only to be betrayed by Han\'s old friend Lando Calrissian. Meanwhile, Luke senses his friends are in danger and abandons his training to rescue them, leading to a climactic confrontation with Darth Vader that reveals a shocking truth about Luke\'s parentage. Widely considered the best film in the Star Wars saga, The Empire Strikes Back features groundbreaking special effects, memorable characters, and one of cinema\'s most iconic plot twists.' 
      },
      { 
        title: 'Goodfellas', 
        description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate. From his teenage years working for the local mob to his rise through the ranks and eventual downfall, Henry experiences the glamorous lifestyle of organized crime - the money, the power, and the violence. Based on the true story chronicled in Nicholas Pileggi\'s book "Wiseguy," Martin Scorsese\'s masterpiece offers an unflinching look at the Mafia lifestyle, featuring iconic performances, innovative cinematography, and a soundtrack that perfectly captures each era. The film explores themes of loyalty, betrayal, and the American Dream gone wrong, culminating in Henry\'s decision to enter the Witness Protection Program.' 
      },
      { 
        title: 'Parasite', 
        description: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident. Through a series of elaborate schemes, the Kim family members infiltrate the Park household by posing as highly qualified professionals - a tutor, an art therapist, a driver, and a housekeeper. As they enjoy their newfound prosperity, the discovery of a hidden secret in the Parks\' basement triggers a chain of events that exposes the vast economic divide between the two families. Bong Joon-ho\'s genre-defying masterpiece seamlessly blends dark comedy, thriller, and social commentary, offering a scathing critique of class inequality in modern society. The film made history by becoming the first non-English language film to win the Academy Award for Best Picture.' 
      },
      { 
        title: 'The Green Mile', 
        description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift. Paul Edgecomb is the head guard on the Green Mile, the nickname for death row at Cold Mountain Penitentiary in 1935. When John Coffey, a gentle giant with supernatural healing powers, arrives on death row, Paul begins to question whether this man could truly be guilty of the horrific crimes for which he was convicted. As Paul witnesses John\'s miraculous abilities and gentle nature, he becomes convinced of his innocence and struggles with the moral implications of executing an innocent man. Based on Stephen King\'s novel, this emotionally powerful film explores themes of justice, compassion, and the supernatural, featuring an unforgettable performance by Michael Clarke Duncan as John Coffey.' 
      },
      { 
        title: 'The Silence of the Lambs', 
        description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims. Clarice Starling, a top student at the FBI\'s training academy, is pulled from her studies to interview Dr. Hannibal Lecter, a brilliant psychiatrist and cannibalistic serial killer. The FBI hopes that Lecter\'s insights will help them catch "Buffalo Bill," a serial killer who kidnaps and murders young women. As Clarice delves deeper into the case, she forms a complex psychological relationship with Lecter, who agrees to help her in exchange for personal information about her troubled past. Jonathan Demme\'s psychological thriller is a masterclass in suspense, featuring iconic performances by Jodie Foster and Anthony Hopkins, and became only the third film to win the "Big Five" Academy Awards.' 
      },
      { 
        title: 'Saving Private Ryan', 
        description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action. After the D-Day invasion, Captain John Miller is assigned a dangerous mission: to find and bring home Private James Ryan, whose three brothers have all been killed in combat. Miller and his squad must venture deep into enemy-occupied France, facing constant danger and questioning the morality of risking eight lives to save one. Steven Spielberg\'s visceral war epic opens with one of the most intense and realistic battle sequences ever filmed, the 27-minute depiction of the Omaha Beach assault. The film explores themes of duty, sacrifice, and the true cost of war, while honoring the courage of the Greatest Generation.' 
      },
      { 
        title: 'The Departed', 
        description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston. Billy Costigan, a young cop from a troubled family, goes deep undercover to infiltrate the organization of crime boss Frank Costello. Meanwhile, Colin Sullivan, who has been groomed by Costello since childhood, rises through the ranks of the police force as Costello\'s mole. As both men become deeply embedded in their respective roles, they race to uncover each other\'s identity before their covers are blown. Martin Scorsese\'s crime thriller is a tense cat-and-mouse game featuring an all-star cast including Leonardo DiCaprio, Matt Damon, and Jack Nicholson. The film won four Academy Awards including Best Picture and Best Director, finally earning Scorsese his long-awaited Oscar.' 
      },
      { 
        title: 'Gladiator', 
        description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery. Maximus Decimus Meridius, a powerful general beloved by the aging Emperor Marcus Aurelius, is betrayed by the emperor\'s ambitious son Commodus, who murders his father and seizes the throne. Maximus escapes execution but is captured by slave traders and forced to become a gladiator. Rising through the ranks of the arena, Maximus uses his fame and skill to plot his revenge against Commodus while inspiring hope in the people of Rome. Ridley Scott\'s epic historical drama features stunning action sequences, powerful performances, and a memorable score by Hans Zimmer. Russell Crowe\'s portrayal of Maximus earned him the Academy Award for Best Actor.' 
      },
      { 
        title: 'The Prestige', 
        description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other. Robert Angier and Alfred Borden are two young magicians whose friendship turns into a bitter rivalry after a performance goes horribly wrong. As their competition escalates, both men become consumed by their obsession to create the perfect trick, leading them down increasingly dark and dangerous paths. Their quest takes them from the music halls of London to the laboratories of Nikola Tesla in Colorado, where science and illusion blur together. Christopher Nolan\'s intricate thriller explores themes of obsession, sacrifice, and the price of greatness, featuring a complex narrative structure that keeps audiences guessing until the final reveal. The film stars Christian Bale and Hugh Jackman in career-defining performances.' 
      },
      { 
        title: 'Whiplash', 
        description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential. Andrew Neiman is an ambitious jazz drummer at the prestigious Shaffer Conservatory in New York, determined to become one of the greats. When he catches the attention of Terence Fletcher, the school\'s most feared and respected instructor, Andrew believes he\'s found his path to success. However, Fletcher\'s teaching methods prove to be brutal and psychologically abusive, pushing Andrew to his physical and mental limits. As the line between motivation and abuse blurs, Andrew must decide how far he\'s willing to go to achieve perfection. Damien Chazelle\'s intense drama features powerhouse performances by Miles Teller and J.K. Simmons, who won the Academy Award for Best Supporting Actor for his terrifying portrayal of Fletcher.' 
      },
      { 
        title: 'The Intouchables', 
        description: 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver. Philippe, a wealthy Parisian aristocrat, is left paralyzed from the neck down after a paragliding accident and requires full-time care. Against the advice of his staff, he hires Driss, a young man from the projects with a criminal record and no experience in caregiving. Despite their vastly different backgrounds, the two men form an unlikely friendship that transforms both their lives. Driss brings humor, honesty, and a fresh perspective to Philippe\'s isolated world, while Philippe offers Driss opportunities and experiences he never imagined possible. Based on a true story, this French comedy-drama became an international sensation, celebrating the power of friendship to transcend social and economic barriers. The film\'s warmth, humor, and genuine emotion made it one of the highest-grossing non-English language films of all time.' 
      },
      { 
        title: 'The Pianist', 
        description: 'A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II. Władysław Szpilman is a brilliant Polish-Jewish pianist working for Warsaw Radio when Nazi Germany invades Poland in 1939. As the situation for Jews deteriorates, Szpilman and his family are forced into the Warsaw Ghetto, where they endure unimaginable hardships. When his family is deported to the Treblinka extermination camp, Szpilman manages to escape and goes into hiding, moving from one abandoned building to another while the city is systematically destroyed around him. His survival depends on the kindness of strangers and his own resourcefulness, all while maintaining his humanity and connection to music. Roman Polanski\'s powerful adaptation of Szpilman\'s memoir is a haunting portrayal of survival during the Holocaust, featuring an Oscar-winning performance by Adrien Brody and stunning cinematography that captures both the beauty and horror of wartime Warsaw.' 
      }
    ];

    for (const update of updates) {
      await db.query(
        'UPDATE movies SET description = $1 WHERE title = $2',
        [update.description, update.title]
      );
    }

    console.log('✅ All movie descriptions updated with extended content!');
  } catch (error) {
    console.error('❌ Error updating descriptions:', error);
    throw error;
  }
};

updateDescriptions()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
