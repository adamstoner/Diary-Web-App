/*class App {
  constructor() {


      this.startButton  = document.querySelector('#to-diary');
      this.createEntry = this.createEntry.bind(this);
      this.startButton.addEventListener('click', this.createEntry);

      const diaryElement = document.querySelector('#entry');
      diaryElement.disabled = true;
      this.diaryEntry = new DiaryEntry(diaryElement);



  }*/
  console.log("In APp")
  const createEntryButton = document.querySelector('#to-diary');
  createEntryButton.addEventListener('click', createEntry);


  async function createEntry(event){
    event.preventDefault();
    console.log("Create entry");
    const result = await fetch('/create');
    const json = await result.json();
    console.log(json.id);
    const link  = document.querySelector('#word');
    link.href  = `/id/${json.id}`;

    /*const menu = document.querySelector('#menu');
    menu.classList.add('inactive');
    const diaryContainer = document.querySelector('#entry');

    let date = new Date();
    let dateStr = date.toLocaleString().substr(0, date.toLocaleString().indexOf(','));
    this.diaryContaner = new DiaryContainer(diaryContainer, dateStr);
    */


  }
