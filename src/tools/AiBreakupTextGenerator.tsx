"use client";
import { useState } from "react";

type BreakupTone = "Kind" | "Direct" | "Humorous" | "Mature";
type Reason = "Growing apart" | "Different goals" | "Distance" | "Other";

const templates: Record<BreakupTone, Record<Reason, { text: string[]; letter: string[]; email: string[] }>> = {
  Kind: {
    "Growing apart": {
      text: [
        "Hey {name}, I care about you deeply, and that's exactly why I need to be honest. I feel like we've been growing in different directions lately, and I think it's time we acknowledge that. You deserve someone whose path aligns with yours. I'll always cherish what we had.",
        "Hi {name}, this is really hard for me to say, but I think we've slowly drifted apart. It's nobody's fault - sometimes people just grow in different ways. I want you to be happy, even if that means our paths separate. You'll always hold a special place in my heart.",
      ],
      letter: [
        "Dear {name},\n\nI've been thinking a lot about us lately, and I want to be completely honest with you because you deserve nothing less. Over the past while, I've noticed that we've been slowly growing apart. Our conversations feel different, our interests are diverging, and I think we both feel it.\n\nThis isn't about blame - you haven't done anything wrong. Sometimes two good people simply grow in different directions, and that's okay. What we shared was real and beautiful, and I will always treasure those memories.\n\nI think the kindest thing I can do for both of us is to acknowledge this truth rather than let us fade away. You are an incredible person, and you deserve someone who is growing alongside you, not away from you.\n\nI hope you know that I genuinely care about you and wish you nothing but happiness.\n\nWith love and respect,\nAlways",
      ],
      email: [
        "Subject: Something I need to share with you\n\nDear {name},\n\nI hope you're doing well. I've been reflecting on our relationship for some time now, and I feel I owe you an honest conversation, even though this is incredibly difficult for me.\n\nI've come to realize that we've been gradually growing apart. It's something I've tried to ignore, hoping things would shift back to how they were, but I think we both know deep down that our paths have been diverging. The things that once brought us together don't seem to connect us the way they used to.\n\nPlease know this reflection isn't about finding fault. You are a wonderful person with so many beautiful qualities. But I believe continuing when my heart isn't fully present would be unfair to you. You deserve someone who is completely invested in growing with you.\n\nI will always look back on our time together with warmth and gratitude. The memories we've created are ones I'll carry with me always.\n\nI truly hope we can both find peace with this and eventually look back with fondness rather than sadness. You deserve all the happiness in the world.\n\nWith sincerity and care,\nTake care of yourself",
      ],
    },
    "Different goals": {
      text: [
        "Hey {name}, I need to be honest about something. I've realized our life goals are taking us in really different directions, and I don't think either of us should compromise our dreams. You're amazing, and I want you to chase everything you deserve.",
        "{name}, this is tough but I care about you too much to not be truthful. We want different things in life, and I think the most loving thing is to let each other pursue those dreams freely. You'll always matter to me.",
      ],
      letter: [
        "Dear {name},\n\nWriting this letter is one of the hardest things I've ever had to do, but I believe you deserve my honesty more than my silence.\n\nAs I look at where our lives are heading, I see two beautiful but very different paths. We want different things - different futures, different goals, different versions of happiness. And while I've tried to imagine a compromise that works for both of us, I realize that asking either of us to give up our dreams wouldn't be fair.\n\nYou have incredible ambitions, and I want you to pursue every single one of them without holding back. I care about you deeply, which is exactly why I can't be the reason you don't follow your heart.\n\nOur time together has taught me so much about love, about life, and about myself. Those lessons are gifts I'll carry forever.\n\nI hope you understand that this comes from a place of love, not from a lack of it. I wish you every success and every happiness.\n\nWith all my love,\nAlways rooting for you",
      ],
      email: [
        "Subject: An honest conversation we need to have\n\nDear {name},\n\nI've spent a lot of time thinking about this, and I believe the most respectful thing I can do is be completely transparent with you.\n\nOver time, it's become clear to me that our life goals and visions for the future are fundamentally different. We both have dreams and aspirations that we're passionate about, but these dreams seem to pull us in different directions. I've wrestled with this reality for a while, hoping we'd naturally align, but I think we both deserve to pursue our paths wholeheartedly.\n\nThis decision comes from a place of deep care and respect for you. You are an extraordinary person with so much potential, and I would never want to be an obstacle to your growth or happiness. Similarly, I need to be true to my own path.\n\nI'm incredibly grateful for everything we've shared. You've had a profound impact on my life, and I will always cherish our time together.\n\nI hope that with time, we can both look back on this with understanding and maybe even gratitude for the honesty. You deserve someone whose dreams perfectly complement yours.\n\nWishing you all the best on your journey,\nTake care",
      ],
    },
    "Distance": {
      text: [
        "Hey {name}, the distance between us has become more than just miles - it's affecting our connection. I care about you so much, but I think we both deserve to be with someone who can be there fully. I'm sorry. You mean a lot to me.",
        "{name}, I've been struggling with this for a while. The distance is taking its toll on both of us, and I don't want us to slowly fade into something that makes us both unhappy. You deserve someone who can be present. I'll always care about you.",
      ],
      letter: [
        "Dear {name},\n\nThis is perhaps the most difficult letter I've ever written, and I've started and restarted it more times than I can count.\n\nThe distance between us has been weighing on my heart. Despite our best efforts, I feel like we're losing the closeness that made us special. The phone calls and texts, while precious, can't replace the warmth of being together, and I've watched our connection slowly change in ways that break my heart.\n\nI don't want us to reach a point where frustration and loneliness overshadow the love we share. You deserve someone who can be there - really, truly there - for you. And so do I.\n\nPlease know that this isn't about loving you less. If anything, it's because I love you that I'm being honest about what I feel. Our memories together are some of the most beautiful chapters of my life.\n\nI hope that wherever life takes you, you find someone wonderful who can give you the presence and closeness you deserve.\n\nWith a heavy but honest heart,\nAlways caring",
      ],
      email: [
        "Subject: Something important I need to share\n\nDear {name},\n\nI want to start by saying that writing this is incredibly painful, and I've thought long and hard before putting these words down.\n\nThe physical distance between us has created an emotional distance that I can no longer ignore. We started this long-distance chapter with hope and determination, but the reality has been harder than either of us anticipated. The missed calls, the time zone challenges, the inability to be there for each other's daily moments - it's all taking a toll that I can't pretend isn't happening.\n\nI've asked myself whether I'm being patient enough, whether I'm trying hard enough. But I think the most honest thing I can tell you is that I believe we both need and deserve someone who can be physically present in our lives.\n\nThis comes from a place of genuine care and love. You are an incredible person, and our relationship has been one of the most meaningful experiences of my life. I don't want the beauty of what we had to be slowly eroded by the challenges of distance.\n\nI hope you can understand where I'm coming from, and I hope this honesty, though painful, is received with the love it's intended.\n\nWith deep affection and sincerity,\nThinking of you always",
      ],
    },
    "Other": {
      text: [
        "Hey {name}, I've been doing a lot of soul-searching, and I need to be honest. I've realized that we're not bringing out the best in each other anymore, and I think it's time for us both to move on. You're a wonderful person, and I wish you all the happiness.",
        "{name}, this is really hard, but I care about you too much to keep going when my heart isn't fully in it. You deserve someone who's all in, and I owe you that honesty. Thank you for everything we shared.",
      ],
      letter: [
        "Dear {name},\n\nI want you to know that writing this comes from a place of deep respect and care for you. I've spent considerable time reflecting on our relationship, and I've come to a difficult conclusion.\n\nI believe we've reached a point where continuing together isn't serving either of us well. This isn't about blame or fault - relationships are complex, and sometimes two good people simply aren't right for each other in the way they need to be.\n\nYou have brought so many wonderful things into my life, and I am genuinely grateful for every moment we shared. The lessons I've learned and the memories we've created will always be precious to me.\n\nI hope that, in time, you'll see this as an act of love rather than abandonment. You deserve someone who completes your puzzle, and I want that for you with all my heart.\n\nPlease take care of yourself. You are more wonderful than you know.\n\nWith care and gratitude,\nWishing you well",
      ],
      email: [
        "Subject: An honest and difficult conversation\n\nDear {name},\n\nI want to preface this by saying that the respect and care I have for you is what's driving me to write this, rather than let things continue in a direction that isn't fair to either of us.\n\nAfter much reflection, I've come to the difficult realization that our relationship has run its course. This isn't a decision I've arrived at lightly, and it's not about any single event or failing on your part. Sometimes, despite our best intentions, a relationship reaches a natural endpoint.\n\nWhat I can tell you with absolute certainty is that our time together has been meaningful and impactful. You've influenced my life in positive ways that I'll carry forward. The connection we shared was real, and the memories we created together are ones I'll always treasure.\n\nI understand if you need time and space to process this. Please know that I have nothing but the deepest respect and warmest wishes for your future. You are a remarkable person who deserves to be deeply and completely loved.\n\nI hope that, with time, there can be understanding and perhaps even a sense of peace about this for both of us.\n\nWith sincerity and care,\nLooking after yourself",
      ],
    },
  },
  Direct: {
    "Growing apart": {
      text: [
        "{name}, I need to be straightforward with you. We've grown apart, and I think it's best we end things. It's not fair to either of us to pretend otherwise. I respect you too much for that.",
        "Hey {name}, I'm going to be direct because you deserve that. We've drifted apart and I think we should break up. I've thought about this a lot and I believe it's the right call.",
      ],
      letter: [
        "Dear {name},\n\nI'm writing to be upfront with you because that's what you deserve. Our relationship has changed significantly, and we've grown apart in ways I don't think either of us can fix.\n\nI've thought about this carefully, and I believe ending things now is better than dragging it out. We both deserve relationships where we feel connected and fulfilled, and that's not where we are anymore.\n\nI value what we had. It was real and it mattered. But holding on when it's not working isn't fair to you or to me.\n\nI wish you well.\n\nSincerely",
      ],
      email: [
        "Subject: We need to talk about us\n\nHi {name},\n\nI'm going to be direct because I believe honesty is more respectful than avoidance.\n\nOur relationship has fundamentally changed. We've grown apart - different interests, different priorities, different energy. I've given this a lot of thought, and I've concluded that ending our relationship is the right decision for both of us.\n\nThis isn't about blame. People change, and that's natural. But I think we both owe it to ourselves to find connections that truly fulfill us rather than settling for something that no longer works.\n\nI appreciate everything we've shared and I hold no ill will. I genuinely want the best for you.\n\nTake care,\nAll the best",
      ],
    },
    "Different goals": {
      text: [
        "{name}, I'll be straight with you. Our goals in life don't align, and I don't see that changing. I think the best thing for both of us is to go our separate ways. You deserve to chase your dreams without compromise.",
        "Hey {name}, I've thought about this a lot. We want fundamentally different things in life. Rather than one of us giving up what we want, I think we should part ways. It's the honest thing to do.",
      ],
      letter: [
        "Dear {name},\n\nI believe in being direct, especially about things that matter this much.\n\nWe want different things from life. Different timelines, different priorities, different visions of the future. I've tried to see a path where both our goals are met, and I honestly can't find one that doesn't require one of us to give up something fundamental.\n\nI refuse to ask you to sacrifice your dreams, and I can't sacrifice mine either. So the fairest thing I can do is be honest: we need to end this.\n\nYou're a great person with a clear vision for your life. Go get it.\n\nRespectfully",
      ],
      email: [
        "Subject: Being honest about our future\n\nHi {name},\n\nI want to be clear and direct about where I stand because you deserve that clarity.\n\nAfter careful thought, I've realized that our life goals are incompatible. This isn't about right or wrong - we simply want different things. Continuing would mean one of us compromising on something fundamental, and I don't think that leads anywhere good.\n\nThe practical truth is: we're headed in different directions, and I think it's best we acknowledge that now rather than later.\n\nI have a great deal of respect for you and everything we've built together. This doesn't erase any of that.\n\nWishing you success in everything you pursue.\n\nBest regards",
      ],
    },
    "Distance": {
      text: [
        "{name}, the distance isn't working. I've tried to make it work, but the reality is it's making us both miserable. I think we need to accept that and move on.",
        "Hey {name}, I'll be honest - long distance is killing our relationship. We both deserve better than this. I think it's time to call it.",
      ],
      letter: [
        "Dear {name},\n\nI'm going to cut straight to it because sugarcoating this won't help either of us.\n\nThe long-distance aspect of our relationship isn't working. Despite our efforts, the distance has created a gap that calls and texts can't bridge. We're both struggling, and I think it's time to acknowledge that.\n\nI'd rather end things while we still have respect and good memories than watch us slowly become frustrated and resentful. You deserve someone who can actually be there, and so do I.\n\nThis was a tough call, but I believe it's the right one.\n\nTake care",
      ],
      email: [
        "Subject: Being real about the distance\n\nHi {name},\n\nI'll be direct: the long-distance situation is not sustainable for our relationship. I've tried to make it work, and I know you have too, but the reality is that we need more than what distance allows us to give each other.\n\nRather than letting this slowly deteriorate, I think the honest thing to do is to end our relationship now. We both deserve a partner who can be present and available in ways that distance simply doesn't permit.\n\nI respect you and value what we had. This is about being realistic, not about caring less.\n\nAll the best to you.",
      ],
    },
    "Other": {
      text: [
        "{name}, I need to be honest. This relationship isn't working for me anymore. I've thought about it a lot, and I think breaking up is the right decision. I respect you and I wanted to tell you directly.",
        "Hey {name}, there's no easy way to say this, so I'll just say it: I think we should break up. It's been on my mind for a while, and I owe you the truth.",
      ],
      letter: [
        "Dear {name},\n\nI'm going to be straightforward because I believe you deserve honesty over comfort.\n\nI've decided that our relationship needs to end. This isn't a rash decision - I've given it considerable thought. The bottom line is that I'm not happy, and I suspect you might not be either, and continuing isn't going to change that.\n\nI don't have a dramatic reason or a villain in this story. Sometimes things just don't work, and I think that's where we are. Accepting that is better than pretending.\n\nI wish you the best, genuinely.\n\nTake care of yourself",
      ],
      email: [
        "Subject: An honest conversation about us\n\nHi {name},\n\nI want to be direct with you because I respect you too much for anything less.\n\nI've spent a lot of time thinking about our relationship, and I've come to the conclusion that it's time for us to go our separate ways. This isn't an impulsive decision - it's something I've been processing for a while.\n\nI don't want to over-explain or make this more complicated than it needs to be. The truth is, I don't see a path forward for us that leads to genuine happiness for either party. And I'd rather be honest about that now.\n\nI wish you nothing but the best. You're a good person, and you deserve to find what you're looking for.\n\nSincerely",
      ],
    },
  },
  Humorous: {
    "Growing apart": {
      text: [
        "Hey {name}, so apparently we've been growing - just in opposite directions. Like two plants in the same pot that need their own gardens. I think it's time we get repotted. Still think you're great though!",
        "{name}, I've been trying to find the words, and the best I've got is: we're like two browsers with too many tabs open - going in completely different directions. I think it's time to close this tab. But you're still bookmarked in my heart!",
      ],
      letter: [
        "Dear {name},\n\nSo, I've been trying to write this letter for days. Draft one was too dramatic. Draft two was too vague. Draft twelve (yes, twelve) finally felt right. Here goes.\n\nWe've grown apart. Not in a 'you did something wrong' way, but more in a 'we're both evolving in different directions like Pokemon' way. And unlike Pokemon, I don't think we can just use a rare candy to fix this one.\n\nYou're an amazing person - funny, kind, and honestly way out of my league. But I think we both know that the spark has shifted, and holding on just because we're comfortable isn't fair to either of us.\n\nSo here I am, setting us both free to find our own adventures. I'll always be grateful for our time together (yes, even that time we got lost and you blamed me for the GPS).\n\nMay your next chapter be even more amazing than ours was.\n\nYour favorite ex (eventually),\nCheers",
      ],
      email: [
        "Subject: The hardest email since 'Reply All' to the entire company\n\nHi {name},\n\nFirst off, no, this isn't a prank. Though I wish it were, because that would be much easier.\n\nHere's the thing: we've grown apart. I know, I know - it sounds like something from a movie script. But it's true. We used to finish each other's sentences, and now we can barely finish each other's Netflix shows (mainly because we've developed completely different tastes, which is kind of a metaphor for us).\n\nI've thought about this more than I've thought about literally anything, including that time I spent three hours deciding what to order on Zomato. And I've concluded that the kindest thing I can do is be honest: we're better off as two amazing individuals than as one mediocre couple.\n\nYou're fantastic. Like, genuinely. If there were Yelp reviews for humans, you'd be 4.8 stars minimum. But sometimes two 4.8-star humans just don't make a 5-star couple, and that's okay.\n\nI wish you all the best. Seriously. You deserve someone who's growing in the same direction as you.\n\nWith affection and bad jokes,\nYour soon-to-be favorite ex",
      ],
    },
    "Different goals": {
      text: [
        "Hey {name}, turns out our 5-year plans look like they were written by two completely different people... because they were. I think it's time we each follow our own GPS. You're amazing, just on a different route!",
        "{name}, so I just realized we're basically two people trying to watch different movies on the same screen. I think we need our own screens. Still think you're a blockbuster hit though!",
      ],
      letter: [
        "Dear {name},\n\nYou know how in video games, sometimes you reach a fork in the road and have to choose a path? Well, we're at that fork, and I think our joysticks are pointing in different directions.\n\nOur life goals are about as compatible as pineapple on pizza (I know where you stand on that debate). You want your thing, I want mine, and neither of us should have to put our dreams on hold.\n\nYou're incredible - like, genuinely one of the best humans I know. This isn't about not liking you enough; it's about respecting both our futures enough to be honest.\n\nSo here's to us, pursuing our wildly different but equally valid life goals. May we both crush it.\n\nYour biggest fan (from a distance),\nCheers to your dreams",
      ],
      email: [
        "Subject: Life goals and other plot twists\n\nHi {name},\n\nSo you know how some couples are 'on the same page'? Turns out, we're not even in the same book. Possibly not even the same library.\n\nJokes aside, I've been thinking a lot about our future - well, futures (plural) - and I've realized that our goals are heading in fundamentally different directions. It's like we're both running marathons... in opposite directions... on different continents.\n\nThis isn't about who's right or wrong. Your goals are amazing. Mine are... well, they're different. And I'd rather be honest about this now than have us both compromise our dreams and end up like those couples who passive-aggressively load the dishwasher at each other.\n\nYou're a wonderful person who's going to do incredible things. I just don't think those things involve us growing old together arguing about curtain colors.\n\nWishing you a fantastic life that's everything you've dreamed of.\n\nWith love and really bad analogies,\nOnward and upward!",
      ],
    },
    "Distance": {
      text: [
        "Hey {name}, our relationship has more miles on it than my car. And unlike my car, I can't fix this with an oil change. I think the distance has won this round.",
        "{name}, so it turns out that 'distance makes the heart grow fonder' was written by someone who didn't have to deal with timezone math. I think it's time we close the distance chapter.",
      ],
      letter: [
        "Dear {name},\n\nRemember when we said 'distance is just a number'? Well, so is my phone bill, and they're both too high.\n\nAll jokes aside, the long-distance thing isn't working. Not because we're not great - we are - but because our relationship is basically a never-ending series of 'I miss you' texts and FaceTime calls where the WiFi freezes at the worst moments. We deserve more than pixelated goodnight kisses.\n\nYou're wonderful, and this sucks. But I think we both know that continuing to pretend everything's fine when we can't even share a pizza is not sustainable.\n\nMay you find someone who's close enough to steal your fries in person.\n\nWith long-distance love (the irony),\nSigning off from across the miles",
      ],
      email: [
        "Subject: Distance: 1, Us: 0\n\nHi {name},\n\nSo, I did the math, and the number of miles between us is... a lot. Like, 'my frequent flyer points should get me a private jet by now' a lot.\n\nBut it's not just the miles. It's the timezone juggling, the missed calls, the 'you hang up first' standoffs at 2 AM. It's building a relationship through a screen when what we both need is someone who can show up at our door with ice cream after a bad day.\n\nYou're an incredible person, and this isn't about not caring. It's about caring enough to admit that this isn't giving either of us what we need. We've been trying to make it work, and I think it's time to acknowledge that some distances just can't be covered by WiFi.\n\nI hope you find someone amazing - preferably within a reasonable driving distance.\n\nWith humor to mask the sadness,\nMay your next relationship have better bandwidth",
      ],
    },
    "Other": {
      text: [
        "Hey {name}, I've been trying to figure out how to say this, and there's literally no funny way to break up. Trust me, I googled it. But here goes: I think we should end things. You're great, it's just not working anymore.",
        "{name}, so plot twist: I think we should break up. I know, nobody saw that coming (we both kind of did). You're awesome, this just isn't our story anymore.",
      ],
      letter: [
        "Dear {name},\n\nI tried to write this letter in a way that's both honest and not totally depressing. Let's see how I did.\n\nSo, here's the deal: I think we need to break up. I know, I know - not exactly the love letter you were hoping for. But in the grand tradition of ripping off band-aids, here we are.\n\nThis isn't because you're not amazing (you are). It's not because I don't care (I do). It's just that our relationship has run its course, like a Netflix series that should have ended two seasons ago. Still loved those early seasons though.\n\nYou deserve someone who's all in, and right now, I can't be that person. That's not a reflection of your worth - you're a catch. It's just one of those life things that doesn't have a neat explanation.\n\nSo here's to us, moving forward, and hopefully looking back on this with a smile someday (give it like... six months minimum).\n\nStill your biggest fan,\nExiting stage left with grace (hopefully)",
      ],
      email: [
        "Subject: Not a drill (unfortunately)\n\nHi {name},\n\nSo there's no Hallmark card for this, so I'm doing it via email like the modern, emotionally complex human I am.\n\nI think we should break up. There, I said it. Typed it. Whatever.\n\nBefore you start composing a response (take your time, I'll wait), let me explain. It's not dramatic. There's no villain arc here. Our relationship just... isn't working anymore. Like a phone charger that only works at a specific angle - technically functional, but honestly exhausting.\n\nYou're wonderful. Truly. And maybe in a parallel universe, we're still going strong. But in this one, I think we both deserve better than what we're giving each other right now.\n\nI hope we can be cool about this. Eventually. After the mandatory awkward phase.\n\nWishing you the best,\nYour soon-to-be-friendly-acquaintance",
      ],
    },
  },
  Mature: {
    "Growing apart": {
      text: [
        "{name}, I've given this careful thought. We've grown into different people than when we started, and I think the most respectful thing we can do is acknowledge that and let each other go gracefully. I value what we shared.",
        "Hey {name}, I want to have an honest conversation. We've been growing apart, and I think we both feel it. Rather than let resentment build, I'd like us to part with mutual respect and gratitude for what we had.",
      ],
      letter: [
        "Dear {name},\n\nI want to approach this conversation with the same respect and maturity that has defined the best parts of our relationship.\n\nOver time, we've both evolved as individuals. Growth is natural and healthy, but our growth has taken us in directions that no longer align. I've noticed it in our conversations, our priorities, and the subtle shifts in our connection.\n\nRather than waiting until frustration or resentment creeps in, I'd rather be honest now. I believe we deserve to part ways with dignity, while we still hold genuine love and respect for each other.\n\nOur relationship has been a significant chapter in my life. You've taught me things about love, patience, and partnership that I'll carry with me always. None of that is diminished by this decision.\n\nI hope we can handle this transition with the grace and maturity that I believe we're both capable of.\n\nWith deep respect and genuine affection,\nWishing you well",
      ],
      email: [
        "Subject: A thoughtful conversation about us\n\nDear {name},\n\nI've spent considerable time reflecting before writing this, because I wanted to approach this with the thoughtfulness our relationship deserves.\n\nThe truth is, we've grown apart. Not suddenly, but gradually - like two trees whose branches once intertwined but have slowly reached toward different sources of light. This is nobody's failure; it's simply the nature of growth.\n\nI've come to believe that the most loving and mature thing we can do is acknowledge this reality rather than resist it. Continuing to hold on when we've naturally shifted apart risks turning something beautiful into something bitter, and I respect what we've had too much for that.\n\nI want us to approach this ending the same way we approached our best moments together - with honesty, compassion, and mutual respect. Our relationship mattered. It shaped us both. And I'll always be grateful for the person you helped me become.\n\nI hope we can navigate this transition thoughtfully and emerge from it with our dignity and mutual respect intact.\n\nWith sincere respect and care,\nGrateful for our journey",
      ],
    },
    "Different goals": {
      text: [
        "{name}, after serious reflection, I realize our life visions don't align. Neither of us should have to compromise our core values. I respect you too much to ask you to change your path, and I need to honor mine.",
        "Hey {name}, I've been thinking deeply about our future. Our goals are fundamentally different, and I believe the most mature decision is to set each other free to pursue them. No blame, just honesty.",
      ],
      letter: [
        "Dear {name},\n\nI've spent a long time thinking about how to have this conversation, because the gravity of it deserves careful consideration.\n\nAs I look at our individual goals and the trajectory of our lives, I see two paths that, despite our best intentions, don't converge. You have a clear vision for your future, and so do I. The challenge is that these visions require us to move in fundamentally different directions.\n\nI've considered whether compromise is possible, and I keep arriving at the same conclusion: the kind of compromise required would mean one of us giving up something essential. That's not compromise - that's sacrifice. And I respect both of us too much to ask for that.\n\nThis decision comes from a place of maturity and genuine care. I want you to have everything you've dreamed of, fully and without reservation. And I need to pursue my own path with the same commitment.\n\nOur relationship has been meaningful, and I carry the lessons and memories with gratitude.\n\nWith respect and sincerity,\nOnward",
      ],
      email: [
        "Subject: A mature conversation about our paths\n\nDear {name},\n\nI want to have an honest, adult conversation about where we stand and where we're headed.\n\nAfter deep reflection, I've accepted that our life goals are not compatible in the ways that matter most for a lasting partnership. This isn't a judgment on either of our aspirations - they're both valid and worthy. They simply don't complement each other in a way that allows both of us to thrive.\n\nI've thought about compromise extensively, and I've concluded that the compromises required would be too significant. Asking either of us to reshape our fundamental vision for life would eventually lead to regret, and I'd rather we part with mutual respect than arrive at resentment.\n\nI want you to know that this decision was not made lightly. Our relationship has been valuable and formative. I'm grateful for what we've shared and the ways you've contributed to my growth.\n\nI hope we can approach this transition with the same maturity and respect that has characterized the best of our relationship.\n\nWith genuine regard,\nRespectfully",
      ],
    },
    "Distance": {
      text: [
        "{name}, I've been honest with myself about the distance, and I need to be honest with you too. Despite our efforts, the separation is eroding what we built. I think the healthiest choice is to let go with grace.",
        "Hey {name}, the distance has been harder than either of us anticipated. After careful thought, I believe the most mature decision is to end our relationship while we still have love and respect for each other.",
      ],
      letter: [
        "Dear {name},\n\nI want to address something we've both been navigating with as much grace as possible: the impact of distance on our relationship.\n\nDespite our genuine efforts, the physical separation has created an emotional gap that I don't believe can be adequately bridged through screens and phone calls alone. We've both tried, and I honor that effort. But I also have to honor the truth of what I'm experiencing.\n\nA relationship requires presence - not just the willingness to show up, but the ability to. And right now, the circumstances don't allow for the kind of partnership we both deserve.\n\nI believe the most respectful thing we can do is acknowledge this reality and make a conscious, dignified decision rather than letting things slowly deteriorate. You deserve intentionality, even in endings.\n\nI'm grateful for everything we've shared and the resilience we've shown.\n\nWith respect and appreciation,\nWishing you closeness",
      ],
      email: [
        "Subject: Being intentional about our situation\n\nDear {name},\n\nI've been reflecting on our relationship with the honesty and intentionality that I believe it deserves.\n\nThe reality of long distance has tested us both, and despite our commitment, I've come to accept that it's creating a dynamic that isn't sustainable or healthy for either of us. We deserve a relationship characterized by presence, spontaneity, and the simple comfort of being together - things that distance fundamentally limits.\n\nI don't arrive at this conclusion without careful consideration. I've weighed the options, imagined different scenarios, and kept coming back to the same realization: continuing as we are isn't serving our well-being or our long-term happiness.\n\nI would rather we end this chapter with mutual respect and good memories intact than watch it gradually diminish under the weight of circumstances beyond our control.\n\nYou've been a significant and cherished part of my life. That won't change regardless of our relationship status.\n\nWith deep respect and warm regards,\nGratefully",
      ],
    },
    "Other": {
      text: [
        "{name}, I've done a lot of self-reflection, and I've concluded that ending our relationship is the right decision. This isn't impulsive. I hope we can approach this with mutual respect and understanding.",
        "Hey {name}, after careful consideration, I believe we've reached a natural conclusion. I want to handle this with the maturity and respect that our relationship deserves.",
      ],
      letter: [
        "Dear {name},\n\nThis letter comes after much deliberation and self-reflection. I want to be honest with you in a way that honors both of us and what we've shared.\n\nI've come to the conclusion that our relationship has reached its natural end. This isn't a decision born from anger, impulse, or any single incident. It's the result of honest self-assessment and a recognition that we're no longer fulfilling each other's needs in the way a healthy partnership requires.\n\nI believe that every relationship serves a purpose and teaches us something valuable. Ours has been meaningful and has contributed to my growth as a person. I hope you feel the same.\n\nI want us to approach this ending with dignity and mutual respect. There's no need for blame or bitterness. Sometimes, the most mature and loving thing two people can do is acknowledge when it's time to let go.\n\nI wish you genuine happiness and fulfillment in whatever comes next.\n\nWith respect and gratitude,\nPeacefully",
      ],
      email: [
        "Subject: A considered and honest conversation\n\nDear {name},\n\nI want to approach this with the thoughtfulness and maturity that our relationship warrants.\n\nAfter considerable reflection, I've decided that it's time for us to end our romantic relationship. This is not a reaction to any specific event but rather a conclusion I've reached through honest introspection about what we both need and deserve.\n\nI want to be clear: this isn't about assigning blame. Relationships are complex ecosystems, and ours has simply evolved beyond what either of us can sustain in a way that's fulfilling. Acknowledging that takes courage, and I believe we both possess it.\n\nOur time together has been valuable. I've grown because of it, and I hope you have too. I carry genuine gratitude for the experiences we've shared and the ways we've positively impacted each other's lives.\n\nI hope we can transition through this with grace, maintaining the respect we have for each other. I believe that how we handle endings says as much about us as how we handle beginnings.\n\nWith sincere respect and well-wishes,\nThoughtfully",
      ],
    },
  },
};

export default function AiBreakupTextGenerator() {
  const [tone, setTone] = useState<BreakupTone>("Kind");
  const [name, setName] = useState("");
  const [reason, setReason] = useState<Reason>("Growing apart");
  const [results, setResults] = useState<{ label: string; text: string }[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [seed, setSeed] = useState(0);

  const generate = () => {
    const n = name.trim() || "there";
    const t = templates[tone][reason];
    const s = seed;
    const fill = (txt: string) => txt.replace(/\{name\}/g, n);
    setResults([
      { label: "Text Message (Short)", text: fill(t.text[s % t.text.length]) },
      { label: "Letter (Medium)", text: fill(t.letter[s % t.letter.length]) },
      { label: "Email (Detailed)", text: fill(t.email[s % t.email.length]) },
    ]);
    setSeed((p) => p + 1);
  };

  const copy = (idx: number) => {
    navigator.clipboard?.writeText(results[idx].text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const tones: BreakupTone[] = ["Kind", "Direct", "Humorous", "Mature"];
  const reasons: Reason[] = ["Growing apart", "Different goals", "Distance", "Other"];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Tone</label>
        <div className="flex gap-2 flex-wrap">
          {tones.map((t) => (
            <button key={t} onClick={() => setTone(t)} className={t === tone ? "btn-primary" : "btn-secondary"}>{t}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Partner&apos;s Name</label>
        <input className="calc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Their name..." />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Reason</label>
        <div className="flex gap-2 flex-wrap">
          {reasons.map((r) => (
            <button key={r} onClick={() => setReason(r)} className={r === reason ? "btn-primary" : "btn-secondary"}>{r}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Breakup Messages</button>
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
          <div className="result-card bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700">Remember: Every ending is a new beginning. Be kind to yourself and the other person. Take time to heal and grow.</p>
          </div>
        </div>
      )}
    </div>
  );
}
