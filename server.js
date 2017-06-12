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
'List three traits you would like others to see in you.',
'Who made you feel good this week?',
'What was the biggest mistake you made this week?',
'What did you do this week that moved you closer to reaching your goals?',
'Is there anything you did this week that you wish you’d done differently?',
'What did you most enjoy doing this week?',
'How did you procrastinate on important tasks this week?',
'What did you learn this week?',
'What’s the funniest thing that happened to you this week?'];

const bodyParser = require('body-parser');
const express = require('express');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const exphbs  = require('express-handlebars');

const app = express();
const hbs = exphbs.create();

const jsonParser = bodyParser.json();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

let db = null;
let diaries_collection = null;


async function main() {
  const DATABASE_NAME = 'final_project';
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);
//  diaries_collection = db.collection('diaries');


  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
};

async function onCreateDiary(req, res) {
  let id = new ObjectID();
  console.log("Create entry: ");
  const routeParams = req.params;
  let unique_id = id.toString();
  console.log("String: ", unique_id);
  let entry = {
    prompt :"",
    content : "",
    date: ""
  }
  diaries_collection = await db.collection(unique_id);
  diaries_collection.insert(entry);
  //console.log("Diary collection: ", diaries_collection);
  const response = {
    id: unique_id
  }
  console.log("response: ", response);
  console.log("In createDiary");
  res.json(response);

}

async function initializeDiary(req, res) {
  const routeParams = req.params;
  const placeholders = {
    id: routeParams.journal_id
  };
  console.log("In Diary ID ", placeholders.id);
  res.render('entry', placeholders);
}

async function getDiaryEntry(req, res){

  console.log("getEntry method");
  const routeParams = req.params;
  const journal_id = routeParams.journal_id;
  const currDate = routeParams.month + '/'+routeParams.day+"/"+routeParams.year;
  let prompt = "";
  let content = "";
  let date = "";
  let entry = null;

  const entryQuery = {
    date: currDate
  };
  entry = await diaries_collection.findOne(entryQuery);
  //I'm assuming that the diary always exists here
  if(entry){
    console.log("Entry already present: ", entry.content);
  }else{
      console.log("Entry not present: ");
      entry = {
          prompt : PROMPTS[Math.floor(Math.random()*PROMPTS.length)],
          content : "",
          date : currDate
      }
      diaries_collection.insertOne(entry, function(err, result){
          console.log(err);
      });
  }
  entry = await diaries_collection.findOne(entryQuery);
  if(entry){
    console.log("Inserted : ", entry);
  }else{
    console.log("Did not insert!!!");
  }
  console.log("Entry: ",entry);
  res.json(entry);

}

async function updateDiaryEntry(req, res){
  console.log("In update entry method");
  const routeParams = req.params;
  const journal_id = routeParams.journal_id;
  const currDate = routeParams.month + '/'+routeParams.day+"/"+routeParams.year;
  const textContent = routeParams.content;
  console.log("Text content: ", textContent);
  const query = {
    id: journal_id
  };
  const entryQuery = {
    date: currDate
  };
  let entry = await diaries_collection.findOne(entryQuery);
  if(entry){
    console.log("FOUND IT: ", entry);
  }else{
    console.log("Did not find it!!!");
  }


  let results = await diaries_collection.updateOne(entryQuery, {$set:{content:textContent}} );
  entry = await diaries_collection.findOne(entryQuery);
  if(entry){
    console.log("STILL THERE AFTER UPDATE", entry);
  }else{
    console.log("CAN'T FIND IT AFTER UPDATE ");
  }

  //console.log("ENTRY ENTRY ENTRY was it updated? ", entry.content);
  //console.log("Done updating for : ", entryQuery, "diaries_collection: ", diaries_collection);
  //update the entry



}

//app.get('/goTo/:journal_id', initializeDiary);
//pp.get('/id/', onCreateDiary);
function onViewIndex(req, res) {
  res.render('index');
}
app.get('/create', onCreateDiary);
app.get('/id/:journal_id', initializeDiary);

app.get('/', onViewIndex);
app.get('/getEntry/:journal_id/:month/:day/:year', getDiaryEntry);
app.get('/updateEntry/:journal_id/:month/:day/:year/:content',updateDiaryEntry);

main();


