// @ts-check

// HTMLCanvasElements

/** @type {HTMLCanvasElement} */
let cExpEnv;
// region usefullGlobals
// enviroment
const OBSERVE = 1;
const SELECT = 2;
const SEND = 3;
// msg
const NODE_SELECT = 1;
const ACTOR_SELECT = 2;
const CITY_NAMES = [
  "rustmire",
  "knightdrift",
  "kiltown",
  "heartscar",
  "clearmount",
  "frostview",
  "steamminster",
  "silentstall",
  "basinburn",
  "cloudrest",
  "glimmerpoint",
  "hazelfrost",
  "lagoonbreach",
  "shadetide",
  "blackbourne",
  "whitbreach",
  "scorchforest",
  "steelford",
  "flathallow",
  "magefield"
];
/** @type {cEnum} */
let colourEnum = [
  getC( hues.reds, shades.mediumLight ).hex,
  getC( hues.oranges, shades.mediumLight ).hex,
  getC( hues.yellows, shades.mediumLight ).hex,
  getC( hues.greens, shades.mediumLight ).hex,
  getC( hues.blues, shades.mediumLight ).hex,
  getC( hues.purples, shades.mediumLight ).hex
];
colourEnum.r = colourEnum[0];
colourEnum.o = colourEnum[1];
colourEnum.y = colourEnum[2];
colourEnum.g = colourEnum[3];
colourEnum.b = colourEnum[4];
colourEnum.p = colourEnum[5];

// endregion

class Actor {
  /**
   * Creates an instance of Actor.
   * @constructor
   * @param {p5} p5
   * @param {number} colour
   * @param {string} parent
   * @param {?string} id
   * @param {string} name
   * @memberof Actor
   */ /**
   * Creates an instance of Actor.
   * @constructor
   * @param {p5} p5
   * @param {string} id
   * @memberof Actor
   */

  constructor( p5, colour, parent, name, id ) {
    if ( arguments.length === 2 ) {
    }
    if ( arguments.length ) {
      this.id = hash( new Date().getTime().toString() );
      /**
       * @type {ServerNode}
       */
      this.parent = nodeList.filter( value => {
        return value.id === parent;
      } )[0];
      this.s = new Sprite(
        p5,
        this.parent.s.position.x,
        this.parent.s.position.y,
        50,
        50
      );
      this.type = colour;
      this.name = name;
    } else {
      let p = importedData.actorList.filter( d => {
        return id === d.id;
      } )[0];
      this.id = p.id;
      this.type = p.type;
      this.name = p.name;
      this.s = new Sprite(
        p5,
        this.parent.s.position.x,
        this.parent.s.position.y,
        50,
        50
      );
    }
  }
}

class ServerNode {}

class Message {}

// region global Variables
let actorList = [];

let messageList = [];
/** @type {ServerNode[]} */
let nodeList = [];
// endregion

let choiceRadio;
// region fireBaseSetupStuff
var config = {
  apiKey: "AIzaSyCZh7bDhcHYesPc0FeKxriL7EZ2Kopk2us",
  authDomain: "awesomesaucerupert.firebaseapp.com",
  databaseURL: "https://awesomesaucerupert.firebaseio.com",
  projectId: "awesomesaucerupert",
  storageBucket: "awesomesaucerupert.appspot.com",
  messagingSenderId: "465094389233"
};
firebase.initializeApp( config );
let hasData = false;
let database = firebase.database().ref( "exerciseTwo" );
let importedData;
p5.prototype.getFirebaseData = function() {
  let ret = {};
  let self = this;
  database.once( "value", snapshot => {
    let d = snapshot.val();
    for ( let prop in d ) {
      ret[prop] = d[prop];
    }
    console.log( ret );
    self._decrementPreload();
  } );
  return ret;
};
p5.prototype.registerPreloadMethod( "getFirebaseData", p5.prototype );
function preload() {
  importedData = getFirebaseData();
}
// endregion
function setup() {
  console.log( importedData );
  let wh = document.getElementById( "canvasContainer" );
  cExpEnv = createCanvas( wh.offsetWidth, wh.offsetHeight );
  cExpEnv.parent( "canvasContainer" );
  background( getC( 2, 5 ).hex );
  setupAddBox();
  let y = new Actor();
}

function draw() {}

function setupAddBox() {
  /** @type {Element} */
  choiceRadio = createRadio();
  choiceRadio.option( "red", 0 );
  choiceRadio.option( "orange", 1 );
  choiceRadio.option( "yellow", 2 );
  choiceRadio.option( "green", 3 );
  choiceRadio.option( "blue", 4 );
  choiceRadio.option( "purple", 5 );
  choiceRadio.parent( "#colourChooser", 6 );
  choiceRadio.style( "padding", "5px" );
  let name = createInput( "name", "text" );
  name.parent( "#addBox" );
  createP( "Selected Server Node:" )
    .class( "h5" )
    .id( "serverNodeAdd" )
    .parent( "#addBox" );
  let selectedServerNode = createSpan( "Name" ).parent( "#serverNodeAdd" );
  let createBut = createButton( "Create" ).parent( "#addBox" );
}
