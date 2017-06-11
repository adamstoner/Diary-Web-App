const PROMPTS = ['List the things that make you feel powerful.',
'What is something that made you laugh today?',
'List the movies that you want to watch.',
'List the things that make you feel peaceful.',
'List your greatest comforts.',
'What is something that brightens your day?',
'List three things you accomplished today.',
'What is something you look forward to every day?',
'What is a game that you like to play?',
'What is your Sunday ritual?',
'List the most memorable moments of this month so far.',
'List some things you want to do outdoors.',
'If you could live anywhere you wanted, where would you live?',
'List what you would spend a million dollars on, just for you.',
'When do you feel most energized?',
'List the things that make you feel excited.',
'List your favorite snacks or treats.',
'What has you busy this week?',
'List the people you admire.',
'List the happiest moments of your year so far.',
'What hobby would you like to pick up?',
'List the ways you love to have fun.',
'Describe something you learned today',
'List something fun you did or will do today.',
'What is your dream job?',
'List the things that inspire you.',
'List something you did today that you are proud of.',
'Find a quote that you like and write it down here.',
'List something you should ignore.',
'Talk about something you are excited about next month.',
'List three traits you would like others to see in you.'];

class DiaryContainer{
  constructor(diaryContainer, currDate, journalId){
    console.log("Journal id: ", journalId);
    this.journalId = journalId;
    this.diaryElement = document.querySelector('#text-box');
    this.diaryEntries = {};
    this.containerElement = diaryContainer;
    this.currDate = currDate;
    this.startDate = currDate;
    this.dateElement = document.querySelector('#date');
    this.promptElement = document.querySelector('#prompt');
    this.showEntry = this.showEntry.bind(this);
    this.initialize = this.initialize.bind(this);
    this.editEntry = this.editEntry.bind(this);
    this.startDay = this.startDay.bind(this);
    this.prevDay = this.prevDay.bind(this);
    this.nextDay = this.nextDay.bind(this);
    this.containerElement.classList.remove('inactive');
    this.startButton= document.querySelector('#start');
    this.prevButton = document.querySelector('#prev');
    this.nextButton = document.querySelector('#next');





  }

  async initialize(){
    console.log("In initialize function");
    //TODO: Retrieve diary with relevant id, and insert entry
    const results = await fetch('/getEntry/'+this.journalId+'/'+this.currDate);
    console.log("results");
    const entry = await results.json();
    console.log("entry json: ", entry);
    this.diaryEntries[this.currDate] = [entry.prompt, entry.content]; //[PROMPTS[Math.floor(Math.random()*PROMPTS.length)], ""];
    this.dateElement.innerHTML =  this.currDate;
    this.promptElement.innerHTML = this.diaryEntries[this.currDate][0];
    this.containerElement.addEventListener('click', this.showEntry);
    this.diaryElement.addEventListener('click', this.editEntry);
    this.prevButton.addEventListener('click', this.prevDay);
    this.startButton.addEventListener('click', this.startDay);
    this.nextButton.addEventListener('click', this.nextDay);
  }

  async showEntry(event){
    console.log("In showEntry listener");
    let currText = this.diaryElement.value;
    console.log("Curr text: ", currText);
    const result = await fetch('/updateEntry/'+this.journalId+'/'+this.currDate+'/'+currText);
    this.diaryElement.classList.add('pink');

  }
  async prevDay(){
    console.log("In prev day listener");
    event.stopPropagation();
    var date = new Date(this.currDate);
    date.setDate(date.getDate()-1);
    let dateStr = date.toLocaleString().substr(0, date.toLocaleString().indexOf(','));
    this.currDate = dateStr;
    this.dateElement.innerHTML =  this.currDate;

    //let entry = this.diaryEntries[this.currDate];
    const entry = await fetch('/getEntry/'+journalId+'/'+this.currDate);
    const result = await entry.json();
    console.log("result in prevDay: ", result);
  /*  if(entry === undefined) this.diaryEntries[this.currDate]= [PROMPTS[Math.floor(Math.random()*PROMPTS.length)], ""];
    this.diaryElement.value = this.diaryEntries[this.currDate][1];
    this.promptElement.innerHTML = this.diaryEntries[this.currDate][0];*/
    this.diaryElement.value = result.content;
    this.promptElement.innerHTML = result.prompt;


  }

  async nextDay(){
    console.log("In next day listener");
    event.stopPropagation();
    var date = new Date(this.currDate);
    date.setDate(date.getDate()+1);
    let dateStr = date.toLocaleString().substr(0, date.toLocaleString().indexOf(','));
    console.log("curr date: ", dateStr);
    this.currDate = dateStr;
    this.dateElement.innerHTML =  this.currDate;

  /*  let entry = this.diaryEntries[this.currDate];
    console.log('entry: ',entry);
    if(entry === undefined) this.diaryEntries[this.currDate] = [PROMPTS[Math.floor(Math.random()*PROMPTS.length)], ""];
    console.log(this.diaryEntries[this.currDate]);
    this.diaryElement.value = this.diaryEntries[this.currDate][1];
    this.promptElement.innerHTML = this.diaryEntries[this.currDate][0];*/
    const entry= await fetch('/getEntry/'+journalId+'/'+this.currDate);
    const result = await entry.json();
    this.diaryElement.value = result.content;
    this.promptElement.innerHTML = result.prompt;


  }

async startDay(){
    console.log("In startDay listener");
    event.stopPropagation();
    this.currDate = this.startDate;
    /*this.dateElement.innerHTML =  this.currDate;
    if(entry === undefined) this.diaryEntries[this.currDate]= [PROMPTS[Math.floor(Math.random()*PROMPTS.length)], ""];
    this.diaryElement.value = this.diaryEntries[this.currDate][1];
    this.promptElement.innerHTML = this.diaryEntries[this.currDate][0];*/
    const entry = await fetch('/getEntry/'+journalId+'/'+this.currDate);
    const result = await entry.json();

    this.diaryElement.value = result.content;
    this.promptElement.innerHTML = result.prompt;
  }



  editEntry(event){
    event.stopPropagation();
    console.log("In edit event listener");
    console.log(this.containerElement);
    this.diaryElement.disabled = false;
    this.diaryElement.classList.remove('pink');

  }


}
