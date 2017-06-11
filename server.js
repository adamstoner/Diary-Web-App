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
  diaries_collection = db.collection('diaries');


  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
};

async function onCreateDiary(req, res) {
  let id = new ObjectID();
  console.log("Create entry: ");
  console.log("ID: ", id);
  const routeParams = req.params;
  let unique_id = id;
  let entry = {
    prompt = "";
    content = "";
    date = "";
  }
  let doc = {
    id : unique_id,
    entries : db.collection(unique_id).insert(entry)
  };
  diaries_collection.insertOne(doc, function(err, result){

  });


  const response = doc;
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
  res.render('lookup', placeholders);
}
async function getDiaryEntry(req, res){
  const routeParams = req.params;
  const journal_id = routeParams.journal_id;
  const currDate = routeParams.date;
  let prompt = "";
  let contents = "";
  let date = "";
  let entry;
  const query = {
    id: journal_id
  };
  const entryQuery = {
    date: routeParams.date
  };
  let diary = await diaries_collection.findOne(query);
  let entry = await diary.entries.findOne(entryQuery);

  //I'm assuming that the diary always exists here
  if(entry){

  }else{
      entry = {
          prompt = [PROMPTS[Math.floor(Math.random()*PROMPTS.length)], ""];
          content = "";
          date = routeParams.date;
      }
      diary.entries.insertOne(entry, function(err, result){

      });
  }
  console.log("Entry: ",entry);
  res.json(entry);

}

async function updateEntry(req, res){
  const routeParams = req.params;
  const journal_id = routeParams.journal_id;
  const currDate = routeParams.date;
  const textContent = routeParams.content;
  const query = {
    id: journal_id
  };
  const entryQuery = {
    date: routeParams.date
  };

  let diary = await diaries_collection.findOne(query);
  let results= await diary.entries.update(entryQuery, {content:textContent});

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
app.get('/getEntry/:journal_id-:date', getDiaryEntry);
app.get('/updateEntry/:journal_id-:date/:content',updateDiaryEntry);

main();

////////////////////////////////////////////////////////////////////////////////

// TODO(you): Add at least 1 GET route and 1 POST route.
