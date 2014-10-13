
//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2001-2004 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//*****************************************************************************

//=============================================================================
// Card and Stack Objects
//=============================================================================

//-----------------------------------------------------------------------------
// Card constructor function.
//-----------------------------------------------------------------------------

function Card(rank, suit) {

    this.rank = rank;
    this.suit = suit;

    this.createNode = cardCreateNode;
}

//-----------------------------------------------------------------------------
// cardCreateNode(): Returns a DIV node which can be used to display the card 
// on a page.
//-----------------------------------------------------------------------------

// custom part for math21

// These are the defaults
var options = {
    //Reshuffle on deal
    reshuffleOnDeal: true,
    //No. of decks
    numberOfDecks: 2,
    //Target number (Default: 21)
    targetNumber: 21,
    //ACE value 1, 11 or best
    aceValue: 'standard',
    //Hide/Show: split, double, insurance, total
    showSplit: true,
    showDouble: true,
    showInsurance: true,
    showCount: true,
    showBetting: true
};
var optionsInfo = {
    aceValue: "This is advanced stuff man",
    showSplit: "Show Split is REALLY advanced"
};
// Preload graphics.

var cardImg0 = new Image(); cardImg0.src= "img/cardback.gif";
var cardImg1 = new Image(); cardImg1.src= "img/jack.gif";
var cardImg2 = new Image(); cardImg2.src= "img/queen.gif";
var cardImg3 = new Image(); cardImg3.src= "img/king.gif";
var infoDiv = document.createElement('div');
infoDiv.className = 'infoDiv';
function bindInfo(g, keyName){
    g.onclick = function(){
        if(optionsInfo[keyName]){
            infoDiv.innerHTML = optionsInfo[keyName];
            g.parentNode.appendChild(infoDiv);
        }else if(infoDiv.parentNode){
            infoDiv.parentNode.removeChild(infoDiv);
        }
    };
}
function showCounts(){
    var y = ['numberOfDecks', 'targetNumber'];
    for(var x = 0; x < y.length; x++){
        var i = gi(y[x]);
        var t = gi(y[x] + 'Count');
        t.innerHTML = i.value;
    }
}
function showOptions() {
    getOptionsFromLocalStorage();
    gi('optionsDialog').style.visibility = 'visible';
    var o = Object.keys(options);
    for(var x = 0; x < o.length; x++){
        var g = gi(o[x]);
        bindInfo(g, o[x]);
        g.onchange = saveOptions;
        if(g.type === 'checkbox'){
            g.checked = options[o[x]];
        }else{
            g.value = options[o[x]];
        }
    }
    showCounts();
    setTitle();
}
function closeOptions(){
    gi('optionsDialog').style.visibility = 'hidden';
    endRound();
    startRound();
}
function updateCtrlVisibility(){
    // maybe hide some controls
    function showOrHide(b){
        return b ? 'visible' : 'hidden';
    }
    function showOrHideColor(id, b){
        var e = gi(id);
        if(b){
            e.style.color = 'black';
        }else{
            // this was the default background color
            // that was difficult to locate in the dom
            e.style.color = '#ffffc0';
        }
        e.onclick = function(){
            e.style.color = 'black';
        };
    }
    gi('split').style.visibility = showOrHide(options.showSplit);
    gi('double').style.visibility = showOrHide(options.showDouble);
    gi('insurance').style.visibility = showOrHide(options.showInsurance);
    gi('credits').style.visibility = showOrHide(options.showBetting);
    gi('default').style.visibility = showOrHide(options.showBetting);
    gi('increase').style.visibility = showOrHide(options.showBetting);
    gi('decrease').style.visibility = showOrHide(options.showBetting);
    gi('player0Bet').style.visibility = showOrHide(options.showBetting);
    gi('player1Bet').style.visibility = showOrHide(options.showBetting);
    
    showOrHideColor('player0Score', options.showCount);
    showOrHideColor('player1Score', options.showCount);
    showOrHideColor('player2Score', options.showCount);
    showOrHideColor('dealerScore', options.showCount);
}
function setTitle(){
    var t = gi('title');
        t.innerHTML = 'Playing ' + options.targetNumber +
         ' Dealer stands at ' + (parseInt(options.targetNumber,10) - 4);
}
function saveOptions(){
    var o = Object.keys(options);
    for(var x = 0; x < o.length; x++){
        var g = gi(o[x]);
        var v = g[g.type === 'checkbox' ? 'checked':'value'];
        options[o[x]] = v;
        localStorage.setItem(o[x], v);
    }
    updateCtrlVisibility();
    showCounts();
    setTitle();
}
function getOptionsFromLocalStorage(){
    var o = Object.keys(options);
    for(var x = 0; x < o.length; x++){
        var v = localStorage.getItem(o[x]);
        if(v !== null && v !== undefined){
            var g = gi(o[x]);
            if(g.type === 'checkbox'){
                options[o[x]] = v === 'true';
            }else{
                options[o[x]] = v;
            }
        }
    }
}
function cardCreateNode() {

    var cardNode, frontNode, indexNode, spotNode, tempNode, textNode;
    var indexStr, spotChar;

    // This is the main node, a DIV tag.

    cardNode = document.createElement("DIV");
    cardNode.className = "card";

    // Build the front of card.

    frontNode = document.createElement("DIV");
    frontNode.className = "front";

    // Get proper character for card suit and change font color if necessary.

    spotChar = "\u00a0";
    switch (this.suit) {
        case "C" :
            spotChar = "\u2663";
            break;
        case "D" :
            frontNode.className += " red";
            spotChar = "\u2666";
            break;
        case "H" :
            frontNode.className += " red";
            spotChar = "\u2665";
            break;
        case "S" :
            spotChar = "\u2660";
            break;
    }

    // Create and add the index (rank) to the upper-left corner of the card.

    indexStr = this.rank;
    if (this.toString() === "")
        indexStr = "\u00a0";
    spotNode = document.createElement("DIV");
    spotNode.className = "index";
    textNode = document.createTextNode(indexStr);
    spotNode.appendChild(textNode);
    spotNode.appendChild(document.createElement("BR"));
    textNode = document.createTextNode(spotChar);
    spotNode.appendChild(textNode);
    frontNode.appendChild(spotNode);

    // Create and add spots based on card rank (Ace thru 10).

    spotNode = document.createElement("DIV");
    textNode = document.createTextNode(spotChar);
    spotNode.appendChild(textNode);
    if (this.rank == "A") {
        spotNode.className = "ace";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }
    if (this.rank == "3" || this.rank == "5" || this.rank == "9") {
        spotNode.className = "spotB3";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }
    if (this.rank == "2" || this.rank == "3") {
        spotNode.className = "spotB1";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }
    if (this.rank == "2" || this.rank == "3") {
        spotNode.className = "spotB5";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }
    if (this.rank == "4" || this.rank == "5" || this.rank == "6" ||
            this.rank == "7" || this.rank == "8" || this.rank == "9" ||
            this.rank == "10") {
        spotNode.className = "spotA1";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
        spotNode.className = "spotA5";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
        spotNode.className = "spotC1";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
        spotNode.className = "spotC5";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }
    if (this.rank == "6" || this.rank == "7" || this.rank == "8") {
        spotNode.className = "spotA3";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
        spotNode.className = "spotC3";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }
    if (this.rank == "7" || this.rank == "8" || this.rank == "10") {
        spotNode.className = "spotB2";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }
    if (this.rank == "8" || this.rank == "10") {
        spotNode.className = "spotB4";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }
    if (this.rank == "9" || this.rank == "10") {
        spotNode.className = "spotA2";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
        spotNode.className = "spotA4";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
        spotNode.className = "spotC2";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
        spotNode.className = "spotC4";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }

    // For face cards (Jack, Queen or King), create and add the proper image.

    tempNode = document.createElement("IMG");
    tempNode.className = "face";
    if (this.rank == "J")
        tempNode.src = "img/jack.gif";
    if (this.rank == "Q")
        tempNode.src = "img/queen.gif";
    if (this.rank == "K")
        tempNode.src = "img/king.gif";

    // For face cards, add suit characters to the upper-left and lower-right
    // corners.

    if (this.rank == "J" || this.rank == "Q" || this.rank == "K") {
        frontNode.appendChild(tempNode);
        spotNode.className = "spotA1";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
        spotNode.className = "spotC5";
        tempNode = spotNode.cloneNode(true);
        frontNode.appendChild(tempNode);
    }

    // Add front node to the card node.

    cardNode.appendChild(frontNode);

    // Return the card node.

    return cardNode;
}

//-----------------------------------------------------------------------------
// Stack constructor function.
//-----------------------------------------------------------------------------

function Stack() {

    // Create an empty array of cards.

    this.cards = new Array();

    this.makeDeck  = stackMakeDeck;
    this.shuffle   = stackShuffle;
    this.deal      = stackDeal;
    this.cardCount = stackCardCount;
}

//-----------------------------------------------------------------------------
// stackMakeDeck(n): Initializes a stack using 'n' packs of cards.
//-----------------------------------------------------------------------------

function stackMakeDeck(n) {

    var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9",
                                                "10", "J", "Q", "K");
    var suits = new Array("C", "D", "H", "S");
    var i, j, k;
    var m;

    m = ranks.length * suits.length;

    // Set array of cards.

    this.cards = new Array(n * m);

    // Fill the array with 'n' packs of cards.

    for (i = 0; i < n; i++)
        for (j = 0; j < suits.length; j++)
            for (k = 0; k < ranks.length; k++)
                this.cards[i * m + j * ranks.length + k] = new Card(ranks[k], suits[j]);
}

//-----------------------------------------------------------------------------
// stackShuffle(n): Shuffles a stack of cards 'n' times. 
//-----------------------------------------------------------------------------

function stackShuffle(n) {

    var i, j, k;
    var temp;

    // Shuffle the stack 'n' times.

    for (i = 0; i < n; i++)
        for (j = 0; j < this.cards.length; j++) {
            k = Math.floor(Math.random() * this.cards.length);
            temp = this.cards[j];
            this.cards[j] = this.cards[k];
            this.cards[k] = temp;
        }
}

//-----------------------------------------------------------------------------
// stackDeal(): Removes the first card in the stack and returns it.
//-----------------------------------------------------------------------------

function stackDeal() {

    if (this.cards.length > 0)
        return this.cards.shift();
    else
        return null;
}

//-----------------------------------------------------------------------------
// stackCardCount(): Returns the number of cards currently in the stack.
//-----------------------------------------------------------------------------

function stackCardCount() {

    return this.cards.length;
}

// ============================================================================
// Blackjack game.
// ============================================================================

// Constants.

var numPacks      =    4;
var numShuffles   =   10;

var maxSplits     =    3;

var minBet        =    5;
var maxBet        =  100;
var initCredit    = 1000;
var initBet       =   10;

var dealTimeDelay =  750;

// Globals.

var deck;
var burnCard;

var dealer;
var player = new Array(maxSplits + 1);
var curPlayerHand, numPlayerHands;

var credits, defaultBet;
var creditsTextNode, defaultTextNode;

var dealRoundCounter;

// Initialize game on page load.

window.onload = initGame;

function initGame() {

    var i;
    getOptionsFromLocalStorage();
    updateCtrlVisibility();
    setTitle();
    // Locate credits and default bet text nodes on the page.

    creditsTextNode = document.getElementById("credits").firstChild;
    defaultTextNode = document.getElementById("default").firstChild;

    // Initialize player's credits and bet amount.

    credits    = initCredit;
    defaultBet = initBet;
    changeBet(0);
    updateBetDisplay(0);

    // Initialize card deck.

    deck = new Stack();
    newDeck();

    // Create dealer and player hands.

    dealer = new Hand("dealer");
    for (i = 0; i < player.length; i++)
        player[i] = new Hand("player" + i);
}

// ----------------------------------------------------------------------------
// Blackjack hand object.                    
// ----------------------------------------------------------------------------

Hand.prototype.leftIncr  =  2.5;  // For positioning cards.
Hand.prototype.topIncr   =  0.2;
Hand.prototype.rollEvery =  5;

function Hand(id) {

    this.cards = [];

    // Get page elements based on id.

    this.fieldNode     = document.getElementById(id);
    this.cardsNode     = document.getElementById(id + "Cards");
    this.scoreTextNode = document.getElementById(id + "Score").firstChild;
    if (id != "dealer") {
        this.betTextNode    = document.getElementById(id + "Bet").firstChild;
        this.resultTextNode = document.getElementById(id + "Result").firstChild;
    }

    this.reset      = handReset;
    this.addCard    = handAddCard;
    this.removeCard = handRemoveCard;
    this.getScore   = handGetScore;
    this.clearCards = handClearCards;

    // Initialize as an empty hand.

    this.reset();
}

function handReset() {

    // Remove any cards and initialize properties.

    this.clearCards();

    this.cards     = [];
    this.blackjack = false;
    this.split     = false;
    this.doubled   = false;
    this.surrender = false;
    this.left      = 0;
    this.top       = 0;

    this.scoreTextNode.nodeValue  = "\u00a0";
    if (this.betTextNode) {
        this.betTextNode.parentNode.className = "textBox dollars";
        this.betTextNode.nodeValue = "\u00a0";
    }
    if (this.resultTextNode)
        this.resultTextNode.nodeValue = "\u00a0";
}

function handAddCard(card, down) {

    var n;
    var node;

    // Add the given card to the hand.

    n = this.cards.length;
    this.cards[n] = card;

    // Create a card node for display, set as face down if requested.

    node = this.cards[n].createNode();
    if (down)
        node.firstChild.style.visibility = "hidden";

    // Add the card display to the associated card area on the page.

    node.style.left = this.left + "em";
    node.style.top  = this.top  + "em";
    this.cardsNode.appendChild(node);
    this.left += this.leftIncr;
    if (this.cards.length % this.rollEvery === 0)
        this.top = 0;
    else
        this.top += this.topIncr;
}

function handRemoveCard() {

    var card;

    // Remove the last card in the array and save it.

    card = null;
    if (this.cards.length > 0) {
        card = this.cards.pop();

        // Remove the card node from the display and reset position.

        this.cardsNode.removeChild(this.cardsNode.lastChild);
        this.left -= this.leftIncr;
        this.top  -= this.topIncr;
    }

    // Return the card.

    return card;
}

function handGetScore() {

    var i, total;

    total = 0;

    // Total card values counting Aces as one.

    for (i = 0; i < this.cards.length; i++)
        if (this.cards[i].rank == "A")
            total++;
        else {
            if (this.cards[i].rank == "J" || this.cards[i].rank == "Q" ||
                    this.cards[i].rank == "K")
                total += 10;
            else
                total += parseInt(this.cards[i].rank, 10);
        }

    // Change as many ace values to 11 as possible.
    if(options.aceValue === 'standard'){
        for (i = 0; i < this.cards.length; i++)
            if (this.cards[i].rank == "A" && total <= 11)
                total += 10;
    }
    return total;
}

function handClearCards() {

    // Remove the card nodes in the associated card area.

    while (this.cardsNode.lastChild)
        this.cardsNode.removeChild(this.cardsNode.lastChild);
}

// ----------------------------------------------------------------------------
// Game functions.
// ----------------------------------------------------------------------------

function newDeck() {

    // Create a deck.

    deck.makeDeck(options.numberOfDecks);
    deck.shuffle(numShuffles);

    // Set the burn card.

    burnCard = Math.round(Math.random() * 26) + 26;
}

function getNextCard() {

    // If there are no cards left, start a new deck.

    if (deck.cardCount() === 0) {
        alert("New Deck");
        newDeck();
    }
    var x = deck.deal();
    return x;
}

function gi(i){
    return document.getElementById(i);
}

function startRound() {
    var i;

    // maybe reshuffle the cards
    if(options.reshuffleOnDeal){
        deck.shuffle(numShuffles);
    }

    // Reset all hands.

    dealer.reset();
    for (i = 0; i < player.length; i++) {
        player[i].reset();
        if (i > 0)
            player[i].fieldNode.style.display = "none";
    }

    // Start with a single player hand.

    curPlayerHand  = 0;
    numPlayerHands = 1;

    // Enable/disable buttons.

    document.forms.controls.elements.deal.disabled      = true;
    document.forms.controls.elements.increase.disabled  = true;
    document.forms.controls.elements.decrease.disabled  = true;
    DisablePlayButtons();

    // If the burn card was reached, start a new deck.

    if (deck.cardCount() < burnCard) {
        alert("New deck.");
        newDeck();
    }

    // Take the player's bet.

    player[0].bet = defaultBet;
    credits -= player[0].bet;
    updateBetDisplay(0);

    // Start dealing the cards.
    dealRoundCounter = 1;
    dealRound();
}

function dealRound()
{

    // Deal a card to the player or the dealer based on the counter.

    switch(dealRoundCounter)
    {
        case 1:
            player[0].addCard(getNextCard(), false);
            break;
        case 2:
            dealer.addCard(getNextCard(), true);
            break;
        case 3:
            player[0].addCard(getNextCard(), false);
            break;
        case 4:
            dealer.addCard(getNextCard(), false);
            break;
        default:
            // No more cards to deal, play the round.
            playRound();
            return;
    }

    // Update the player's score.

    if (player[0].getScore() === options.targetNumber) {
        player[0].blackjack = true;
        player[0].scoreTextNode.nodeValue = "Blackjack";
    }
    else
        player[0].scoreTextNode.nodeValue = player[0].getScore();

    // Set a timer for the next call.

    dealRoundCounter++;
    setTimeout(dealRound, dealTimeDelay);
}

function playRound() {

    // If dealer's up card is an ace, offer insurance.

    if (dealer.cards[1].rank == "A"){
        document.getElementById('insurance').disabled = false;
    }

    // Check for dealer blackjack.

    if (dealer.getScore() == options.targetNumber) {
        dealer.blackjack = true;
        dealer.scoreTextNode.nodeValue = "Blackjack";
    }

    // If player or dealer has blackjack, end the round.

    if (player[0].blackjack || dealer.blackjack) {
        endRound();
        return;
    }

    // Enable/disable buttons.

    if (canSplit())
        document.forms.controls.elements.split.disabled = false;
    document.forms.controls.elements.double.disabled    = false;
    //document.forms.controls.elements.insurance.disabled = false;
    document.forms.controls.elements.hit.disabled       = false;
    document.forms.controls.elements.stand.disabled     = false;

    // Highlight the player's hand.

    addClassName(player[0].fieldNode, "activeField");
}

function offerInsurance() {
    var amount;

    // Offer insurance bet to player. This is a side bet so it's resolved here.

    // Take half of player's current bet from credits.

    amount = player[0].bet / 2;
    credits -= amount;

    // If the dealer has blackjack, show the down card and pay player at 2 to 1.

    if (dealer.getScore() === options.targetNumber)
    {
        dealer.cardsNode.firstChild.firstChild.style.visibility = "";
        credits += player[0].bet;
        alert("Dealer has Blackjack, you win " + formatDollar(player[0].bet));
    }
    else
        alert("Dealer does not have Blackjack, you lose " + formatDollar(amount));

    // Update credits.

    updateBetDisplay(0);
    document.getElementById('insurance').disabled = true;
}

function playerSplit() {

    var m, n;
    var card, node;

    // Enable/disable buttons.

    DisablePlayButtons();

    // Update the number of player hands.

    m = curPlayerHand;
    n = numPlayerHands;
    numPlayerHands++;

    // Note the split.

    player[m].split = true;
    player[n].split = true;

    // Remove the second card from the current hand and add it to a new hand.

    card = player[m].removeCard();
    player[m].scoreTextNode.nodeValue = player[m].getScore();
    player[n].addCard(card, false);
    player[n].scoreTextNode.nodeValue = player[n].getScore();
    player[n].fieldNode.style.display = "";

    // Update bet and credits.

    player[n].bet = player[m].bet;
    credits -= player[n].bet;
    updateBetDisplay(n);
    updateBetDisplay(n + 1);

    // Give the current hand a second card.

    setTimeout(playerHit, dealTimeDelay);
}

function playerDouble() {

    // Double the player's bet and deal a single card.

    player[curPlayerHand].bet *= 2;
    credits -= defaultBet;
    updateBetDisplay(curPlayerHand);
    player[curPlayerHand].doubled = true;
    player[curPlayerHand].top = 0;
    playerHit();
}

function playerSurrender() {

    // Unhighlight the player's hand.

    removeClassName(player[0].fieldNode, "activeField");

    // Note the surrender and end the round.

    player[0].surrender = true;
    endRound();
}

function playerHit() {

    var n, p;

    // Enable/disable buttons.

    DisablePlayButtons();
    document.forms.controls.elements.hit.disabled   = false;
    document.forms.controls.elements.stand.disabled = false;

    // Give the player another card and find total.

    n = curPlayerHand;
    player[n].addCard(getNextCard(), false);
    p = player[n].getScore();

    // If the player has busted, go to the next hand.

    if (p > options.targetNumber) {
        player[n].scoreTextNode.nodeValue =  "Busted (" + p + ")";
        startNextHand();
        return;
    }
    else
        player[n].scoreTextNode.nodeValue = p;

    // If the player has reached options.targetNumber, or is doubling down, go on to the next hand.

    if (p == options.targetNumber || player[n].doubled) {
        startNextHand();
        return;
    }

    // Handle second card on split hands.

    if (player[n].split && player[n].cards.length == 2) {

        // If Aces were split, go on to next hand.

        if (player[n].split && player[n].cards[0].rank == "A") {
                startNextHand();
                return;
        }

        // Enable/disable buttons.

        document.forms.controls.elements.double.disabled = false;
        if (canSplit())
            document.forms.controls.elements.split.disabled = false;
    }
}

function playerStand() {

    // Go on to the next hand.

    startNextHand();
}

function startNextHand() {

    // Unhighlight the current hand.

    removeClassName(player[curPlayerHand].fieldNode, "activeField");

    // Go on to the next player hand or the dealer.

    curPlayerHand++;
    if (curPlayerHand >= numPlayerHands) {
        startDealer();
        return;
    }
    else {
        addClassName(player[curPlayerHand].fieldNode, "activeField");

        // Enable/disable buttons.

        DisablePlayButtons();

        // Give a split hand a second card.

        if (player[curPlayerHand].split)
            setTimeout(playerHit, dealTimeDelay);
    }
}

function startDealer() {

    var i, allBusts;

    // Enable/disable buttons.

    DisablePlayButtons();

    // If player has busted on all hands, end the round.

    allBusts = true;
    for (i = 0; i < numPlayerHands; i++)
        if (player[i].getScore() <= options.targetNumber)
            allBusts = false;
    if (allBusts) {
        endRound();
        return;
    }

    // Otherwise, highlight the dealer's hand, show the down card and score and
    // play the hand.

    addClassName(dealer.fieldNode, "activeField");
    dealer.cardsNode.firstChild.firstChild.style.visibility = "";
    dealer.scoreTextNode.nodeValue = dealer.getScore();
    setTimeout(playDealer, dealTimeDelay);
}

function playDealer() {

    var d;

    // Get and show the dealer's score.

    d = dealer.getScore();
    dealer.scoreTextNode.nodeValue = d;

    // If the dealer's total is less than 17, set up to deal another card.

    if (d < options.targetNumber-4) {
        setTimeout(dealToDealer, dealTimeDelay);
        return;
    }

    // Check if the dealer busted.

    if (d > options.targetNumber)
        dealer.scoreTextNode.nodeValue = "Busted (" + d + ")";

    // Dealer is done, unhighlight the hand and end the round.

    removeClassName(dealer.fieldNode, "activeField");
    endRound();
}

function dealToDealer() {

    // Give the dealer another card and check the result.

    dealer.addCard(getNextCard(), false);
    playDealer();
}

function endRound() {

    var i, d, p, tmp;

    // Enable/disable buttons.

    document.forms.controls.elements.deal.disabled = false;
    EnableBetButtons();
    DisablePlayButtons();

    // Show the dealer's down card and score.

    dealer.cardsNode.firstChild.firstChild.style.visibility = "";
    d = dealer.getScore();
    if (!dealer.blackjack && d <= options.targetNumber)
        dealer.scoreTextNode.nodeValue = d;

    // Show result of each player hand and pay it off, if appropriate.

    for (i = 0; i < numPlayerHands; i++) {
        p = player[i].getScore();
        if (player[i].surrender) {
            player[i].resultTextNode.nodeValue = "Player Surrendered";
            player[i].bet /= 2;
            credits += player[i].bet;
        }
        else if ((player[i].blackjack && !dealer.blackjack) ||
                         (p <= options.targetNumber &&
                          d > options.targetNumber) ||
                           (p <= options.targetNumber && p > d)) {
            player[i].resultTextNode.nodeValue = "Player Wins";
            gi('winAudio').play();
            tmp = 2 * player[i].bet;

            // Blackjack pays 3 to 2.

            if (player[i].blackjack)
                tmp += player[i].bet / 2;

            player[i].bet = tmp;
            credits += player[i].bet;
        }
        else if ((dealer.blackjack && !player[i].blackjack) ||
                         p > options.targetNumber || p < d) {
            player[i].resultTextNode.nodeValue = "Player Loses";
            gi('loseAudio').play();
            addClassName(player[i].betTextNode.parentNode, "lost");
        }
        else {
            player[i].resultTextNode.nodeValue = "Push";
            credits += player[i].bet;
        }
        updateBetDisplay(i);
    }
}

function canSplit() {

    var n;

    // Has the split limit has been reached?

    if (numPlayerHands > maxSplits)
        return false;

    // Check for a pair.

    n = curPlayerHand;
    if (player[n].cards[0].rank == player[n].cards[1].rank)
        return true;

    // Also, allow tens and face cards to match as a pair.

    if ((player[n].cards[0].rank == "10" ||
             player[n].cards[0].rank == "J"  ||
             player[n].cards[0].rank == "Q"  ||
             player[n].cards[0].rank == "K") &&
            (player[n].cards[1].rank == "10" ||
             player[n].cards[1].rank == "J"  ||
             player[n].cards[1].rank == "Q"  ||
             player[n].cards[1].rank == "K"))
        return true;

    return false;
}

function updateBetDisplay(n) {

    var s;

    // Display the current bet on the given hand.

    if (player[n]) {
        if (player[n].bet !== null)
            s = "Bet: " + formatDollar(player[n].bet);
        else
            s = "\u00a0";
        player[n].betTextNode.nodeValue = s;
    }

    // Display current credits.

    creditsTextNode.nodeValue = "Credits: " + formatDollar(credits);
}

function formatDollar(n) {

    var a, b;

    // Format the given number as a dollar amount for display.

    a = Math.abs(n);
    b = 100 * (a - Math.floor(a));
    if (b < 10)
        b = "0" + b;
    return (n < 0 ? "-" : "" ) + "$" + Math.floor(a) + "." + b;
}

function changeBet(n) {

    // Increase or decrease the default bet.

    defaultBet += n;
    defaultBet = Math.max(Math.min(defaultBet, maxBet), minBet);
    defaultTextNode.nodeValue = "Default Bet: " + formatDollar(defaultBet);

    // Reset the increase/decrease buttons.

    EnableBetButtons();
}

function EnableBetButtons() {

    // Enable the increase and decrease bet buttons provided the current bet
    // amount is within the allowed min/max value.

    document.forms.controls.elements.increase.disabled = (defaultBet >= maxBet);
    document.forms.controls.elements.decrease.disabled = (defaultBet <= minBet);
}

function DisablePlayButtons() {

    // Disable all the buttons used for playing a hand.

    document.forms.controls.elements.split.disabled     = true;
    document.forms.controls.elements.double.disabled    = true;
    document.forms.controls.elements.insurance.disabled = true;
    document.forms.controls.elements.hit.disabled       = true;
    document.forms.controls.elements.stand.disabled     = true;
}


function toggleRules() {
    var el = document.getElementById("rulesBox");
    el.style.visibility = "visible";
}
function closeRules(){
    var el = document.getElementById("rulesBox");
    el.style.visibility = "hidden";
}
function addClassName(el, name)
{
    // Remove the class name if it already exists in the element's class name
    // list.

    removeClassName(el, name);

    // Add the class name to the element's current list of class names.

    if (el.className.length > 0)
        name = " " + name;
    el.className += name;
}

function removeClassName(el, name)
{
    // If the element has no class names, exit.

    if (el.className === null)
        return;

    // Rebuild the list of class names on the element but exclude the specified
    // class name.

    var newList = [];
    var curList = el.className.split(" ");
    for (var i = 0; i < curList.length; i++)
        if (curList[i] != name)
            newList.push(curList[i]);
    el.className = newList.join(" ");
}
