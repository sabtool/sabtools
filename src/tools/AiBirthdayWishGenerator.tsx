"use client";
import { useState, useMemo } from "react";

type Relationship = "Friend" | "Parent" | "Sibling" | "Partner" | "Boss" | "Colleague" | "Child";
type Tone = "Funny" | "Emotional" | "Formal" | "Casual";

const wishTemplates: Record<Tone, Record<Relationship, { short: string[]; medium: string[]; long: string[]; poem: string[]; whatsapp: string[] }>> = {
  Funny: {
    Friend: {
      short: [
        "Happy Birthday, {name}! You're not old, you're vintage!",
        "Cheers to {name}! Another year of questionable decisions together!",
        "Happy Birthday {name}! Age is just a number... a really big one in your case!",
      ],
      medium: [
        "Happy Birthday {name}! They say with age comes wisdom. You must be the exception to that rule! Here's to another year of pretending we have it all figured out. Love you, buddy!",
        "Happy Birthday to my favorite weirdo, {name}! May your day be as awesome as you pretend to be on social media. Let's celebrate like there's no tomorrow (because at your age, who knows)!",
      ],
      long: [
        "Dear {name}, Happy Birthday! Where do I even begin? Another year has passed and you still haven't figured out how to adult properly. But honestly, that's what makes you the best friend ever. From our late-night snack runs to our terrible karaoke sessions, every moment with you is a comedy show. Here's to another year of making memories we'll probably have to delete from our phones. May your birthday be as epic as your excuses for being late. Love you loads, you magnificent disaster!",
      ],
      poem: [
        "Roses are red, violets are blue,\n{name} is aging, and so are you!\nBut wrinkles and gray hair aside,\nYou're still the friend I love with pride.\nSo blow those candles, eat that cake,\nHappy Birthday for friendship's sake!",
      ],
      whatsapp: [
        "🎂🎉 Happy Birthday {name}!! 🥳🎈 You're not getting older, you're just becoming a classic! 😂🍰 Party hard, sleep harder! 💤🎁 Love ya! ❤️",
      ],
    },
    Parent: {
      short: [
        "Happy Birthday, {name}! Thanks for the genes... and the jeans money!",
        "Happy Birthday {name}! Still the coolest parent in my contact list!",
        "Dear {name}, Happy Birthday! You don't look a day over fabulous!",
      ],
      medium: [
        "Happy Birthday {name}! Thank you for always pretending my cooking is good and my jokes are funny. You deserve an award for that level of patience. Here's to the parent who still can't figure out emojis but nails everything else in life!",
        "Happy Birthday to the one who gave me life and then spent every day since wondering why! {name}, you're the real MVP. May your special day be filled with relaxation (for once)!",
      ],
      long: [
        "Dear {name}, Happy Birthday to the most wonderful parent in the world! Remember when you said 'Wait till you have kids of your own'? Well, I finally understand every sigh, every eye-roll, and every 'because I said so.' You raised me with love, patience, and an endless supply of snacks. Thank you for always being there, even when I was being impossible (which, let's be honest, was most of the time). May this birthday bring you half the joy you've brought to my life. I love you more than WiFi, and that's saying something!",
      ],
      poem: [
        "Dear {name}, on this special day,\nI've got some funny things to say.\nYou taught me right from wrong with care,\nAnd how to style my messy hair.\nYou're older now, that much is true,\nBut I still wanna be like you!\nHappy Birthday, you're the best,\nNow sit down, relax, and rest!",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name}!! 🎉 You're the BEST parent ever! 🏆 Thanks for feeding me, funding me, and still not disowning me! 😂❤️ Love you to the moon! 🌙🎁🥳",
      ],
    },
    Sibling: {
      short: [
        "Happy Birthday {name}! Proof that our parents didn't quit after one try!",
        "Happy Birthday {name}! You're my favorite person to annoy!",
        "HBD {name}! Still can't believe we share DNA!",
      ],
      medium: [
        "Happy Birthday {name}! Growing up with you was like having a built-in best friend and worst enemy at the same time. Wouldn't trade it for anything though! Here's to another year of stealing each other's stuff!",
        "Happy Birthday to my sibling {name}! We've fought over the remote, the last slice of pizza, and bathroom time. But through it all, you've been my ride-or-die. Love you, even when you're annoying!",
      ],
      long: [
        "Dear {name}, Happy Birthday! From fighting over toys to fighting over who gets the front seat, we've come a long way. You've been my partner in crime, my scapegoat, and my emergency contact all rolled into one. Sure, you borrowed my clothes without asking and told on me at least a hundred times, but you also had my back when it mattered most. Here's to the person who knows all my embarrassing secrets and hasn't sold them yet. May your birthday be as amazing as having me for a sibling (which is pretty amazing, let's be honest)!",
      ],
      poem: [
        "Happy Birthday dear {name},\nYou drive me up the wall,\nBut when I needed someone there,\nYou answered every call.\nWe've shared laughs and pulled-hair fights,\nAnd snacks at 2 AM,\nI wouldn't trade my sibling life,\nNot for a million grand!",
      ],
      whatsapp: [
        "🎂 HBD {name}!! 🎉 My partner in crime! 😈 Remember when we blamed each other for everything? 😂 Still doing it! 🤣 Love you, fav sibling! ❤️🎈🎁",
      ],
    },
    Partner: {
      short: [
        "Happy Birthday {name}! You're stuck with me. No refunds!",
        "Happy Birthday love! {name}, you make my heart skip a beat... or maybe that's the cake!",
        "HBD {name}! Still the best decision I ever swiped right on!",
      ],
      medium: [
        "Happy Birthday {name}! Thank you for loving me even when I steal the covers, eat your fries, and snore like a train. You are my favorite weirdo. Here's to another year of us being the cutest mess around!",
        "Happy Birthday to my better half, {name}! Life with you is like a comedy show I never want to end. You complete me, annoy me, and make me laugh all at once. Love you endlessly!",
      ],
      long: [
        "Dear {name}, Happy Birthday to my forever person! When I look at you, I see the person who laughs at my terrible jokes, tolerates my mood swings, and still finds me attractive in my pajamas at 3 PM. You're not perfect (you leave the cap off the toothpaste), but you're perfect for me. Thank you for being my rock, my cheerleader, and my personal heater on cold nights. Here's to celebrating many more birthdays together, growing old, and still arguing about what to watch on Netflix. I love you more than pizza, and you know that's a lot!",
      ],
      poem: [
        "Happy Birthday {name}, my love,\nYou fit me like a glove.\nYou deal with all my crazy ways,\nThrough all my moods and lazy days.\nI love you more than words can say,\nEspecially on your special day!\nSo here's a kiss and here's some cake,\nYou're the best mistake I'll ever make! 😘",
      ],
      whatsapp: [
        "🎂❤️ Happy Birthday {name}!! 🥳💕 You're my favorite notification! 📱 Love you more than chocolate! 🍫😂 Here's to US! 🥂💑🎉",
      ],
    },
    Boss: {
      short: [
        "Happy Birthday {name}! Thanks for being a boss we don't complain about (much)!",
        "HBD {name}! May your birthday have fewer meetings than a Monday!",
        "Happy Birthday {name}! You make work almost enjoyable!",
      ],
      medium: [
        "Happy Birthday {name}! Thank you for being the kind of boss who leads by example (and by bringing donuts). May your birthday be as productive as your Monday morning meetings... actually, may it be way better than that!",
        "Wishing you a fantastic birthday, {name}! You've taught us that leadership can come with a sense of humor. Here's to a boss who deserves a raise in birthday wishes!",
      ],
      long: [
        "Dear {name}, Happy Birthday! They say a great boss inspires their team, and you inspire us daily - mostly to take longer lunch breaks, but also to do our best work! In all seriousness, your leadership style is the perfect blend of professionalism and approachability. You've created a workplace where we actually look forward to coming in (most days). Thank you for your guidance, patience, and for pretending not to notice when we're scrolling social media. Here's to celebrating you today. May your birthday be as exceptional as your leadership!",
      ],
      poem: [
        "Happy Birthday dear {name},\nOur boss of great acclaim,\nYou handle deadlines like a pro,\nAnd put our worries to shame.\nMay your birthday bonus be huge,\nYour cake be extra tall,\nYou're the leader of this crew,\nThe best boss of them all!",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name} Sir/Ma'am! 🎉 Wishing you a day with ZERO emails! 📧❌ You're the best boss ever! 🏆 Enjoy your day! 🥳🎁",
      ],
    },
    Colleague: {
      short: [
        "Happy Birthday {name}! You make 9-to-5 bearable!",
        "HBD {name}! May your birthday be longer than our lunch break!",
        "Happy Birthday {name}! My favorite coworker (don't tell the others)!",
      ],
      medium: [
        "Happy Birthday {name}! Working with you is like having a friend who also happens to know how to use the printer. You make meetings tolerable and deadlines less scary. Cheers to another year of surviving the office together!",
        "Happy Birthday to the colleague who makes work fun, {name}! From coffee breaks to brainstorming sessions, you bring positive energy to everything. May your birthday be as great as Friday afternoons!",
      ],
      long: [
        "Dear {name}, Happy Birthday! If I had to be stuck in an office for 8 hours a day, I'm glad it's with someone like you. You're the person who makes Monday mornings survivable, who always shares their snacks, and who never judges when I talk to my computer. From inside jokes during meetings to those life-saving coffee runs, you've turned coworkers into friends. Here's to celebrating the person who makes our workplace so much better. May your birthday be as awesome as that feeling when a meeting gets cancelled. Enjoy your day, you deserve it!",
      ],
      poem: [
        "Happy Birthday, {name} my friend,\nOn you I can always depend.\nFrom coffee runs to deadline stress,\nYou handle it all, I must confess.\nThe office shines when you are here,\nSo raise a glass, let's give a cheer!\nHappy Birthday, workmate dear!",
      ],
      whatsapp: [
        "🎂🎉 Happy Birthday {name}!! 🥳 The office MVP! 🏆 May your day have zero deadlines and unlimited cake! 🍰😂 Enjoy! 🎁🎈",
      ],
    },
    Child: {
      short: [
        "Happy Birthday {name}! You make every day an adventure!",
        "HBD {name}! My favorite little human turns a year older!",
        "Happy Birthday to the coolest kid, {name}!",
      ],
      medium: [
        "Happy Birthday {name}! Watching you grow is the greatest show on earth. You amaze me every day with your imagination and your ability to ask 'why' 500 times. Never stop being curious, kiddo! Your birthday is going to be epic!",
        "Happy Birthday to my little superstar, {name}! You fill our home with laughter, chaos, and way too many toy dinosaurs. Wouldn't change a thing! Let's eat ALL the cake today!",
      ],
      long: [
        "Dear {name}, Happy Birthday! It feels like yesterday you were a tiny bundle of joy, and now look at you - growing up so fast! You've turned our world upside down in the best possible way. From your infectious laughter to your creative interpretations of bedtime (which never seems to end), every moment with you is precious. You teach us more about life than any book ever could. Your curiosity, kindness, and that adorable face keep us going. Here's to another year of magic, mischief, and milestones. We love you to infinity and beyond, little one!",
      ],
      poem: [
        "Happy Birthday, little {name},\nToday's your special day!\nWith candles, cake, and lots of fun,\nIt's time to laugh and play.\nYou're growing up so very fast,\nA star that brightly shines,\nWe love you more than all the world,\nYou're one of a kind!",
      ],
      whatsapp: [
        "🎂🎈 Happy Birthday {name}!! 🥳🌟 Our little SUPERSTAR is growing up! 🦸 Cake time! 🍰 Presents time! 🎁 Party time! 🎉 We love you SO much!! ❤️❤️❤️",
      ],
    },
  },
  Emotional: {
    Friend: {
      short: [
        "Happy Birthday {name}. Having you in my life is the greatest gift.",
        "To {name}: You make the world brighter just by being in it. Happy Birthday.",
        "Happy Birthday {name}. Grateful for every moment with you.",
      ],
      medium: [
        "Happy Birthday {name}. There are friends, and then there are friends who become family. You are the latter. Through every high and low, you've stood by me without question. Today I celebrate not just your birthday, but the beautiful soul you are.",
        "Dear {name}, on your birthday I want you to know that your friendship has been one of the greatest blessings of my life. You've seen me at my worst and still chose to stay. That means everything. Happy Birthday, dear friend.",
      ],
      long: [
        "Dear {name}, Happy Birthday. As I sit down to write this, I'm overwhelmed with gratitude for having you in my life. True friendship is rare, and what we share is something I treasure deeply. You've been my strength when I was weak, my light in dark times, and my constant source of joy. Through every chapter of life, you've been the one person I could always count on. You've taught me what loyalty, compassion, and unconditional love look like. Today, on your birthday, I want you to know that you are valued, loved, and appreciated beyond words. Here's to many more years of this beautiful friendship. Happy Birthday, my dearest friend.",
      ],
      poem: [
        "Dear {name}, on this day you were born,\nA friendship so deep, so beautifully sworn.\nThrough laughter and tears, through sun and through rain,\nYou've been my joy, you've eased my pain.\nSo on your birthday, hear me say,\nYou light up my life in every way.\nHappy Birthday, friend so true,\nThe world is better because of you.",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name} 🥺❤️ Words can't express how much your friendship means to me. You've been my rock, my anchor, my everything. Grateful for you today and always. 🙏💕 Love you endlessly. 🌟🎁",
      ],
    },
    Parent: {
      short: [
        "Happy Birthday {name}. Everything I am is because of you.",
        "To my dearest {name}: You are my forever hero. Happy Birthday.",
        "Happy Birthday {name}. Your love shaped my entire world.",
      ],
      medium: [
        "Happy Birthday {name}. Every sacrifice you made, every sleepless night you endured, every dream you put aside for mine - I see it all now. You gave me the world without ever asking for anything in return. I love you more than words can express.",
        "Dear {name}, on your birthday I realize how blessed I am. You didn't just raise me, you gave me wings while keeping me grounded. Your love is the foundation of everything good in my life. Happy Birthday to my greatest blessing.",
      ],
      long: [
        "Dear {name}, Happy Birthday. Today I want to pour my heart out. Growing up, I may not have always said it, but I always felt it - your unconditional love wrapping around me like a warm blanket. You worked tirelessly so I could dream freely. You sacrificed your comfort for my happiness. You stayed awake so I could sleep peacefully. Now that I understand what true selfless love means, I realize it was you all along. You are my first teacher, my forever protector, and the reason I believe in goodness. Thank you for giving me life and making it beautiful. I promise to make you proud every single day. Happy Birthday. I love you beyond measure.",
      ],
      poem: [
        "Dear {name}, the day that you were born,\nThe universe was blessed that morn.\nYou gave me life, you gave me love,\nA gift sent from the stars above.\nYour gentle hands, your caring eyes,\nYour strength that never says goodbye.\nHappy Birthday, dearest one,\nMy love for you will never be done.",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name} ❤️🥺 You are the reason I am who I am today. Every good thing in my life traces back to your love and sacrifices. Thank you for EVERYTHING. 🙏 I love you more than you'll ever know. 💕🌹🎁",
      ],
    },
    Sibling: {
      short: [
        "Happy Birthday {name}. My first friend, my forever friend.",
        "To {name}: You're not just my sibling, you're my soulmate. Happy Birthday.",
        "Happy Birthday {name}. Home isn't a place, it's wherever you are.",
      ],
      medium: [
        "Happy Birthday {name}. From sharing a room to sharing our deepest secrets, you've been my constant companion in this journey called life. No matter where life takes us, you will always be my first best friend. I love you more than I'll ever admit out loud.",
        "Dear {name}, today I celebrate the person who has been with me through literally everything. You know my story because you've lived it with me. Happy Birthday to my forever person.",
      ],
      long: [
        "Dear {name}, Happy Birthday. Some bonds are chosen, but ours was destined. From the moment we shared our first home, you became more than a sibling - you became a piece of my heart that walks outside my body. We've fought, we've cried, we've laughed until we couldn't breathe. Through every phase of life, every storm and every sunshine, you've been there. You understand me in ways no one else can because you've seen my entire journey. Today, I want you to know that having you as my sibling is the greatest privilege of my life. I may not say it often, but I love you deeply, completely, and forever. Happy Birthday, my heart.",
      ],
      poem: [
        "Dear {name}, my sibling, my heart,\nWe've been together from the start.\nThrough childhood days of pure delight,\nTo holding each other through the night.\nYou are my mirror, my other half,\nMy partner in tears, my partner in laugh.\nHappy Birthday, forever mine,\nOur bond is sacred, our bond divine.",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name} ❤️🥺 My first friend, my forever person. No one knows me like you do. Through thick and thin, always and forever. I love you more than words. 💕🫂🎁",
      ],
    },
    Partner: {
      short: [
        "Happy Birthday {name}. You are my greatest love story.",
        "To {name}: Meeting you was fate. Loving you is my choice. Forever. Happy Birthday.",
        "Happy Birthday {name}. My heart recognized yours before my mind did.",
      ],
      medium: [
        "Happy Birthday {name}. Every day with you feels like a blessing I don't deserve but am eternally grateful for. You've turned my ordinary life into an extraordinary love story. You are my peace, my home, my everything. I love you beyond time.",
        "Dear {name}, on your birthday I want to tell you what I feel every single day - you are the best thing that ever happened to me. Your love has healed parts of me I didn't know were broken. Happy Birthday, my forever.",
      ],
      long: [
        "Dear {name}, Happy Birthday to the love of my life. Before you, I didn't know what it meant to be truly seen, truly understood, truly loved. You walked into my life and painted it with colors I never knew existed. You love me not despite my flaws but with them. You hold my hand through storms and dance with me in the rain. Every morning I wake up grateful that the universe led me to you. You are my safe place, my greatest adventure, and my forever home. On your birthday, I make this promise: I will love you louder, hold you tighter, and choose you every single day for the rest of my life. Happy Birthday, my heart.",
      ],
      poem: [
        "Dear {name}, my love, my light,\nYou turn my darkness into bright.\nBefore you came, I was half a song,\nWith you beside me, I am strong.\nYour smile, your touch, your gentle grace,\nMake this world a better place.\nHappy Birthday, my heart's delight,\nI'll love you beyond this life.",
      ],
      whatsapp: [
        "🎂❤️ Happy Birthday {name} 💕 You are my person. My heart. My home. Every love song makes sense because of you. 🥺💫 I love you today, tomorrow, and forever. 💍🌹🎁",
      ],
    },
    Boss: {
      short: [
        "Happy Birthday {name}. Your mentorship has changed my career and my life.",
        "To {name}: Thank you for believing in me. Happy Birthday.",
        "Happy Birthday {name}. Working under your guidance is a privilege I'm grateful for.",
      ],
      medium: [
        "Happy Birthday {name}. A great leader doesn't just manage a team - they inspire souls. You've done that for each one of us. Your belief in our potential has helped us discover strengths we didn't know we had. Thank you for being that leader. Wishing you a truly special day.",
        "Dear {name}, on your birthday, I want to express my heartfelt gratitude. You saw potential in me when I couldn't see it myself. Your guidance has been a beacon in my professional journey. Happy Birthday to a remarkable leader.",
      ],
      long: [
        "Dear {name}, Happy Birthday. I want to take this moment to express something I don't say enough. Working with you has been one of the most meaningful experiences of my career. You lead not with authority but with empathy. You don't just assign tasks - you nurture talent. Every piece of advice, every word of encouragement, and every moment of patience has shaped me into a better professional and a better person. You've created not just a team but a family. On your birthday, I want you to know that your impact goes far beyond the office. You've touched lives, including mine. Thank you for everything. Wishing you a birthday filled with the same joy you bring to all of us.",
      ],
      poem: [
        "Dear {name}, on this special day,\nGratitude is all I can say.\nYou led with heart, you led with grace,\nAnd made our work a better place.\nYour wisdom lights our darkest hour,\nYour kindness is your greatest power.\nHappy Birthday, leader true,\nWe are blessed because of you.",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name} 🙏❤️ Thank you for being more than a boss - you're a mentor, a guide, and an inspiration. Your leadership has truly made a difference in my life. 💫 Wishing you all the happiness! 🎁🌟",
      ],
    },
    Colleague: {
      short: [
        "Happy Birthday {name}. You make work meaningful.",
        "To {name}: Grateful our paths crossed. Happy Birthday.",
        "Happy Birthday {name}. The office is brighter because of you.",
      ],
      medium: [
        "Happy Birthday {name}. What started as a professional acquaintance has grown into a friendship I truly value. You've been more than a colleague - you've been a support system, a sounding board, and a genuine friend. Grateful for you today and always.",
        "Dear {name}, your positive energy, your willingness to help, and your kind heart make our workplace special. On your birthday, I want you to know how much you're appreciated. Happy Birthday, friend.",
      ],
      long: [
        "Dear {name}, Happy Birthday. They say you don't choose your colleagues, but if I could, I'd choose you every single time. From day one, your warmth and kindness stood out. You've helped me through challenging projects, celebrated my wins, and lifted me during setbacks. What makes you special is not just your professional excellence but the genuine care you show for everyone around you. You've turned a workplace into a community. On your birthday, I want you to know that you are valued not just for what you do but for who you are. Here's to celebrating you today. Happy Birthday, dear friend.",
      ],
      poem: [
        "Happy Birthday, dear {name},\nMore than colleagues, we became\nFriends who share both joy and strain,\nSunshine mixed with gentle rain.\nYour kindness brightens every day,\nIn the most beautiful way.\nHappy Birthday, friend so dear,\nGrateful that you're always here.",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name} ❤️ You're so much more than just a colleague - you're a true friend. Thank you for every smile, every word of support, and every shared moment. 🙏💕 You're truly special. 🌟🎁",
      ],
    },
    Child: {
      short: [
        "Happy Birthday {name}. You are my entire world.",
        "To my precious {name}: You are the answer to every prayer. Happy Birthday.",
        "Happy Birthday {name}. Loving you is the best thing I've ever done.",
      ],
      medium: [
        "Happy Birthday {name}. From the first moment I held you, I knew my heart would never be the same. You filled a space I didn't know was empty. Watching you grow is the greatest privilege of my life. I love you more than all the stars in the sky.",
        "Dear {name}, every birthday of yours feels like a celebration of the most beautiful gift life gave me - you. You are my sunshine, my reason, my everything. Happy Birthday, my precious child.",
      ],
      long: [
        "Dear {name}, Happy Birthday my little miracle. The day you came into this world, you didn't just begin your life - you gave mine its deepest meaning. Every smile of yours heals my tired soul. Every laugh of yours is my favorite melody. Watching you grow, learn, and discover the world fills me with a love so powerful it brings tears to my eyes. You are braver than you believe, smarter than you think, and loved more than you'll ever know. I promise to always be your safe place, your biggest fan, and your forever protector. May this birthday and every day that follows be filled with magic and wonder. Happy Birthday, my heart. I love you infinity times infinity.",
      ],
      poem: [
        "Dear {name}, my precious one,\nMy moon, my stars, my shining sun.\nThe day that you came to be,\nYou gave this life its meaning to me.\nYour tiny hands, your sparkling eyes,\nAre all the world beneath the skies.\nHappy Birthday, angel mine,\nYou are my most sacred sign.",
      ],
      whatsapp: [
        "🎂 Happy Birthday my baby {name} 🥺❤️ You are my world, my everything, my reason to smile. 🌟 From the moment I held you, I knew love had no limit. 💕 Happy Birthday, my precious angel. Mama/Papa loves you FOREVER. 🫂💫🎁",
      ],
    },
  },
  Formal: {
    Friend: {
      short: [
        "Wishing you a very Happy Birthday, {name}. May this year bring you great success.",
        "Happy Birthday, {name}. Wishing you good health and prosperity.",
        "Many happy returns of the day, {name}. May all your endeavors flourish.",
      ],
      medium: [
        "Dear {name}, warmest wishes on your birthday. May this new year of your life be filled with opportunities, achievements, and moments of genuine happiness. You are a person of remarkable character, and I wish you every success. Happy Birthday.",
        "Happy Birthday, {name}. On this special occasion, I extend my sincere wishes for your health, happiness, and continued success. May the year ahead bring you fulfillment in all your pursuits.",
      ],
      long: [
        "Dear {name}, on the occasion of your birthday, I would like to extend my warmest and most sincere wishes. Over the years, your friendship has been a source of great joy and enrichment in my life. Your integrity, dedication, and compassionate nature are qualities I deeply admire. As you celebrate another milestone, I wish you continued success in your professional endeavors, robust health, and enduring happiness in your personal life. May this birthday mark the beginning of an exceptional year filled with new achievements and cherished memories. Warmest regards and happy birthday.",
      ],
      poem: [
        "On this distinguished day, dear {name},\nI send my wishes with great aim.\nMay fortune smile upon your way,\nAnd blessings grace your every day.\nWith health and joy and wisdom true,\nMay all good things come back to you.\nHappy Birthday, esteemed friend,\nMay your happiness never end.",
      ],
      whatsapp: [
        "Dear {name}, wishing you a very Happy Birthday. May this year bring you abundant success, good health, and happiness. Warm regards. 🎂🎁",
      ],
    },
    Parent: {
      short: [
        "Wishing you a blessed and Happy Birthday, dear {name}.",
        "Happy Birthday, {name}. Your guidance and love are my greatest treasures.",
        "Many happy returns, {name}. Your legacy of love inspires me daily.",
      ],
      medium: [
        "Dear {name}, on your birthday, I wish to express my deepest respect and gratitude for everything you have done for our family. Your wisdom, strength, and unconditional love have been the foundation of my life. Wishing you excellent health and happiness. Happy Birthday.",
        "Happy Birthday, {name}. Your selfless devotion and tireless efforts have shaped me into the person I am today. On this special day, I extend my heartfelt wishes for your good health, peace, and every happiness you so richly deserve.",
      ],
      long: [
        "Dear {name}, on the occasion of your birthday, I wish to convey my deepest appreciation and love. Throughout my life, you have been the embodiment of strength, wisdom, and unconditional love. Your sacrifices have not gone unnoticed, and your teachings continue to guide me in every decision I make. The values you instilled in me are the compass by which I navigate life. On this special day, I pray for your excellent health, lasting happiness, and peace of mind. You deserve all the beautiful things this world has to offer. Thank you for being the extraordinary person you are. Wishing you a very Happy Birthday with utmost respect and love.",
      ],
      poem: [
        "Respected {name}, on your day,\nWith reverence, these words I say:\nYour wisdom guides, your love protects,\nYour sacrifice, none can neglect.\nMay health and peace be ever near,\nMay joy surround you through the year.\nHappy Birthday, honored one,\nGrateful for all that you have done.",
      ],
      whatsapp: [
        "Dear {name}, wishing you a very Happy Birthday. Your guidance, love, and sacrifices mean the world to me. May this year bring you excellent health, peace, and happiness. With love and respect. 🎂🙏🎁",
      ],
    },
    Sibling: {
      short: [
        "Wishing you a wonderful birthday, dear {name}.",
        "Happy Birthday, {name}. May this year be your best yet.",
        "Many happy returns of the day, {name}. You deserve all the best.",
      ],
      medium: [
        "Dear {name}, warmest birthday wishes to you. Having you as a sibling has been one of life's greatest blessings. Your support and companionship mean more to me than words can express. Wishing you a year filled with success and joy.",
        "Happy Birthday, {name}. On this special day, I want to acknowledge what an incredible sibling you are. Your strength, kindness, and unwavering support have been invaluable. May this year bring you everything you deserve.",
      ],
      long: [
        "Dear {name}, on your birthday, I want to express how truly fortunate I feel to have you as my sibling. Our shared history is woven with countless memories that I hold dear to my heart. Your character, resilience, and compassion continue to inspire me. As you embark on another year of life, I wish you robust health, professional achievement, and personal fulfillment. May the bond we share continue to strengthen with each passing year. You are an extraordinary individual, and I am proud to call you my sibling. Wishing you a truly memorable and Happy Birthday.",
      ],
      poem: [
        "Dear {name}, esteemed and dear,\nAnother birthday, another year.\nWith grace you walk through life's grand hall,\nStanding proud, standing tall.\nMay blessings shower on your way,\nNot just today, but every day.\nHappy Birthday, sibling mine,\nMay your star forever shine.",
      ],
      whatsapp: [
        "Dear {name}, wishing you a very Happy Birthday. May this new year bring you success, happiness, and good health. Proud to have you as my sibling. Warm wishes. 🎂🎁",
      ],
    },
    Partner: {
      short: [
        "Happy Birthday, my dearest {name}. You are my greatest blessing.",
        "Wishing you a beautiful birthday, {name}. With all my love and admiration.",
        "Many happy returns, {name}. May our journey together continue to flourish.",
      ],
      medium: [
        "Dear {name}, on your birthday, I wish to express my profound gratitude for your love and companionship. You have enriched my life in ways I could never have imagined. Wishing you a year of health, happiness, and all the beautiful things you deserve. Happy Birthday, with all my love.",
        "Happy Birthday, {name}. Your presence in my life is a gift I cherish every day. On this occasion, I extend my deepest wishes for your well-being, success, and continued happiness. May we share many more beautiful years together.",
      ],
      long: [
        "Dear {name}, on the occasion of your birthday, I wish to express the depth of my love and admiration for you. You have been my steadfast companion, my confidant, and my greatest source of strength. Your grace, kindness, and unwavering support have transformed my life in the most beautiful way. As you celebrate this milestone, I want you to know that my commitment to our journey together only grows stronger with each passing day. I wish you excellent health, boundless joy, and the fulfillment of every dream you hold dear. Thank you for choosing to share your life with me. Wishing you a truly wonderful Happy Birthday, with all my love and devotion.",
      ],
      poem: [
        "Beloved {name}, on your day,\nThese heartfelt words I wish to say:\nYour love has been my guiding star,\nThe finest gift, by near and far.\nWith dignity and grace you shine,\nI'm honored that your heart is mine.\nHappy Birthday, dearest love,\nA blessing sent from high above.",
      ],
      whatsapp: [
        "Dearest {name}, wishing you a very Happy Birthday. Your love and companionship are my greatest treasures. May this year bring you everything your heart desires. With all my love and admiration. 🎂❤️🎁",
      ],
    },
    Boss: {
      short: [
        "Wishing you a very Happy Birthday, {name}. Your leadership inspires us all.",
        "Happy Birthday, {name}. Thank you for your exemplary guidance.",
        "Many happy returns of the day, {name}. Wishing you continued success.",
      ],
      medium: [
        "Dear {name}, on behalf of the team, I extend our warmest birthday wishes. Your visionary leadership, professional integrity, and commitment to excellence have set a standard we all aspire to. May this year bring you continued success and personal fulfillment. Happy Birthday.",
        "Happy Birthday, {name}. Your guidance and mentorship have been instrumental in our professional growth. On this special occasion, we wish you good health, prosperity, and every happiness. Thank you for being an exceptional leader.",
      ],
      long: [
        "Dear {name}, on the occasion of your birthday, I wish to express my sincere appreciation for your outstanding leadership. Your ability to inspire, mentor, and guide our team has created an environment of growth and excellence. Your professional acumen, combined with your genuine concern for each team member's development, makes you a truly exceptional leader. As you celebrate this special day, please know that your contributions are deeply valued and recognized. On behalf of the entire team, we wish you a year of remarkable achievements, excellent health, and abundant happiness. Happy Birthday, and thank you for everything.",
      ],
      poem: [
        "Distinguished {name}, on this day,\nOur highest regards we convey.\nYour leadership lights the way ahead,\nWith wisdom in each word you've said.\nMay success and health be yours to claim,\nMay glory follow after your name.\nHappy Birthday, honored leader,\nA mentor and a true succeeder.",
      ],
      whatsapp: [
        "Dear {name}, on behalf of the team, warmest birthday wishes. Your leadership and guidance inspire us daily. Wishing you excellent health, success, and a wonderful year ahead. Happy Birthday. 🎂🎁",
      ],
    },
    Colleague: {
      short: [
        "Wishing you a Happy Birthday, {name}. A pleasure working with you.",
        "Happy Birthday, {name}. Your professionalism is truly admirable.",
        "Many happy returns, {name}. Wishing you continued career success.",
      ],
      medium: [
        "Dear {name}, warmest birthday wishes on your special day. Your dedication, professionalism, and positive attitude make you an invaluable member of our team. May this year bring you new opportunities for growth and success. Happy Birthday.",
        "Happy Birthday, {name}. Working alongside you has been both a pleasure and a learning experience. Your work ethic and collaborative spirit are truly commendable. Wishing you all the best on your special day and in the year ahead.",
      ],
      long: [
        "Dear {name}, on the occasion of your birthday, I want to take a moment to acknowledge your exceptional contributions to our team. Your professionalism, dedication, and willingness to go above and beyond have not gone unnoticed. You bring both competence and warmth to our workplace, creating an environment where collaboration thrives. As you celebrate this milestone, I wish you continued professional growth, personal fulfillment, and abundant happiness. May the coming year present you with exciting opportunities and rewarding experiences. Happy Birthday, and here's to another year of working together.",
      ],
      poem: [
        "Dear {name}, on your birthday bright,\nYour colleagues wish you pure delight.\nYour dedication sets the pace,\nYour kindness lights up every space.\nMay fortune favor all you do,\nMay every dream of yours come true.\nHappy Birthday, valued friend,\nMay success on you attend.",
      ],
      whatsapp: [
        "Dear {name}, wishing you a very Happy Birthday. Your dedication and positive spirit are truly appreciated. Wishing you a wonderful year of success and happiness ahead. Best regards. 🎂🎁",
      ],
    },
    Child: {
      short: [
        "Happy Birthday, dear {name}. You fill our lives with immeasurable joy.",
        "Wishing you a wonderful birthday, {name}. May your dreams take flight.",
        "Many happy returns, dear {name}. The world awaits your brilliance.",
      ],
      medium: [
        "Dear {name}, on your birthday, we celebrate the wonderful person you are becoming. Your curiosity, kindness, and bright spirit bring immense joy to our lives. May this year be filled with learning, laughter, and beautiful experiences. Happy Birthday, dear child.",
        "Happy Birthday, {name}. Each year we watch you grow brings new reasons to be proud. Your potential is limitless, and your heart is pure. May this birthday mark the beginning of another wonderful chapter. With all our love.",
      ],
      long: [
        "Dear {name}, on this special birthday, we want you to know how incredibly proud we are of the person you are becoming. Each day you demonstrate qualities of kindness, curiosity, and resilience that fill our hearts with joy. As you grow older, remember that the world is full of wonderful possibilities waiting just for you. May this birthday bring you happiness, may the coming year bring you growth, and may you always know that you are loved unconditionally. We believe in you and your ability to achieve everything you set your mind to. Happy Birthday, our dear child. The best is yet to come.",
      ],
      poem: [
        "Dear {name}, precious and bright,\nYou are our joy, our delight.\nOn this day you came to be,\nThe greatest gift for all to see.\nMay your path be paved with gold,\nMay your story grandly unfold.\nHappy Birthday, dear child of mine,\nMay your star forever shine.",
      ],
      whatsapp: [
        "Dear {name}, wishing you a very Happy Birthday. You bring immeasurable joy and pride to our lives. May this year be filled with wonderful experiences and beautiful memories. With all our love. 🎂🌟🎁",
      ],
    },
  },
  Casual: {
    Friend: {
      short: [
        "HBD {name}! Let's celebrate!",
        "Happy Birthday {name}! Party time, baby!",
        "Yo {name}! Happy Birthday, legend!",
      ],
      medium: [
        "Hey {name}! Happy Birthday! Hope your day is filled with good vibes, great food, and even better company. You deserve all the good things. Let's hang soon and celebrate properly!",
        "Happy Birthday {name}! Can't believe another year has flown by. Here's to more adventures, more laughs, and more memories together. Have the best day ever, you deserve it!",
      ],
      long: [
        "Hey {name}! Happy Birthday! Dude, another year and we're still going strong. That's pretty awesome if you ask me. From random road trips to those late-night conversations about nothing and everything, life is just better with you around. You bring good energy wherever you go, and I'm lucky to call you my friend. So today, forget about everything else and just enjoy YOUR day. Eat way too much cake, open some cool presents, and know that you've got a friend who thinks you're absolutely awesome. Happy Birthday, mate! Here's to another amazing year!",
      ],
      poem: [
        "Hey {name}, it's your big day,\nSo here's what I gotta say -\nYou're cool, you're fun, you're rad,\nThe best friend I've ever had.\nSo grab some cake, grab some fun,\nYour birthday has just begun!\nHappy Birthday, you rock,\nLet's party round the clock!",
      ],
      whatsapp: [
        "🎂 Yooo {name}!! Happy Birthday!! 🎉🥳 Let's goooo! 🔥 Party mode ON! 🎈 Have the BEST day! 🍕🍰 Love ya! ✌️❤️",
      ],
    },
    Parent: {
      short: [
        "Happy Birthday {name}! Love you loads!",
        "HBD {name}! Best parent award goes to you!",
        "Happy Birthday {name}! Time to spoil you today!",
      ],
      medium: [
        "Happy Birthday {name}! You're literally the coolest parent. Thanks for always being there, putting up with my drama, and still loving me through it all. Today is YOUR day, so relax and let us take care of everything!",
        "Hey {name}, Happy Birthday! I know I don't say it enough, but you're amazing. Like, genuinely amazing. Thanks for everything. Now let's cut that cake!",
      ],
      long: [
        "Hey {name}, Happy Birthday! So I was thinking about all the times you've been there for me, and honestly, the list is way too long. From packing my lunch to giving me life advice at midnight, you've done it all. You're not just my parent, you're like my superhero (but with better cooking skills). Today, I want you to kick back, relax, and let yourself be celebrated. No chores, no cooking, no worrying about anyone else. Just enjoy being you, because you are pretty awesome. Happy Birthday! Love you more than pizza, and that's saying something!",
      ],
      poem: [
        "Hey {name}, happy birthday to you,\nThe coolest parent, through and through.\nYou packed my lunch, you drove me around,\nThe best parent anyone's found.\nSo here's some cake and lots of love,\nYou're a gift from stars above.\nHappy Birthday, you're the best,\nNow please sit down and take a rest!",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name}!! 🎉 Best parent EVER! 🏆 Love you so much! ❤️ Today = YOUR day! No cooking, no chores! 😎 Let's celebrate! 🥳🎁🍰",
      ],
    },
    Sibling: {
      short: [
        "HBD {name}! My ride-or-die since day one!",
        "Happy Birthday {name}! Still the better sibling... maybe!",
        "Yo {name}! Happy Birthday, fam!",
      ],
      medium: [
        "Happy Birthday {name}! Life with you has been one wild ride. From sibling fights to being each other's biggest supporters, we've done it all. Here's to another year of being awesome together. Love you!",
        "Hey {name}, Happy Birthday! You know what's cool? No matter what happens, we'll always have each other's backs. That's the sibling code. Now let's eat way too much cake!",
      ],
      long: [
        "Hey {name}! Happy Birthday to my favorite human (don't tell anyone else I said that). Growing up with you was honestly the best. Sure, we had our moments of wanting to throw each other out the window, but we also had the best times. Remember those late-night giggle sessions when we were supposed to be sleeping? Or how we'd team up whenever we were in trouble? Good times, man. You're more than just a sibling to me, you're my person. So today, let's celebrate YOU. Have an amazing birthday, eat all the cake, and know that your sibling thinks you're pretty cool. Love ya!",
      ],
      poem: [
        "Hey {name}, it's your day, yay!\nHere's what your sibling has to say:\nWe've shared snacks and shared fights,\nShared secrets on late nights.\nYou're my buddy, you're my crew,\nNobody's cooler than you.\nHappy Birthday, fam for life,\nThrough the fun and through the strife!",
      ],
      whatsapp: [
        "🎂 HBD {name}!! 🎉 Fam forever! 👊 From fighting over the remote to being besties! 😂❤️ Love you! Let's party! 🥳🎈🎁",
      ],
    },
    Partner: {
      short: [
        "Happy Birthday babe! {name}, you're my whole heart!",
        "HBD {name}! My favorite human on the planet!",
        "Happy Birthday {name}! Lucky me, lucky you, lucky us!",
      ],
      medium: [
        "Happy Birthday {name}! Life with you is never boring, always fun, and filled with love. You're my person, my go-to, my everything. Let's make today all about you (and cake, obviously). Love you to bits!",
        "Hey {name}, Happy Birthday! Thank you for being the amazing human you are. Every day with you is a good day. Here's to another year of us being the cutest couple around. Love you loads!",
      ],
      long: [
        "Hey {name}! Happy Birthday to my favorite person! Can I just say how lucky I am to have you? Like, seriously. You make me laugh every single day, you put up with my weird habits, and you still manage to look at me like I'm the best thing ever. That takes talent. Thank you for being my partner, my best friend, and my rock. Today, I want to spoil you rotten because you deserve it. Let's do whatever makes you happy - whether that's a fancy dinner or pizza on the couch in our PJs. Either way, as long as I'm with you, it's perfect. Happy Birthday, love! Here's to a million more together!",
      ],
      poem: [
        "Hey {name}, babe, it's your day,\nAnd I've got some things to say.\nYou're my vibe, you're my crew,\nEvery day I choose you.\nSo let's eat cake and have some fun,\nYou and me, we've just begun.\nHappy Birthday, love of mine,\nTogether we're doing just fine!",
      ],
      whatsapp: [
        "🎂❤️ Happy Birthday {name}!! 💕 My person! My favorite! My everything! 🥰 Let's celebrate YOU today! 🥳🍕🎉 Love you infinity! 💫🎁",
      ],
    },
    Boss: {
      short: [
        "Happy Birthday {name}! Hope it's a great one!",
        "HBD {name}! Enjoy your special day!",
        "Happy Birthday {name}! You're an awesome leader!",
      ],
      medium: [
        "Happy Birthday {name}! Thanks for being such a cool boss. You make work genuinely enjoyable and your team appreciates you more than you know. Hope your day is amazing! Enjoy every moment!",
        "Hey {name}, Happy Birthday! Just wanted to say you're one of the good ones. Thanks for always being fair, supportive, and approachable. Have a wonderful birthday!",
      ],
      long: [
        "Hey {name}, Happy Birthday! I just wanted to take a sec to say that working with you has been really great. You're the kind of boss that people actually want to work for, and that's rare. You keep things real, you've got our backs, and you make the workplace a genuinely good place to be. So today, forget about work stuff and just enjoy your birthday. You've earned it. Hope your day is filled with good food, good people, and zero emails. Happy Birthday, boss!",
      ],
      poem: [
        "Happy Birthday, {name}, our boss,\nWithout you, we'd be at a loss.\nYou keep it real, you keep it cool,\nLeading the team like a pro, not a fool.\nSo here's to you on your big day,\nHip hip hooray, we all say!\nHappy Birthday, enjoy the ride,\nWe've got you, we're on your side!",
      ],
      whatsapp: [
        "🎂 Happy Birthday {name}! 🎉 You're honestly the best boss! 🏆 Hope your day is awesome! No work talk today! 😂 Enjoy! 🥳🎁",
      ],
    },
    Colleague: {
      short: [
        "HBD {name}! Work bestie for the win!",
        "Happy Birthday {name}! Office isn't the same without you!",
        "Yo {name}! Happy Birthday, work fam!",
      ],
      medium: [
        "Happy Birthday {name}! Honestly, you make work so much better. From our coffee breaks to our random chats, you're the best work buddy anyone could ask for. Have an awesome birthday! Let's celebrate soon!",
        "Hey {name}, Happy Birthday! Thanks for being the person who makes meetings bearable and Mondays survivable. You're the real MVP. Enjoy your day!",
      ],
      long: [
        "Hey {name}! Happy Birthday! Can I just say that work would be SO boring without you? You're the person everyone wants to sit next to in meetings, the one who always has snacks, and the one who makes even the worst work days somehow okay. You've been more than just a colleague to me, you're a genuine friend. So today, forget the deadlines and the to-do lists. It's YOUR day. Go celebrate, have fun, and come back tomorrow with leftover cake for the rest of us. Happy Birthday, buddy!",
      ],
      poem: [
        "Hey {name}, it's your day today,\nYour work buddy has things to say.\nYou make the office feel like fun,\nYou're our favorite, number one.\nSo grab some cake and take a break,\nCelebrate, for goodness sake!\nHappy Birthday, office star,\nYou're awesome just the way you are!",
      ],
      whatsapp: [
        "🎂 HBD {name}!! 🎉 Best work buddy EVER! 🏆 Meetings are only fun when you're there! 😂 Have an amazing day! 🥳🎈🎁",
      ],
    },
    Child: {
      short: [
        "Happy Birthday {name}! Let the fun begin!",
        "HBD {name}! Ready for the best day ever?!",
        "Happy Birthday little rockstar {name}!",
      ],
      medium: [
        "Happy Birthday {name}! You're growing up so fast and getting more amazing every day. Today is all about you! Let's have the best celebration ever with tons of cake, games, and fun. Love you, kiddo!",
        "Hey {name}, Happy Birthday! Being your parent is literally the coolest thing ever. You make every day an adventure. Now let's party! Your day, your rules!",
      ],
      long: [
        "Hey {name}! HAPPY BIRTHDAY!! Can you believe it? You're another year older and even more awesome! I swear, you get cooler every single year. Watching you grow, learn new things, and just be your amazing self is the best part of my life. You make me laugh, you make me proud, and you make even the boring days exciting. Today is ALL about you, kiddo. Whatever you want to do, wherever you want to go, whatever cake you want to eat - let's do it! Because you deserve the absolute best. Happy Birthday, my little superstar! Let's make this the best birthday yet!",
      ],
      poem: [
        "Happy Birthday, {name}, hooray!\nIt's your super special day!\nCake and candles, gifts galore,\nGames and fun and so much more!\nYou're growing up, you're shining bright,\nOur little star, our pure delight.\nHappy Birthday, kiddo mine,\nReady? Set? It's party time!",
      ],
      whatsapp: [
        "🎂🎈 HAPPY BIRTHDAY {name}!! 🥳🌟 Our little SUPERSTAR! 🦸 Cake time! 🍰 Game time! 🎮 Party time! 🎉 BEST DAY EVER!! ❤️🎁🎊",
      ],
    },
  },
};

export default function AiBirthdayWishGenerator() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("Friend");
  const [tone, setTone] = useState<Tone>("Funny");
  const [results, setResults] = useState<{ label: string; text: string }[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [seed, setSeed] = useState(0);

  const generate = () => {
    if (!name.trim()) return;
    const t = wishTemplates[tone][relationship];
    const s = seed % Math.max(t.short.length, t.medium.length, t.long.length, t.poem.length, t.whatsapp.length);
    const fill = (txt: string) => txt.replace(/\{name\}/g, name.trim());
    setResults([
      { label: "Short (1 line)", text: fill(t.short[s % t.short.length]) },
      { label: "Medium (2-3 lines)", text: fill(t.medium[s % t.medium.length]) },
      { label: "Long (Paragraph)", text: fill(t.long[s % t.long.length]) },
      { label: "Poem Style", text: fill(t.poem[s % t.poem.length]) },
      { label: "WhatsApp Ready", text: fill(t.whatsapp[s % t.whatsapp.length]) },
    ]);
    setSeed((p) => p + 1);
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(results[idx].text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const relationships: Relationship[] = ["Friend", "Parent", "Sibling", "Partner", "Boss", "Colleague", "Child"];
  const tones: Tone[] = ["Funny", "Emotional", "Formal", "Casual"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Recipient Name</label>
        <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Relationship</label>
        <div className="flex gap-2 flex-wrap">
          {relationships.map((r) => (
            <button key={r} onClick={() => setRelationship(r)} className={r === relationship ? "btn-primary" : "btn-secondary"}>{r}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
        <div className="flex gap-2 flex-wrap">
          {tones.map((t) => (
            <button key={t} onClick={() => setTone(t)} className={t === tone ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Birthday Wishes</button>
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="result-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600">{r.label}</span>
                <button onClick={() => copy(i)} className="text-xs text-indigo-600 font-medium hover:underline">{copiedIdx === i ? "Copied!" : "Copy"}</button>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
