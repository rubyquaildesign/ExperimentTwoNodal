// @ts-check

// HTMLCanvasElements

/** @type {HTMLCanvasElement} */
let cExpEnv;
// region usefullGlobals
/* eslint-disable no-unused-vars */
// enviroment
const OBSERVE = 1;
const SELECT = 2;
const TARGET = 3;
// msg
const M_ENUM = ["", "select node", "select", "select recepient"];
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
// eslint-disable-next-line no-unused-vars
/* eslint-enable no-unused-vars */
// @ts-ignore
/** @type {cEnum} */ let colourEnum = [
  getC(hues.reds, shades.light).hex,
  getC(hues.oranges, shades.light).hex,
  getC(hues.yellows, shades.light).hex,
  getC(hues.greens, shades.light).hex,
  getC(hues.blues, shades.light).hex,
  getC(hues.purples, shades.light).hex
];
colourEnum.r = colourEnum[0];
colourEnum.o = colourEnum[1];
colourEnum.y = colourEnum[2];
colourEnum.g = colourEnum[3];
colourEnum.b = colourEnum[4];
colourEnum.p = colourEnum[5];

// endregion

/** Class representing an Actor */
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
   */
  /**
   * Creates an instance of Actor.
   * @constructor
   * @param {p5} p5
   *
   * @param {any} p5
   * @param {any} colour
   * @param {any} parent
   * @param {any} name
   * @memberof Actor
   */

  constructor(p5, colour, pId, name) {
    if (arguments.length === 2) {
      this.id = arguments[1];

      let p = importedData.actorList.filter(a => this.id === a.id)[0];
      Object.assign(this, p);
    } else {
      /** @type {string} */
      this.id = hash(
        Number(new Date().getTime() + Math.floor(random() * 200)).toString()
      );
      this.pId = pId;

      this.type = colour;
      this.name = name;
    }
    this.timeSincePost = 5 * 60;
    this.parent = nodeList.filter(value => {
      return value.id === this.pId;
    })[0];
    /** @type {Sprite} */
    this.s = createSprite(0, 0, 40, 40);
    this.s.mouseActive = true;
    // this.s.debug = true;
    this.s.setCollider("circle", 0, 0, 20);
    this.s.draw = () => {
      this.timeSincePost++;
      if (selected === this) scale(1.6);
      noStroke();
      fill(colourEnum[this.type]);
      ellipse(0, 0, 40, 40);
      fill(colourEnum[(6 + this.type + 1) % 6]);
      arc(0, 0, 40, 40, PI / 2, PI + PI / 3, CHORD);
      fill(colourEnum[(6 + this.type + -1) % 6]);
      arc(0, 0, 40, 40, TWO_PI - PI / 3, PI / 2, CHORD);
      rotate(radians(-this.s.rotation));
      fill(255);
      stroke(55);
      strokeWeight(0.5);
      textSize(12);
      textAlign(CENTER, CENTER);
      text(this.name.substring(0, 2), 0, 0);
    };

    this.s.onMousePressed = () => {
      switch (mode) {
        case SELECT:
          updateSelected(this);
          break;
        case NODE_SELECT:
          updateSelected();
          break;
        case TARGET:
          confirmSend(this);
          break;
      }
    };
  }
}

/** A Class representing serverNodes */
class ServerNode {
  /**
   * Creates an instance of ServerNode.
   * @constructor
   * @param {p5} p5
   * @param {number} mainType
   * @param {number[]} blockedTypes
   * @memberof ServerNode
   */

  constructor(p5, mainType, blockedTypes) {
    if (arguments.length === 2) {
      /** @type {String} */
      this.id = arguments[1];
      let p = importedData.nodeList.filter(d => {
        return this.id === d.id;
      })[0];
      Object.assign(this, p);
    } else {
      this.mainType = mainType;
      this.evaluateOn20 = false;
      /** @type {number[]} */
      this.blockedTypes = blockedTypes;
      this.id = hash(
        Number(new Date().getTime() + Math.floor(random() * 200)).toString()
      );
      let pickNew = false;
      while (!pickNew) {
        this.name = random(CITY_NAMES);
        if (!usedNames.includes(this.name)) pickNew = true;
      }
      usedNames.push(this.name);
    }
    this.s = createSprite(0, 0, 100, 100);
    /** @type {Actor[]} */
    this.members = actorList.filter(a => this.id === a.pId);
    /** @type {Message[]} */
    this.messages = messageList.filter(m => m.targetId === this.id);
    this.rotation = 0;
    this.s.mouseActive = true;
    this.s.setCollider("circle", 0, 0, 50);
    this.s.draw = () => {
      if (selected === this) scale(1.4);
      let sAng = 0;
      let eAng = TWO_PI / 6;
      for (let i = 0; i < 6; i++) {
        for (let i = 0; i < 6; i++) {
          noStroke();
          if (this.blockedTypes.includes(i)) fill(100);
          else fill(colourEnum[i]);
          arc(0, 0, 25, 25, sAng, eAng);
          sAng = eAng;
          eAng += TWO_PI / 6;
        }
        fill(colourEnum[this.mainType]);
        ellipse(0, 0, 10, 10);
        stroke(100);
        strokeWeight(2);
        noFill();
        ellipse(0, 0, 100, 100);
      }

      this.s.onMousePressed = () => {
        switch (mode) {
          case SELECT:
            updateSelected(this);
            break;
          case NODE_SELECT:
            confirmMove(this);
            break;
          case TARGET:
            updateSelected();
            break;
        }
      };
      // this.s.debug = true;
    };
  }
  update() {
    if (this.messages.length % 20 > 10) this.evaluateOn20 = true;
    if (frameCount % 30 === 0) {
      this.messages = [];
      for (let m of messageList) {
        if (m.target === this) this.messages.push(m);
      }
      if (
        this.messages.length % 20 === 0 &&
        this.messages.length > 3 &&
        this.evaluateOn20
      ) {
        let cCounts = [0, 0, 0, 0, 0, 0];
        for (let m of this.messages) cCounts[m.targetType] += 1;
        // Get Most Populous
        let highestP = max(cCounts);
        let mostPop = cCounts.findIndex(d => d === highestP);
        this.mainType = mostPop;
        if (this.blockedTypes.includes((mostPop + 6 + 1) % 6)) {
          if (random() > 0.4)
            this.blockedTypes.splice(
              this.blockedTypes.indexOf((mostPop + 6 + 1) % 6),
              1
            );
        } else if (this.blockedTypes.includes((mostPop + 6 - 1) % 6)) {
          if (random() > 0.4)
            this.blockedTypes.splice(
              this.blockedTypes.indexOf((mostPop + 6 - 1) % 6),
              1
            );
        }
        let lowestP = min(cCounts);
        let leastPop = cCounts.findIndex(d => d === lowestP);
        if (!this.blockedTypes.includes((leastPop + 6 + 1) % 6)) {
          if (random() > 0.4) this.blockedTypes.push((leastPop + 6 + 1) % 6);
        } else if (!this.blockedTypes.includes((leastPop + 6 - 1) % 6)) {
          if (random() > 0.4) this.blockedTypes.push((leastPop + 6 - 1) % 6);
        }

        this.evaluateOn20 = false;
      }
    }
    drawSprite(this.s);
    let deltaAng = TWO_PI / max(this.members.length, 1);
    this.rotation += TWO_PI / 600;
    let ang = 0;

    for (let x of this.members) {
      let pos = createVector(0, -100);
      pos.rotate(ang);
      pos.rotate(this.rotation);
      ang += deltaAng;
      pos.add(this.s.position);
      x.s.position = pos;
      let headDir = p5.Vector.sub(x.s.position, this.s.position);
      x.s.rotation = headDir.heading() / TWO_PI * 360 - 90;
    }
  }
}

class Message {
  constructor(p5, sourceId, targetId, directed) {
    if (arguments.length === 2) {
      this.id = arguments[1];

      let m = importedData.messageList.filter(m => m.id === this.id)[0];

      Object.assign(this, m);
    } else {
      this.id = hash(
        Number(new Date().getTime() + Math.floor(random() * 200)).toString()
      );
      this.destroyed = false;
      this.direct = directed;
      this.sId = sourceId;
      this.sourceType = 0;
      this.tId = targetId;
      this.targetType = 1;
      this.added = false;
    }
    /** @type {Sprite} */

    this.s = createSprite(0, 0, 15, 15);
    this.s.limitSpeed(0.4);
    this.s.draw = () => {
      noStroke();
      fill(colourEnum[this.sourceType]);
      ellipse(0, 0, 7);
      fill(colourEnum[this.targetType]);
      ellipse(0, 0, 4, 4);
    };
  }
  init() {
    this.source = actorList.filter(a => this.sId === a.id)[0];
    if (!this.direct) this.target = actorList.filter(a => this.tId === a.id)[0];
    else this.target = nodeList.filter(a => this.tId === a.id)[0];
    this.s.limitSpeed(0.4);
    this.source = actorList.filter(a => this.sId === a.id)[0];
    if (this.target === undefined) {
      if (this.direct)
        this.target = actorList.filter(a => this.tId === a.id)[0];
      else this.target = nodeList.filter(a => this.tId === a.id)[0];
    }

    if (!this.added) {
      this.s.position = createVector(0, -40);
      this.s.position.rotate(random(TWO_PI));
      /** @type {p5.Vector} */
      let velo = this.s.position;
      this.s.position = p5.Vector.add(this.s.position, this.target.s.position);
      velo.rotate(PI / 2);
      if (random() > 0.5) velo.rotate(PI);
      if (!this.added) velo.limit(2 + (random() - 0.5));
      else velo.limit(4 + (random() - 0.5));
      this.s.setVelocity(velo.x, velo.y);
    }

    if (this.added) {
      this.s.position = this.source.s.position;
      this.s.limitSpeed(0.0004);
    }
    if (this.direct) {
      this.s.friction = 0.06;
      this.s.setVelocity(0, 0);
    }
  }
  update() {
    if (this.target === undefined) return;
    if (this.added)
      this.s.collide(this.target.s, () => {
        this.added = false;
        if ("blockedTypes" in this.target) {
          if (this.target.blockedTypes.includes(this.targetType)) {
            this.destroyed = true;
            let i = messageList.indexOf(this);
            messageList.splice(i, 1);
            return;
          }
        }
        if (!this.direct) this.init();
        else {
          if (this.recip === undefined) {
            let i = messageList.indexOf(this);
            messageList.splice(i, 1);
            return 0;
          } else {
            this.added = true;
            this.target = this.recip;
            this.recip = undefined;
          }
        }
      });

    if (p5.Vector.dist(this.target.s.position, this.s.position) > 15) {
      let t = this.target.s.position;
      this.s.attractionPoint(0.4, t.x, t.y);
    }
    if (p5.Vector.dist(this.target.s.position, this.s.position) > 45) {
      let t = this.target.s.position;
      this.s.attractionPoint(0.3, t.x, t.y);
    }

    drawSprite(this.s);
  }
}

// region global Variables
let actorList = [];

let usedNames = [];
let messageList = [];
/** @type {ServerNode[]} */
let nodeList = [];
let selectedColor = 0;
// endregion
/** @type {p5.Element} */
let choiceRadio;

let mode;
/** @type {Actor|ServerNode|null} */
let selected = null;
let selectedServerNodeElt;
// region fireBaseSetupStuff
var config = {
  apiKey: "AIzaSyCZh7bDhcHYesPc0FeKxriL7EZ2Kopk2us",
  authDomain: "awesomesaucerupert.firebaseapp.com",
  databaseURL: "https://awesomesaucerupert.firebaseio.com",
  projectId: "awesomesaucerupert",
  storageBucket: "awesomesaucerupert.appspot.com",
  messagingSenderId: "465094389233"
};
// region Firebase
firebase.initializeApp(config);
let d = firebase.database();
let database = firebase.database().ref("exerciseTwo");
let importedData;
// @ts-ignore
p5.prototype.getFirebaseData = function() {
  let ret = {};
  let self = this;

  database.once("value", snapshot => {
    let d = snapshot.val();
    for (let prop in d) {
      ret[prop] = d[prop];
    }
    self._decrementPreload();
  });
  return ret;
};
// @ts-ignore
p5.prototype.registerPreloadMethod("getFirebaseData", p5.prototype);
function preload() {
  // @ts-ignore
  importedData = getFirebaseData();
}
// endregion
function postMsg(type) {
  /** @type {Actor} */
  let s;
  if ("type" in selected) s = selected;
  if (s.timeSincePost < 0 * 60) {
    select("#actionError").html("Please Wait 5 Seconds between Posts");
    return;
  } else select("#actionError").html("");
  let m = new Message(this, s.id, s.parent.id, false);
  m.targetType = type;
  m.sourceType = type;
  m.added = true;
  m.init();
  messageList.push(m);
  s.timeSincePost = 0;
}
// endregion
function setup() {
  mode = ACTOR_SELECT;
  console.log(importedData);
  let wh = document.getElementById("canvasContainer");
  cExpEnv = createCanvas(wh.offsetWidth, wh.offsetHeight);
  cExpEnv.parent("canvasContainer");
  background(getC(2, 5).hex);
  textFont("Ubuntu Mono");

  setupAddBox();
  let noOfNodes = 5;
  let sites = getSomePointsYall(noOfNodes, 5);
  for (let s of sites) {
    let sN = new ServerNode(this, 3, [0, 4, 5]);
    sN.s.position = createVector(...s);
    nodeList.push(sN);

    for (let i of d3.range(floor(random(5)))) {
      let a = new Actor(this, floor(random(2 + i)), sN.id, "craig");

      actorList.push(a);
    }
    d3.range(floor(18)).map(() => {
      let b = new Message(this, "00000", sN.id, false);
      b.init();
      b.sourceType = floor(random(6));
      b.targetType = b.sourceType;
      messageList.push(b);
    });
  }
}

function draw() {
  background(getC(2, 6).hex);
  if (mode !== SELECT) {
    fill(0, 60);
    rect(0, 0, width, height);
  }
  textSize(18);
  text("Mode: " + M_ENUM[mode], 20, 20);
  for (let n of nodeList) {
    n.members = actorList.filter(a => n.id === a.pId);
    n.update();
  }
  for (let m of messageList) {
    m.update();
  }
  for (let a of actorList) {
    a.s.display();
  }
}
let tripUp = false;
function mousePressed() {
  if (mouseY > height) return 0;
  if (mode !== SELECT && !tripUp) tripUp = true;
  else updateSelected();
}
function setupAddBox() {
  // @ts-ignore
  // @ts-nocheck
  createP("")
    .id("createError")
    .class("body")
    .parent("#addBox")
    .style("color", "red");
  choiceRadio = createRadio();

  choiceRadio.option("red", 0);
  choiceRadio.option("orange", 1);
  choiceRadio.option("yellow", 2);
  choiceRadio.option("green", 3);
  choiceRadio.option("blue", 4);
  choiceRadio.option("purple", 5);
  choiceRadio.parent("#colourChooser");
  choiceRadio.style("padding", "5px");
  let n = createSpan("Name: ");
  n.parent("#addBox");
  let name = createInput("", "text");
  name.attribute("placeholder", "Jessie");
  name.parent("#addBox");
  createP("Selected Server Node: ")
    .class("h5")
    .id("serverNodeAdd")
    .parent("#addBox");
  // @ts-check
  selectedServerNodeElt = createSpan("Name").parent("#serverNodeAdd");
  let createBut = createButton("Create")
    .parent("#addBox")
    .class("btn btn-dark");
  createBut.mousePressed(() => {
    let x = choiceRadio.value();
    let y = String(name.value());
    if (selected === null) {
      select("#createError").html("You need to select a Node");
      return;
    }
    if (!("mainType" in selected)) {
      select("#createError").html("You need to select a Node");
      return;
    }
    if (x === "") {
      select("#createError").html("You need to select a colour");
      return;
    }
    if (y === "") {
      select("#createError").html("Input a name");
      return;
    }
    if (usedNames.includes(y)) {
      select("#createError").html("That name is taken");
      return;
    }
    let colo = colourEnum.indexOf(colourEnum[x[0]]);
    let a = new Actor(this, colo, selected.id, y);
    usedNames.push(y);
    d.ref("exerciseTwo/actorList/" + a.id).set({
      id: a.id,
      name: a.name,
      pId: selected.id,
      type: colo
    });
    actorList.push(a);
  });
}
function getSomePointsYall(noPoints, noRelax) {
  /**
   * @type {[number,number][]}
   */
  // @ts-ignore
  let points = d3.range(noPoints).map(() => {
    /** @type {[number,number]} */
    return [random() * width - 100, random() * height - 100];
  });
  let vor = d3.voronoi().size([width - 100, height - 100]);
  for (let r = 0; r < noRelax; r++) {
    let polys = vor(points).polygons();
    for (let [i, p] of polys.entries()) {
      points[i] = d3.polygonCentroid(p);
    }
  }
  return points.map(i => [i[0] + 50, i[1] + 50]);
}
function updateBoxes() {
  let b = select("#infoC");
  b.elt.innerHTML = "";
  b.remove();
  b = createDiv()
    .id("infoC")
    .parent("infoBox");
  b.elt.innerHTML = "";
  let c = select("#aBox");
  c.remove();
  c = createDiv("")
    .class("container")
    .id("aBox")
    .parent("#actionBox");
  if (selected === null) return null;
  createP("id: " + selected.id)
    .class("h5")
    .parent("#infoC");
  if ("type" in selected) {
    // Actor
    createP("Name: " + selected.name)
      .class("h5")
      .parent("#infoC");
    createP("Main Colour: ")
      .class("h5")
      .parent("#infoC")
      .id("PrimaryColour");
    createDiv(" ")
      .style("border-radius", "50%")

      .style("background-color", colourEnum[selected.type])
      .style("width", "15px")
      .style("height", "15px")
      .style("display", "inline-block")
      .parent("#PrimaryColour");
    createP("Seconday Colours: ")
      .class("h5")
      .parent("#infoC")
      .id("SecColour");
    createDiv(" ")
      .style("border-radius", "50%")
      .style("background-color", colourEnum[(selected.type + 6 - 1) % 6])
      .style("width", "15px")
      .style("height", "15px")
      .style("display", "inline-block")
      .parent("#SecColour");
    createDiv(" ")
      .style("border-radius", "50%")
      .style("background-color", colourEnum[(selected.type + 6 + 1) % 6])
      .style("width", "15px")
      .style("height", "15px")
      .style("display", "inline-block")
      .style("margin-left", "3px")
      .parent("#SecColour");
    createP("Node: " + selected.parent.name)
      .parent("#infoC")
      .class("h6");
    prepActions();
  }
  if ("mainType" in selected) {
    // Node
    createP("Name: " + selected.name)
      .class("h5")
      .parent("#infoC");
    createP("Main Colour: ")
      .class("h5")
      .parent("#infoC")
      .id("MainColour");
    createDiv(" ")
      .style("border-radius", "50%")
      .style("background-color", colourEnum[selected.mainType])
      .style("width", "15px")
      .style("height", "15px")
      .style("display", "inline-block")
      .parent("#MainColour");
    createP("Blocked Colours: ")
      .class("h5")
      .parent("#infoC")
      .id("BColour");
    for (let b of selected.blockedTypes)
      createDiv(" ")
        .style("border-radius", "50%")
        .style("background-color", colourEnum[b])
        .style("width", "15px")
        .style("height", "15px")
        .style("display", "inline-block")
        .style("margin", "3px")
        .parent("#BColour");
    createP("Contains: ")
      .class("body")
      .parent("#infoC");
    let row = createDiv("")
      .class("row align-items-start")
      .parent("#infoC");
    let cCounts = [0, 0, 0, 0, 0, 0];
    for (let m of selected.messages) cCounts[m.targetType] += 1;
    for (let [i, x] of cCounts.entries()) {
      let div = createDiv("")
        .class("")
        .parent(row)
        .style("display", "inline-block");
      createDiv(" ")
        .style("border-radius", "5%")
        .style("background-color", colourEnum[i])
        .style("width", "8px")
        .style("height", "12px")
        .style("display", "inline-block")
        .style("margin-left", "6px")
        .parent(div);
      createSpan(":" + x + "")
        .class("body")
        .style("display", "inline")
        .parent(div);
    }
  }
}
function updateSelected(obj) {
  if (selected !== null) {
    if (mode !== ACTOR_SELECT) {
      mode = ACTOR_SELECT;
    }
    selected = null;
  }
  if (obj !== undefined) {
    obj.selected = true;
    selected = obj;
    if (obj.mainType !== undefined)
      selectedServerNodeElt.elt.innerHTML = obj.name;
  } else {
    selectedServerNodeElt.elt.innerHTML = "None";
  }

  updateBoxes();
}
function prepActions() {
  if (!("type" in selected)) throw selected;
  let actions = [
    (selected.type + 6 - 1) % 6,
    selected.type,
    (selected.type + 6 + 1) % 6
  ];
  createP("Post to Node:")
    .class("h5")
    .parent("#aBox");
  let post = createDiv("")
    .class("btn-group")
    .parent("#aBox");
  for (let a of actions) {
    /** @type {p5.Element} */
    let b = createButton("+")
      .class("btn")
      .style("background-color", colourEnum[a])
      .parent(post);
    b.mousePressed(() => postMsg(a));
  }
  createP("Post to an Actor:")
    .class("h5")
    .parent("#aBox");
  let send = createDiv("")
    .class("btn-group")
    .parent("#aBox");
  for (let a of actions) {
    /** @type {p5.Element} */
    let b = createButton("+")
      .class("btn")
      .style("background-color", colourEnum[a])
      .parent(send);
    b.mousePressed(() => sendMessage(a));
  }
  createP("").parent("#aBox");
  let move = createButton("Move")
    .class("btn btn-dark")
    .parent("#aBox");
  move.mousePressed(() => {
    tripUp = false;
    mode = NODE_SELECT;
  });
}
function sendMessage(sourceCol) {
  if (!("type" in selected)) throw sendMessage;
  if (selected.timeSincePost < 5 * 60) {
    select("#actionError").html("Please Wait 5 Seconds between Posts");
    return;
  }
  tripUp = false;

  selected.timeSincePost = 0;
  mode = TARGET;
  selectedColor = sourceCol;
}
function confirmSend(target) {
  if (!("type" in selected)) throw confirmSend;
  if (target === selected) {
    select("#actionError").html("it can't send a message to itself");
    updateSelected();
    return;
  }
  select("#actionError").html("");
  let m = new Message(this, selected.id, target.parent.id, true);
  m.sourceType = selected.type;
  m.targetType = selectedColor;
  m.target = target.parent;
  m.recip = target;
  m.added = true;
  m.direct = true;
  m.init();
  messageList.push(m);
  updateSelected();
}
function confirmMove(target) {
  if (!("type" in selected)) throw confirmSend;
  if (target === selected.parent) {
    select("#actionError").html("You can't move a Node to itself");
    updateSelected();
    return;
  }
  if (target.members.length > 2) {
    select("#actionError").html("That Node is too full");
    updateSelected();
    return;
  }
  select("#actionError").html("");
  selected.parent = target;
  selected.pId = target.id;
  updateSelected();
}
