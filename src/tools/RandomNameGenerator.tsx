"use client";
import { useState, useMemo } from "react";

const names: Record<string, Record<string, string[]>> = {
  Hindu: {
    Male: ["Aarav","Vivaan","Aditya","Arjun","Reyansh","Ayaan","Krishna","Sai","Arnav","Dhruv","Kabir","Ritvik","Ishaan","Shaurya","Atharv","Advait","Vihaan","Aayansh","Ansh","Daksh","Pranav","Rohan","Sahil","Yash","Harsh","Manish","Nikhil","Varun","Karan","Ajay","Amit","Ankur","Dev","Gaurav","Hemant","Jayesh","Kunal","Lalit","Mohan","Nakul","Om","Parth","Rishi","Siddharth","Tanmay","Umesh","Vikas","Yuvraj","Chirag","Deepak","Girish","Hitesh","Jatin","Kartik","Lokesh","Mayank","Naman","Piyush","Rahul","Sachin","Tushar","Uday","Vinay","Ankit","Bharat","Chetan","Divya","Eshan","Farhan","Gopal","Hari","Ishan","Jai","Kedar","Laxman","Madhav","Naresh","Ojas","Prateek","Rajat","Shivam","Tarun","Vaibhav","Aakash","Bhuvan","Chandra","Darshan","Eklavya","Gagan","Himanshu","Jayant","Kishore","Lakshya","Manas","Naveen","Pranit","Raghav","Soham","Tejas","Utkarsh","Vishal"],
    Female: ["Aadhya","Ananya","Diya","Myra","Sara","Aanya","Aarohi","Kiara","Saanvi","Avni","Ira","Prisha","Navya","Anika","Riya","Nisha","Pooja","Shruti","Meera","Kavya","Tanvi","Ishita","Sanya","Aria","Zara","Aditi","Bhavna","Chaitra","Deepika","Esha","Falguni","Garima","Hema","Isha","Jaya","Kamal","Lavanya","Mahi","Nandini","Ojaswi","Pallavi","Radhika","Sakshi","Tanya","Uma","Vaishnavi","Wridhi","Yashvi","Aishwarya","Bhoomika","Chhavi","Devika","Ekta","Fatima","Gayatri","Harini","Iti","Juhi","Keerthi","Lata","Madhuri","Neha","Oviya","Prerna","Rachna","Simran","Trisha","Urmi","Vidya","Yamini","Ankita","Bindu","Chandni","Diksha","Eesha","Gauri","Hiral","Indu","Janvi","Komal","Lekha","Mansi","Nisha","Pihu","Richa","Suhani","Tara","Urvashi","Veena","Arushi","Bela","Charvi","Disha","Eshani","Gita","Hansa","Ira","Jyoti","Kriti","Leela","Mridula"],
  },
  Muslim: {
    Male: ["Aariz","Abdullah","Ahmed","Ali","Amir","Arham","Ayaan","Bilal","Danish","Ehsan","Faizan","Ghazi","Hamza","Ibrahim","Junaid","Kamran","Luqman","Mohammed","Nabeel","Omar","Qasim","Rafiq","Saad","Tariq","Usman","Wasim","Yusuf","Zain","Adnan","Burhan","Dawood","Farhan","Hassan","Imran","Jamal","Khalid","Mansoor","Nasir","Owais","Rameez","Shahid","Talha","Uzair","Waqar","Yasir","Zaheer","Aqib","Babar","Daniyal","Faraz","Haider","Irfan","Jawad","Kashif","Liaqat","Mudassir","Nadeem","Parvez","Rehan","Salman","Taufiq","Ubaid","Wajid","Zeeshan","Abbas","Basit","Daud","Ejaz","Firdaus","Gulzar","Habib","Ismail","Javed","Kareem","Latif","Majid","Noman","Obaid","Raza","Sohail","Tabrez","Vaqar","Waheed","Arif","Bashir","Dilshad","Feroz","Ghaus","Idris","Kabir","Mushtaq","Naeem","Rashid","Sajid","Tanveer","Waris","Yaqub","Zamir","Asad","Bilqees","Changez","Ehsaan","Farid"],
    Female: ["Aisha","Amina","Bushra","Dua","Fatima","Gulnaz","Hina","Inaya","Jasmine","Khadija","Laiba","Maryam","Nadia","Parveen","Qurat","Rubina","Saba","Tahira","Uzma","Waheeda","Yasmin","Zainab","Alina","Benazir","Dilshad","Erum","Farida","Ghazala","Humaira","Iqra","Javeria","Kausar","Lubna","Mehreen","Naila","Rabia","Saima","Tabassum","Urooj","Wardah","Zahra","Afreen","Bilqees","Chandni","Dania","Farzana","Habiba","Iram","Kahkashan","Madiha","Najma","Rehana","Samina","Tanzeela","Veena","Wafa","Zeenat","Anam","Bushra","Dilara","Fahmida","Ghazal","Huma","Isma","Jaweria","Komal","Laylah","Muneeba","Nusrat","Pakeeza","Rida","Shaista","Tayyaba","Umme","Wahida","Yasmeen","Zoya","Areesha","Bazila","Durdana","Falak","Gul","Hamna","Ifra","Jannat","Khushboo","Lina","Mariyah","Noorjahan","Rukhsar","Salma","Tuba","Uzaira","Wajeeha","Zarina","Abida","Bareen","Deena"],
  },
  Sikh: {
    Male: ["Amardeep","Balwinder","Charanjit","Dalvir","Ekamjot","Fatehvir","Gurpreet","Harjot","Inderjit","Jaspreet","Kuldeep","Lakhvir","Manpreet","Navjot","Onkar","Paramjit","Rajvir","Satnam","Tejvir","Udayvir","Veerpal","Waheguru","Amrit","Bhagat","Chanpreet","Daljit","Eknoor","Fatehpal","Gurbani","Harinder","Inderpal","Joginder","Kartar","Lovepreet","Mohinder","Narinder","Prabhjot","Ranjit","Sukhvir","Taranjit","Amritpal","Bikramjit","Chamkaur","Devinder","Fateh","Gurmeet","Harbhajan","Iqbal","Jaswant","Kanwar","Labh","Mehtab","Nirmal","Partap","Randhir","Simranjit","Tejinder","Avtar","Baljeet","Charan","Dharam","Fatehbir","Gursewak","Harmeet","Jagjit","Kirpal","Lovejit","Makhan","Nihal","Prem","Resham","Sukhpal","Tarsem","Ajit","Bhai","Chahal","Deep","Ekam","Gurnaam","Harpal","Jasvir","Kulwant","Livtar","Manjit","Nihang","Pavitar","Roop","Sahib","Teja","Uttam","Virpal","Arjan","Balraj","Chattar","Darshan","Fauja","Gurdas","Harjinder","Jatinder","Keerat","Lakhbir","Manvir","Nirbhai"],
    Female: ["Amanpreet","Baljeet","Charanjeet","Dalveen","Eknoor","Fatehleen","Gurleen","Harleen","Inderjeet","Jasmeet","Kiranjot","Loveleen","Manmeet","Navneet","Prabhjeet","Rajleen","Simran","Taranpreet","Amarjeet","Bhagwant","Chanpreet","Diljot","Ekamjot","Fatehpreet","Gurbani","Harpreet","Ishpreet","Jasnoor","Kamalpreet","Livleen","Mehtab","Navjot","Preetkamal","Ramanpreet","Sukhleen","Tejkaur","Amneet","Bani","Chahat","Deepkaur","Ektaa","Fatehkaur","Gurmeet","Harmeet","Ikjot","Jasleen","Kanwalpreet","Lovneet","Manpreet","Nirmal","Pawandeep","Reetkaur","Sahibleen","Teerath","Ajeetkaur","Bibikaur","Chatarkaur","Dharamkaur","Fatehleen","Guruleen","Harjeet","Jagjeet","Kirandeep","Lavleen","Matkaur","Nihaalkaur","Palakpreet","Roopkaur","Satveer","Tajinder","Anmolpreet","Balveer","Chamkaur","Devkaur","Eeshwarpreet","Faujkaur","Gurdevkaur","Harsimrat","Jeetkaur","Kuljeet","Leelkaur","Manveer","Nirmala","Paramjeet","Rupinder","Satinder","Tanveer","Upinder","Virkaur","Arjankaur","Bhaikaur","Chararpreet","Dilpreet","Fateh","Gurdipkaur","Harjot","Jaskaur","Kamaldeep","Lakhpreet"],
  },
  Christian: {
    Male: ["Aaron","Abraham","Adam","Andrew","Benjamin","Caleb","Daniel","David","Elijah","Emmanuel","Gabriel","George","Isaac","James","John","Joseph","Joshua","Luke","Mark","Matthew","Michael","Nathan","Noah","Paul","Peter","Philip","Samuel","Simon","Stephen","Thomas","Timothy","William","Alexander","Anthony","Benedict","Charles","Christopher","Dominic","Edward","Francis","Gregory","Henry","Jacob","Jonathan","Kevin","Lawrence","Martin","Nicholas","Oliver","Patrick","Richard","Robert","Sebastian","Vincent","Albert","Bernard","Clement","Dennis","Edwin","Frederick","Gerald","Harold","Ivan","Jerome","Kenneth","Leonard","Marcus","Nigel","Oscar","Quentin","Raymond","Stanley","Theodore","Ulrich","Victor","Walter","Xavier","Zachary","Adrian","Brian","Colin","Derek","Ernest","Frank","Graham","Howard","Ian","Julian","Keith","Louis","Morris","Nelson","Owen","Percy","Reginald","Sidney","Trevor","Vernon","Wesley","Alfred","Basil","Cecil","Douglas","Eugene","Felix"],
    Female: ["Abigail","Alice","Anna","Beatrice","Catherine","Clara","Diana","Dorothy","Elizabeth","Emily","Esther","Eve","Faith","Florence","Grace","Hannah","Helena","Irene","Jane","Jessica","Judith","Julia","Katherine","Laura","Lucy","Margaret","Maria","Martha","Mary","Naomi","Olivia","Patricia","Priscilla","Rachel","Rebecca","Rose","Ruth","Sarah","Sophia","Susan","Teresa","Victoria","Virginia","Agnes","Bernadette","Caroline","Charlotte","Christina","Christine","Constance","Cynthia","Deborah","Eleanor","Emma","Eva","Felicity","Frances","Gabriella","Gertrude","Helen","Hope","Isabelle","Janet","Joan","Josephine","Joyce","Karen","Lillian","Louise","Lydia","Madeline","Michelle","Nancy","Natalie","Penelope","Phoebe","Rosemary","Stephanie","Sylvia","Veronica","Vivian","Winifred","Adelaide","Angela","Blanche","Cecilia","Daphne","Edith","Eileen","Ethel","Eunice","Georgia","Gloria","Harriet","Ivy","Jacqueline","Leah","Mabel","Nora","Pearl","Regina","Theresa","Wanda"],
  },
};

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function RandomNameGenerator() {
  const [gender, setGender] = useState<"Male" | "Female" | "Any">("Any");
  const [origin, setOrigin] = useState<string>("Hindu");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const origins = useMemo(() => Object.keys(names), []);

  const generate = () => {
    const pool: string[] = [];
    const genders: ("Male" | "Female")[] = gender === "Any" ? ["Male", "Female"] : [gender];
    for (const g of genders) {
      const arr = names[origin]?.[g];
      if (arr) pool.push(...arr);
    }
    setResults(pickRandom(pool, 10));
    setCopied(null);
  };

  const copy = (name: string, idx: number) => {
    navigator.clipboard.writeText(name);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as "Male"|"Female"|"Any")} className="calc-input">
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Origin</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="calc-input">
            {origins.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="btn-primary">Generate 10 Names</button>
        {results.length > 0 && <button onClick={generate} className="btn-secondary">Regenerate</button>}
      </div>

      {results.length > 0 && (
        <div className="result-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {results.map((name, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 group">
                <span className="font-medium text-gray-800">{i + 1}. {name}</span>
                <button
                  onClick={() => copy(name, i)}
                  className="text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copied === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
