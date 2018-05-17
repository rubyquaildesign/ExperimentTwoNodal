// @ts-check

// HTMLCanvasElements

/** @type {HTMLCanvasElement} */
let cExpEnv;
// region usefullGlobals
/* eslint-disable no-unused-vars */
// enviroment
const OBSERVE = 1;
const SELECT = 2;
const SEND = 3;
// msg
const NODE_SELECT = 1;
const ACTOR_SELECT = 2;
const CITY_NAMES = [
  "Harhaven",
  "Ashhampton",
  "Hartburgh",
  "Henwike",
  "Eastmouth Head",
  "Langley",
  "Nether Westdon",
  "Oxhampton",
  "Foxthorpe",
  "Dunthorpe Cross",
  "Northwood",
  "Barcaster",
  "Millburn Green",
  "Market Henbury",
  "Dunwell Head",
  "Kirwich",
  "Guildport",
  "Westley",
  "Heath",
  "Kinington",
  "Upper Moorburgh",
  "Kinburgh",
  "Marshampton",
  "Hartington",
  "Woolmouth",
  "Redhurst",
  "Westpool Heath",
  "Oulhaven",
  "Blackchester",
  "Oakbrook",
  "Guildcaster Green",
  "Overwell",
  "Ashmoor",
  "Westchester",
  "Hazelfield",
  "Market",
  "Hindford",
  "Hartwich",
  "Overbury",
  "Ilhall",
  "Great Woolwich",
  "Preswich",
  "Oxley",
  "Upper Ashburgh",
  "Normoor",
  "Thornthorpe",
  "Loxley",
  "Foxworth",
  "Great",
  "Hazelby",
  "Little Langwell",
  "Blackfield Lake",
  "Little Kinham",
  "Upper Oulwick",
  "Northfold",
  "Newbrook",
  "Cross",
  "Westwick",
  "Thornfold Head",
  "Blackleigh",
  "Oakfield Green",
  "Nether Hartby",
  "Oxleigh"
]; // eslint-disable-next-line no-unused-vars
/* eslint-enable no-unused-vars */
// @ts-ignore
/** @type {cEnum} */ let colourEnum = [
  getC( hues.reds, shades.light ).hex,
  getC( hues.oranges, shades.light ).hex,
  getC( hues.yellows, shades.light ).hex,
  getC( hues.greens, shades.light ).hex,
  getC( hues.blues, shades.light ).hex,
  getC( hues.purples, shades.light ).hex
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
   *
   * @memberof Actor
   */

  constructor( p5, colour, parent, name ) {
    if ( arguments.length === 2 ) {
      this.id = arguments[1];
      let p = importedData.actorList.filter( a => this.id === a.id )[0];
      Object.assign( this, p );
    } else {
      this.id = hash( new Date().getTime().toString() );
      this.pId = parent;
      /**
       * @type {ServerNode}
       */
      this.parent = nodeList.filter( value => {
        return value.id === parent;
      } )[0];
      this.s = new Sprite( p5, 0, 0, 50, 50 );
      this.type = colour;
      this.name = name;
    }
    this.s = new Sprite( p5, 0, 0, 50, 50 );
    this.s.draw = () => {
      noStroke();
      fill( colourEnum[this.type] );
      ellipse( 0, 0, 40, 40 );
      fill( colourEnum[( 6 + this.type + 1 ) % 6] );
      arc( 0, 0, 40, 40, PI / 2, PI + PI / 3, CHORD );
      fill( colourEnum[( 6 + this.type + -1 ) % 6] );
      arc( 0, 0, 40, 40, TWO_PI - PI / 3, PI / 2, CHORD );
    };
  }
}

class ServerNode {
  /**
   * Creates an instance of ServerNode.
   * @param {p5} p5
   * @param {number} mainType
   * @param {number[]} blockedTypes
   * @param {string} [id]
   * @memberof ServerNode
   */
  constructor( p5, mainType, blockedTypes, id ) {
    if ( arguments.length === 2 ) {
      this.id = arguments[1];
      let p = importedData.nodeList.filter( d => {
        return this.id === d.id;
      } )[0];
      Object.assign( this, p );
    } else {
      this.mainType = mainType;
      this.blockedTypes = blockedTypes;
      this.id = hash( new Date().getTime().toString() );
    }
    this.s = new Sprite( p5, 0, 0, 100, 100 );
    this.members = actorList.filter( a => this.id === a.pId );
    this.messages = messageList.filter( m => m.targetId === this.id );
    this.rotation = 0;
    this.s.draw = () => {
      let sAng = 0;
      let eAng = TWO_PI / 6;
      for ( let i = 0; i < 6; i++ ) {
        noStroke();
        if ( this.blockedTypes.includes( i ) ) fill( 100 );
        else fill( colourEnum[i] );
        arc( 0, 0, 25, 25, sAng, eAng );
        sAng = eAng;
        eAng += TWO_PI / 6;
      }
      noStroke();
      fill( colourEnum[mainType] );
      ellipse( 0, 0, 10, 10 );
      stroke( 100 );
      strokeWeight( 2 );
      noFill();
      ellipse( 0, 0, 100, 100 );
    };
    this.s.mousePressed = () => {
      this.selected = true;
      selected = this;
    };
  }
  update() {
    this.s.display();
    let deltaAng = TWO_PI / max( this.members.length, 1 );
    this.rotation += TWO_PI / 600;
    let ang = 0;
    for ( let [i, x] of this.members.entries() ) {
      let pos = createVector( 0, -100 );
      pos.rotate( ang );
      pos.rotate( this.rotation );
      ang += deltaAng;
      pos.add( this.s.position );
      x.s.position = pos;
      let headDir = p5.Vector.sub( x.s.position, this.s.position );
      x.s.rotation = headDir.heading();
    }
  }
}

class Message {
  constructor( p5, sourceId, targetId, directed, id ) {
    if ( arguments.length === 2 ) {
      this.id = arguments[1];
      /** @type {Message} */
      let m = importedData.messageList.filter( m => m.id === this.id )[0];

      Object.assign( this, m );
    } else {
      this.id = hash( new Date().getTime().toString() );
      this.direct = directed;
      this.sId = sourceId;
      this.sourceType = 0;
      this.tId = targetId;
      this.targetType = 1;
    }
    /** @type {Sprite} */
    this.s = new Sprite( p5, 0, 0, 15, 15 );
    this.s.limitSpeed = 0.7;
    this.s.draw = () => {
      noStroke();
      fill( colourEnum[this.sourceType] );
      ellipse( 0, 0, 7 );
      fill( colourEnum[this.targetType] );
      ellipse( 0, 0, 4, 4 );
    };
  }
  init() {
    this.source = actorList.filter( a => this.sId === a.id )[0];
    if ( this.direct ) this.target = actorList.filter( a => this.tId === a.id )[0];
    else this.target = nodeList.filter( a => this.tId === a.id )[0];

    if ( !this.direct ) {
      this.s.position = createVector( 0, -40 );
      this.s.position.rotate( random( TWO_PI ) );
      /** @type {p5.Vector} */
      let velo = this.s.position;
      this.s.position = p5.Vector.add( this.s.position, this.target.s.position );
      velo.rotate( PI / 2 );
      if ( random() > 0.5 ) velo.rotate( PI );
      velo.limit( 2 + random() );
      this.s.setVelocity( velo.x, velo.y );
    }
  }
  update() {
    if ( p5.Vector.dist( this.target.s.position, this.s.position ) > 20 ) {
      let t = this.target.s.position;
      this.s.attractionPoint( 0.3, t.x, t.y );
    }
    this.s.update();
    this.s.display();
  }
}

// region global Variables
let actorList = [];

let messageList = [];
/** @type {ServerNode[]} */
let nodeList = [];
// endregion
/** @type {p5.Element} */
let choiceRadio;
let selected = {};
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
let database = firebase.database().ref( "exerciseTwo" );
let importedData;
// @ts-ignore
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
// @ts-ignore
p5.prototype.registerPreloadMethod( "getFirebaseData", p5.prototype );
function preload() {
  // @ts-ignore
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
  let noOfNodes = 3;
  let sites = getSomePointsYall( noOfNodes, 5 );
  for ( let s of sites ) {
    let sN = new ServerNode( this, 3, [] );
    sN.s.position = createVector( ...s );
    nodeList.push( sN );
    for ( let i of d3.range( floor( random( 5 ) ) ) ) {
      let a = new Actor( this, floor( random( 2 + i ) ), sN.id, "craig" );

      actorList.push( a );
    }
    for ( let i of d3.range( floor( random( 32 ) ) ) ) {
      let b = new Message( this, "00000", sN.id, false );
      b.init();
      b.sourceType = floor( random( 6 ) );
      b.targetType = b.sourceType;
      messageList.push( b );
    }
  }
}

function draw() {
  background( getC( 2, 6 ).hex );
  for ( let n of nodeList ) {
    n.members = actorList.filter( a => n.id === a.pId );
    n.update();
  }
  for ( let m of messageList ) {
    m.update();
  }
  for ( let a of actorList ) {
    a.s.display();
  }
}
function mousePressed() {
  let x = new Actor( this, 5, "000000", "craig" );
  x.s.position.x = mouseX;
  x.s.position.y = mouseY;
  actorList.push( x );
}
function setupAddBox() {
  // @ts-ignore
  // @ts-nocheck
  choiceRadio = createRadio();
  choiceRadio.option( "red", 0 );
  choiceRadio.option( "orange  ", 1 );
  choiceRadio.option( "yellow  ", 2 );
  choiceRadio.option( "green  ", 3 );
  choiceRadio.option( "blue  ", 4 );
  choiceRadio.option( "purple", 5 );
  choiceRadio.parent( "#colourChooser" );
  choiceRadio.style( "padding", "5px" );
  let name = createInput( "name", "text" );
  name.parent( "#addBox" );
  createP( "Selected Server Node:" )
    .class( "h5" )
    .id( "serverNodeAdd" )
    .parent( "#addBox" );
  // @ts-check
  let selectedServerNode = createSpan( "Name" ).parent( "#serverNodeAdd" );
  let createBut = createButton( "Create" ).parent( "#addBox" );
}
function getSomePointsYall( noPoints, noRelax ) {
  /**
   * @type {[number,number][]}
   */
  let points = d3.range( noPoints ).map( i => {
    return [random() * width - 100, random() * height - 100];
  } );
  let vor = d3.voronoi().size( [width - 100, height - 100] );
  for ( let r = 0; r < noRelax; r++ ) {
    let polys = vor( points ).polygons();
    for ( let [i, p] of polys.entries() ) {
      points[i] = d3.polygonCentroid( p );
    }
  }
  return points.map( i => [i[0] + 50, i[1] + 50] );
}
