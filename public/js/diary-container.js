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
    //TODO: Retrieve diary with relevant id, and insert entry
    const results = await fetch('/getEntry/'+journalId+'/'+currDate);
    const entry = await results.json();
    this.diaryEntries[currDate] = [entry.prompt, entry.content]; //[PROMPTS[Math.floor(Math.random()*PROMPTS.length)], ""];
    this.startDate = currDate;
    this.currDate  = currDate;
    this.dateElement = document.querySelector('#date');
    this.promptElement = document.querySelector('#prompt');

    this.dateElement.innerHTML =  currDate;

    this.promptElement.innerHTML = this.diaryEntries[this.currDate][0];
    console.log(this.promptElement.innerHTML);
    this.containerElement = diaryContainer;
    this.showEntry = this.showEntry.bind(this);
    this.containerElement.addEventListener('click', this.showEntry);
    this.editEntry = this.editEntry.bind(this);
    this.diaryElement.addEventListener('click', this.editEntry);
    this.containerElement.classList.remove('inactive');
    this.startButton= document.querySelector('#start');
    this.prevButton = document.querySelector('#prev');
    this.nextButton = document.querySelector('#next');
    this.startDay = this.startDay.bind(this);
    this.prevDay = this.prevDay.bind(this);
    this.nextDay = this.nextDay.bind(this);
    this.prevButton.addEventListener('click', this.prevDay);
    this.startButton.addEventListener('click', this.startDay);
    this.nextButton.addEventListener('click', this.nextDay);


  }

  showEntry(event){
    console.log("In showEntry listener");
    let currText = this.diaryElement.value;
    console.log("Curr text: ", currText);
    const result = await fetch('/updateEntry/'+this.journalId+'/'+this.currDate+'/'+currText);
  //  this.diaryEntries[this.currDate][1] = currText;
  //  this.diaryElement.disabled = true;
    this.diaryElement.classList.add('pink');

  }
  prevDay(){
    event.stopPropagation();
    var date = new Date(this.currDate);
    date.setDate(date.getDate()-1);
    let dateStr = date.toLocaleString().substr(0, date.toLocaleString().indexOf(','));
    console.log("curr date: ", dateStr);
    this.currDate = dateStr;
    this.dateElement.innerHTML =  this.currDate;

    //let entry = this.diaryEntries[this.currDate];
    const result = await fetch('/getEntry/'+journalId+'/'+this.currDate);
  /*  if(entry === undefined) this.diaryEntries[this.currDate]= [PROMPTS[Math.floor(Math.random()*PROMPTS.length)], ""];
    this.diaryElement.value = this.diaryEntries[this.currDate][1];
    this.promptElement.innerHTML = this.diaryEntries[this.currDate][0];*/
    this.diaryElement.value = result.content;
    this.promptElement.innerHTML = result.prompt;


  }

  nextDay(){
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
    const result = await fetch('/getEntry/'+journalId+'/'+this.currDate);
    this.diaryElement.value = result.content;
    this.promptElement.innerHTML = result.prompt;


  }

  startDay(){
    event.stopPropagation();
    this.currDate = this.startDate;
    /*this.dateElement.innerHTML =  this.currDate;
    if(entry === undefined) this.diaryEntries[this.currDate]= [PROMPTS[Math.floor(Math.random()*PROMPTS.length)], ""];
    this.diaryElement.value = this.diaryEntries[this.currDate][1];
    this.promptElement.innerHTML = this.diaryEntries[this.currDate][0];*/
    const result = await fetch('/getEntry/'+journalId+'/'+this.currDate);
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
