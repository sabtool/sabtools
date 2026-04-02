"use client";
import { useState } from "react";

const quotes: { text: string; author: string }[] = [
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "In a gentle way, you can shake the world.", author: "Mahatma Gandhi" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "You must not lose faith in humanity. Humanity is an ocean; if a few drops are dirty, the ocean does not become dirty.", author: "Mahatma Gandhi" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "You miss 100% of the shots you do not take.", author: "Wayne Gretzky" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you are halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Dream is not that which you see while sleeping, it is something that does not let you sleep.", author: "APJ Abdul Kalam" },
  { text: "You have to dream before your dreams can come true.", author: "APJ Abdul Kalam" },
  { text: "If you want to shine like a sun, first burn like a sun.", author: "APJ Abdul Kalam" },
  { text: "All birds find shelter during a rain. But the eagle avoids rain by flying above the clouds.", author: "APJ Abdul Kalam" },
  { text: "Man needs difficulties in life because they are necessary to enjoy success.", author: "APJ Abdul Kalam" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "An ounce of practice is worth more than tons of preaching.", author: "Mahatma Gandhi" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "Your time is limited, so do not waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Arise, awake and stop not till the goal is reached.", author: "Swami Vivekananda" },
  { text: "Take risks in your life. If you win, you can lead. If you lose, you can guide.", author: "Swami Vivekananda" },
  { text: "In a day, when you do not come across any problems, you can be sure that you are travelling in a wrong path.", author: "Swami Vivekananda" },
  { text: "Talk to yourself once in a day, otherwise you may miss meeting an intelligent person in this world.", author: "Swami Vivekananda" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Do not judge me by my successes, judge me by how many times I fell down and got back up again.", author: "Nelson Mandela" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Life is what happens when you are busy making other plans.", author: "John Lennon" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { text: "If you look at what you have in life, you will always have more.", author: "Oprah Winfrey" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "I have not failed. I have just found 10,000 ways that will not work.", author: "Thomas Edison" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Nothing is impossible. The word itself says I'm possible.", author: "Audrey Hepburn" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "People who are crazy enough to think they can change the world are the ones who do.", author: "Rob Siltanen" },
  { text: "I alone cannot change the world, but I can cast a stone across the waters to create many ripples.", author: "Mother Teresa" },
  { text: "Not all of us can do great things. But we can do small things with great love.", author: "Mother Teresa" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
  { text: "If you cannot feed a hundred people, then feed just one.", author: "Mother Teresa" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The people who are crazy enough to think they can change the world are the ones who do.", author: "Steve Jobs" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Two things are infinite: the universe and human stupidity; and I am not sure about the universe.", author: "Albert Einstein" },
  { text: "Logic will get you from A to Z; imagination will get you everywhere.", author: "Albert Einstein" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
  { text: "The most common way people give up their power is by thinking they do not have any.", author: "Alice Walker" },
  { text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", author: "John Milton" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
  { text: "When I let go of what I am, I become what I might be.", author: "Lao Tzu" },
  { text: "Everything you have ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Opportunities do not happen. You create them.", author: "Chris Grosser" },
  { text: "Whether you think you can or you think you cannot, you are right.", author: "Henry Ford" },
  { text: "Do not let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "We become what we think about.", author: "Earl Nightingale" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "If you want to achieve greatness stop asking for permission.", author: "Anonymous" },
  { text: "Things work out best for those who make the best of how things work out.", author: "John Wooden" },
  { text: "To live a creative life, we must lose our fear of being wrong.", author: "Anonymous" },
  { text: "If opportunity does not knock, build a door.", author: "Milton Berle" },
  { text: "What seems to us as bitter trials are often blessings in disguise.", author: "Oscar Wilde" },
  { text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd" },
  { text: "The ones who are crazy enough to think they can change the world are the ones who do.", author: "Anonymous" },
  { text: "Without hard work, nothing grows but weeds.", author: "Gordon B. Hinckley" },
  { text: "The distance between insanity and genius is measured only by success.", author: "Bruce Feirstein" },
  { text: "When we strive to become better than we are, everything around us becomes better too.", author: "Paulo Coelho" },
  { text: "Failure is simply the opportunity to begin again, this time more intelligently.", author: "Henry Ford" },
  { text: "Coming together is a beginning. Keeping together is progress. Working together is success.", author: "Henry Ford" },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  { text: "There is only one corner of the universe you can be certain of improving, and that is your own self.", author: "Aldous Huxley" },
  { text: "Where there is a will, there is a way.", author: "Proverb" },
  { text: "Hard work beats talent when talent does not work hard.", author: "Tim Notke" },
  { text: "The world is full of willing people; some willing to work, the rest willing to let them.", author: "Robert Frost" },
  { text: "Do not count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Float like a butterfly, sting like a bee.", author: "Muhammad Ali" },
  { text: "It is not the years in your life that count. It is the life in your years.", author: "Abraham Lincoln" },
  { text: "Keep your face always toward the sunshine and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { text: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt" },
  { text: "Perfection is not attainable, but if we chase perfection we can catch excellence.", author: "Vince Lombardi" },
];

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [copied, setCopied] = useState(false);

  const newQuote = () => {
    let next;
    do { next = quotes[Math.floor(Math.random() * quotes.length)]; } while (next.text === quote.text && quotes.length > 1);
    setQuote(next);
    setCopied(false);
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(`"${quote.text}" - ${quote.author}`);

  return (
    <div className="space-y-6">
      <div className="result-card bg-gradient-to-br from-indigo-50 to-purple-50 text-center space-y-6 py-8">
        <div className="text-5xl text-indigo-300">{"\u201C"}</div>
        <p className="text-xl sm:text-2xl font-medium text-gray-800 leading-relaxed max-w-xl mx-auto px-4">
          {quote.text}
        </p>
        <p className="text-gray-500 font-semibold">- {quote.author}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={newQuote} className="btn-primary">New Quote</button>
        <button onClick={copyQuote} className="btn-secondary">
          {copied ? "Copied!" : "Copy"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center gap-1"
        >
          Share on X
        </a>
        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center gap-1"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
