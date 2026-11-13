/* ==========================================================================
   CraveU — clickable mobile app prototype
   Single-file state machine. No frameworks, no build step.
   Screens: welcome → signin → home | bay | item sheet | group | cart | checkout
            → tracking → pickup; tabs: home · orders · rewards · profile
   ========================================================================== */
(function () {
  'use strict';

  // ---------- Data: the 8 kitchen bays (mirrors restaurants.html) ----------
  var BAYS = [
    { id: 1, name: 'Café Cortadito', cuisine: 'Cuban coffee & pastelitos', tag: 'local', em: '☕', art: 'c', open: '07:30', close: '15:00', wait: 4,
      items: [
        { id: 101, name: 'Cortadito', price: 2.75, desc: 'Cuban espresso cut with steamed milk.', tags: ['V'] },
        { id: 102, name: 'Guava & cheese pastelito', price: 2.50, desc: 'Flaky, warm, gone in three bites.', tags: [] },
        { id: 103, name: 'Croqueta preparada', price: 7.50, desc: 'Ham croquetas, swiss, pickles, pressed on Cuban bread.', tags: [] },
        { id: 104, name: 'Café con leche', price: 3.50, desc: 'The 8 AM lifeline.', tags: ['V'] } ] },
    { id: 2, name: 'Sabor de Calle Ocho', cuisine: 'Cuban sandwiches & bowls', tag: 'local', em: '🥪', art: 'o', open: '10:30', close: '22:00', wait: 9,
      items: [
        { id: 201, name: 'Media noche', price: 9.75, desc: 'Roast pork, ham, swiss, pickles on sweet bread.', tags: [] },
        { id: 202, name: 'Cubano', price: 10.25, desc: 'The classic, pressed until it crackles.', tags: [] },
        { id: 203, name: 'Ropa vieja bowl', price: 11.50, desc: 'Shredded beef, white rice, black beans, maduros.', tags: ['GF'] },
        { id: 204, name: 'Tostones', price: 4.00, desc: 'Twice-fried, with mojo.', tags: ['V', 'GF'] } ] },
    { id: 3, name: 'Hurricane Smash', cuisine: 'Smash burgers & fries', tag: 'national', em: '🍔', art: 's', open: '10:30', close: '23:00', wait: 7,
      items: [
        { id: 301, name: 'Smash single', price: 7.50, desc: 'Smashed thin, crispy edges, house sauce.', tags: [] },
        { id: 302, name: 'Smash double', price: 9.50, desc: 'Two patties, American cheese, pickles, onion.', tags: [] },
        { id: 303, name: 'Crinkle fries', price: 3.25, desc: 'Salted, hot, shareable.', tags: ['V'] },
        { id: 304, name: 'Vanilla shake', price: 4.75, desc: 'Thick enough to need a spoon.', tags: ['V'] } ] },
    { id: 4, name: 'Taco Tuyo', cuisine: 'Tacos & burrito bowls', tag: 'local', em: '🌮', art: 'o', open: '11:00', close: '23:00', wait: 6,
      items: [
        { id: 401, name: 'Al pastor tacos (3)', price: 10.25, desc: 'Marinated pork, pineapple, onion, cilantro.', tags: ['GF'] },
        { id: 402, name: 'Birria tacos (3)', price: 11.50, desc: 'With consommé for dipping.', tags: [] },
        { id: 403, name: 'Burrito bowl', price: 10.75, desc: 'Build your own, any protein.', tags: ['GF'] },
        { id: 404, name: 'Chips & guac', price: 4.50, desc: 'Made every hour.', tags: ['V', 'GF'] } ] },
    { id: 5, name: 'Gables Bowl Co.', cuisine: 'Grain & poke bowls', tag: 'local', em: '🥗', art: 'c', open: '10:30', close: '21:00', wait: 5,
      items: [
        { id: 501, name: 'Harvest bowl', price: 11.00, desc: 'Quinoa, roasted sweet potato, kale, tahini.', tags: ['V', 'GF'] },
        { id: 502, name: 'Ahi poke bowl', price: 13.50, desc: 'Sushi rice, ahi, edamame, avocado, ponzu.', tags: ['GF'] },
        { id: 503, name: 'Falafel bowl', price: 10.50, desc: 'Herby falafel, hummus, cucumber salad.', tags: ['V'] },
        { id: 504, name: 'Green smoothie', price: 6.50, desc: 'Spinach, mango, banana, oat milk.', tags: ['V', 'GF'] } ] },
    { id: 6, name: 'Dough & Co.', cuisine: 'Pizza by the slice', tag: 'national', em: '🍕', art: 's', open: '11:00', close: '23:00', wait: 3,
      items: [
        { id: 601, name: 'Cheese slice', price: 3.75, desc: 'NY-style, foldable.', tags: ['V'] },
        { id: 602, name: 'Pepperoni slice', price: 4.25, desc: 'Cupped and crispy.', tags: [] },
        { id: 603, name: 'Garlic knots (6)', price: 5.00, desc: 'Butter, garlic, parm.', tags: ['V'] },
        { id: 604, name: 'Whole pie', price: 22.00, desc: 'For the study group. 8 slices.', tags: [] } ] },
    { id: 7, name: 'Night Owl Noodles', cuisine: 'Ramen · open until 1 AM', tag: 'local', em: '🍜', art: 'g', open: '17:00', close: '01:00', wait: 11,
      items: [
        { id: 701, name: 'Tonkotsu ramen', price: 13.00, desc: 'Rich pork broth, chashu, soft egg.', tags: [] },
        { id: 702, name: 'Spicy miso ramen', price: 13.50, desc: 'Miso, chili oil, corn, bok choy.', tags: [] },
        { id: 703, name: 'Pork dumplings (6)', price: 7.00, desc: 'Pan-fried, crispy bottoms.', tags: [] },
        { id: 704, name: 'Brown sugar boba', price: 5.50, desc: 'The late-night study fuel.', tags: ['V'] } ] },
    { id: 8, name: 'Open bay', cuisine: 'Next tenant arrives in January', tag: 'open', em: '✦', art: 'c', open: '00:00', close: '00:00', wait: 0, items: [] }
  ];

  var SLOTS = [
    { id: 'asap', label: 'ASAP', sub: '~12 min', time: null },
    { id: 'before2', label: '1:50 PM', sub: 'Before BTE 210 · 2:00 PM', cls: true },
    { id: 'after3', label: '3:20 PM', sub: 'After MKT 301 · 3:15 PM', cls: true },
    { id: 'evening', label: '6:30 PM', sub: 'Dinner' }
  ];

  var PAYMENTS = [
    { id: 'dd', name: 'Dining Dollars', sub: 'Balance $412.50', ic: '$' },
    { id: 'ce', name: 'Cane Express', sub: 'Balance $86.20', ic: 'U' },
    { id: 'ap', name: 'Apple Pay', sub: 'Visa •••• 4471', ic: '' },
    { id: 'card', name: 'Card', sub: 'Add a new card', ic: '▭' }
  ];

  var FEE = 0.99, TAX = 0.07;

  // ---------- State ----------
  var S = {
    screen: 'welcome',
    history: [],
    cart: [],            // { item, bay, qty, note, who }
    group: null,         // { code, members: [{name, initials, status, items:[]}] }
    slot: 'asap',
    payment: 'dd',
    filter: 'all',
    points: 340,
    orders: [
      { num: 'C-198', bay: 3, items: 'Smash single, crinkle fries', total: 12.46, when: 'Tue · 1:48 PM', status: 'Picked up' },
      { num: 'C-173', bay: 5, items: 'Harvest bowl', total: 12.77, when: 'Mon · 12:10 PM', status: 'Picked up' },
      { num: 'C-151', bay: 7, items: 'Spicy miso ramen, boba', total: 21.29, when: 'Sat · 11:52 PM', status: 'Picked up' }
    ],
    active: null,        // active order being tracked
    triedBays: [3, 5, 7, 2, 1],
    prefs: { vegan: false, gf: false, notif: true }
  };

  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  if (params.get('embed') === '1') document.body.classList.add('embed');

  // ---------- Helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function money(n) { return '$' + n.toFixed(2); }
  function bay(id) { return BAYS.filter(function (b) { return b.id === +id; })[0]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function isOpen(b) {
    if (b.tag === 'open') return false;
    var d = new Date(), m = d.getHours() * 60 + d.getMinutes();
    var o = b.open.split(':'), c = b.close.split(':');
    var open = +o[0] * 60 + +o[1], close = +c[0] * 60 + +c[1];
    return close > open ? (m >= open && m < close) : (m >= open || m < close);
  }
  function myLines() { return S.cart.filter(function (l) { return l.who === 'me'; }); }
  function subtotal(lines) { return lines.reduce(function (s, l) { return s + l.item.price * l.qty; }, 0); }
  function cartCount() { return myLines().reduce(function (s, l) { return s + l.qty; }, 0); }
  function slotLabel() { var s = SLOTS.filter(function (x) { return x.id === S.slot; })[0]; return s.id === 'asap' ? 'ASAP · ~12 min' : s.label; }
  function tagPill(t) { return '<span class="pill pill--ghost" style="padding:1px 7px;font-size:0.62rem;">' + (t === 'V' ? 'Vegan' : 'GF') + '</span>'; }

  function toast(title, body, icon) {
    var t = document.getElementById('toast');
    t.innerHTML = '<div class="ti">' + (icon || '🔔') + '</div><div><b>' + esc(title) + '</b>' + esc(body || '') + '</div>';
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  // ---------- Navigation ----------
  function go(screen, opts) {
    opts = opts || {};
    if (!opts.replace && S.screen !== screen) S.history.push(S.screen);
    S.screen = screen;
    S.arg = opts.arg !== undefined ? opts.arg : S.arg;
    render(opts.anim || 'slide');
  }
  function back() {
    var prev = S.history.pop() || 'home';
    S.screen = prev;
    render('back');
  }
  function tab(screen) { S.history = []; S.screen = screen; render('fade'); }

  // ---------- Render ----------
  function render(anim) {
    var html = SCREENS[S.screen] ? SCREENS[S.screen]() : SCREENS.home();
    var cls = anim === 'back' ? 'screen back-anim' : anim === 'fade' ? 'screen fade-anim' : 'screen';
    app.innerHTML = '<div class="' + cls + '">' + html + '</div>';
    app.parentElement.classList.toggle('app--dark', S.screen === 'welcome' || S.screen === 'signin');
    bind();
  }

  function topbar(title, sub, right) {
    return '<div class="topbar"><button class="iconbtn" data-act="back" aria-label="Back">‹</button><h2>' + title + (sub ? '<span class="sub">' + sub + '</span>' : '') + '</h2>' + (right || '') + '</div>';
  }

  function tabbar(active) {
    var n = cartCount();
    var tabs = [['home', '🍔', 'Home'], ['orders', '🧾', 'Orders'], ['rewards', '🏅', 'Rewards'], ['profile', '👤', 'Profile']];
    return '<nav class="tabbar">' + tabs.map(function (t) {
      return '<button class="tab' + (active === t[0] ? ' is-active' : '') + '" data-act="tab" data-to="' + t[0] + '"><span class="ic">' + t[1] + '</span>' + t[2] + (t[0] === 'orders' && S.active ? '<span class="badge">1</span>' : '') + '</button>';
    }).join('') + '</nav>';
  }

  function cartBar() {
    var n = cartCount(); if (!n && !S.group) return '';
    var lines = myLines();
    return '<div class="cta-bar"><button class="btn btn--green" data-act="go" data-to="cart">🧾 ' + (S.group ? 'Group order' : 'View order') + ' · ' + n + ' item' + (n === 1 ? '' : 's') + '<span class="price">' + money(subtotal(lines)) + '</span></button></div>';
  }

  // ---------- Screens ----------
  var SCREENS = {

    welcome: function () {
      return '<div class="welcome" style="flex:1;display:flex;flex-direction:column;position:relative;">' +
        '<img class="u" src="../assets/u-mark.png" alt="">' +
        '<div class="scroll">' +
          '<img class="wordmark" src="../assets/logo.png" alt="CraveU" style="filter:brightness(0) saturate(100%) invert(93%) sepia(12%) saturate(500%) hue-rotate(345deg) brightness(102%);">' +
          '<h1>Every craving, <em>one quick pickup.</em></h1>' +
          '<p>Seven kitchens. One app. One counter, right across from campus. Order between classes and grab it on the way to the next one.</p>' +
          '<button class="btn" data-act="go" data-to="signin">Get started</button>' +
          '<p class="tiny" style="text-align:center;margin:14px 0 0;color:rgba(243,231,207,0.6);">University of Miami · Coral Gables</p>' +
        '</div><div class="stripe"></div></div>';
    },

    signin: function () {
      return '<div class="welcome" style="flex:1;display:flex;flex-direction:column;position:relative;">' +
        '<div class="topbar"><button class="iconbtn" data-act="back" style="background:transparent;color:var(--cream);border-color:rgba(243,231,207,0.5);">‹</button></div>' +
        '<div class="scroll" style="justify-content:flex-start;padding-top:10px;">' +
          '<img src="../assets/app-icon-512.png" alt="" style="width:72px;border-radius:18px;margin-bottom:18px;box-shadow:0 10px 30px rgba(0,0,0,0.3);">' +
          '<h1>Sign in with your <em>CaneID.</em></h1>' +
          '<p>Your UM login unlocks Dining Dollars and Cane Express at checkout, and tells us your class schedule so pickup times fit between lectures.</p>' +
          '<div class="card card--flat" style="background:rgba(243,231,207,0.08);border-color:rgba(243,231,207,0.3);margin-bottom:12px;">' +
            '<span class="lbl" style="color:rgba(243,231,207,0.7);margin-top:0;">CaneID</span><div class="field" style="background:rgba(0,0,0,0.2);border-color:rgba(243,231,207,0.4);color:var(--cream);">avi.parmar <span class="muted" style="color:rgba(243,231,207,0.5);">@miami.edu</span></div>' +
            '<span class="lbl" style="color:rgba(243,231,207,0.7);">Password</span><div class="field" style="background:rgba(0,0,0,0.2);border-color:rgba(243,231,207,0.4);color:var(--cream);">••••••••••</div>' +
          '</div>' +
          '<button class="btn" data-act="signin">Sign in with CaneID</button>' +
          '<button class="btn btn--ghost" data-act="signin" style="color:var(--cream);border-color:rgba(243,231,207,0.5);margin-top:10px;">Continue as guest</button>' +
          '<p class="tiny" style="text-align:center;margin:14px 0 0;color:rgba(243,231,207,0.6);">Guests can pay with Apple Pay or card. Faculty and staff sign in the same way.</p>' +
        '</div><div class="stripe"></div></div>';
    },

    home: function () {
      var list = BAYS.filter(function (b) {
        if (S.filter === 'all') return true;
        if (S.filter === 'local') return b.tag === 'local';
        if (S.filter === 'fast') return b.wait > 0 && b.wait <= 6;
        if (S.filter === 'vegan') return b.items.some(function (i) { return i.tags.indexOf('V') >= 0; });
        if (S.filter === 'late') return b.close === '01:00' || b.close === '23:00';
        return true;
      });
      var chips = [['all', 'All bays'], ['fast', '⚡ Under 6 min'], ['local', 'Local favorites'], ['vegan', 'Vegan options'], ['late', 'Late night']];
      var hour = new Date().getHours();
      var greet = hour < 11 ? 'Good morning' : hour < 17 ? 'Hey' : 'Good evening';
      return '<div class="topbar" style="padding-top:4px;">' +
          '<div class="grow"><span class="eyebrow">' + greet + ', Avi</span><h2 style="font-size:1.5rem;">What are you craving?</h2></div>' +
          '<button class="iconbtn" data-act="go" data-to="profile" aria-label="Profile">AP</button></div>' +
        '<div class="scroll scroll--tabs">' +
          '<button class="card card--green" data-act="sheet" data-sheet="slot" style="width:100%;text-align:left;display:flex;align-items:center;gap:10px;">' +
            '<div class="grow"><div class="tiny" style="opacity:0.75;">Pickup · Ponce de Leon counter</div><div style="font-family:var(--font-display);font-size:1.1rem;">' + slotLabel() + '</div></div><span class="pill pill--orange">Change</span></button>' +
          '<div class="search" style="margin-top:12px;">🔍 <input placeholder="Search bays or dishes" data-act="search" value="' + esc(S.q || '') + '"></div>' +
          '<div class="chips" style="margin-top:10px;">' + chips.map(function (c) { return '<button class="chip' + (S.filter === c[0] ? ' is-active' : '') + '" data-act="filter" data-f="' + c[0] + '">' + c[1] + '</button>'; }).join('') + '</div>' +
          (S.group ? '' : '<button class="card card--orange" data-act="go" data-to="group" style="width:100%;text-align:left;display:flex;gap:12px;align-items:center;margin-top:4px;"><span style="font-size:1.8rem;">👥</span><div class="grow"><b>Eating with friends?</b><div class="small" style="color:var(--ink-soft);">Start a group order. Everyone picks their own bay, pays their own way, one pickup.</div></div><span style="font-weight:700;">›</span></button>') +
          '<div class="sect"><h3>' + list.length + ' kitchen bays</h3><span class="tiny muted">Live wait times</span></div>' +
          '<div class="stack">' + list.filter(function (b) {
            if (!S.q) return true; var q = S.q.toLowerCase();
            return b.name.toLowerCase().indexOf(q) >= 0 || b.cuisine.toLowerCase().indexOf(q) >= 0 || b.items.some(function (i) { return i.name.toLowerCase().indexOf(q) >= 0; });
          }).map(bayRow).join('') + '</div>' +
          '<p class="notice">Bays rotate each semester. Student orgs vote on the next tenant in the Rewards tab.</p>' +
        '</div>' + cartBar() + tabbar('home');
    },

    bay: function () {
      var b = bay(S.arg);
      if (b.tag === 'open') {
        return topbar('Bay 8', 'Opening January') + '<div class="scroll scroll--tabs"><div class="empty"><span class="em">✦</span><b>Your restaurant here?</b><p class="small">One bay opens every January. Student orgs vote on the shortlist.</p><a class="btn btn--green" href="../partners.html" target="_blank" rel="noopener" style="margin-top:12px;">Rent a bay on craveu</a><button class="textbtn" data-act="go" data-to="rewards" style="margin-top:10px;">Vote on the next bay →</button></div></div>' + tabbar('home');
      }
      var open = isOpen(b);
      return topbar('Bay ' + b.id, b.tag === 'local' ? 'Local favorite' : 'National brand', '<button class="iconbtn iconbtn--ghost" data-act="toast" data-title="Saved to favorites" aria-label="Favorite">♡</button>') +
        '<div class="scroll scroll--cta">' +
          '<div class="hero"><div class="art ' + b.art + '">' + b.em + '</div><div><h2 class="h-display" style="font-size:1.5rem;">' + esc(b.name) + '</h2><div class="small muted">' + esc(b.cuisine) + '</div><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;"><span class="pill ' + (open ? '' : 'pill--ghost') + '">' + (open ? '● Open' : 'Closed now') + '</span><span class="pill pill--orange">⏱ ' + b.wait + ' min</span></div></div></div>' +
          '<div class="sect"><h3>Menu</h3><span class="tiny muted">Same prices as their own shop</span></div>' +
          b.items.map(function (i) {
            return '<button class="item" data-act="sheet" data-sheet="item" data-id="' + i.id + '"><div class="grow"><div class="name">' + esc(i.name) + '</div><div class="desc">' + esc(i.desc) + '</div>' + (i.tags.length ? '<div class="tags">' + i.tags.map(tagPill).join('') + '</div>' : '') + '</div><div class="price">' + money(i.price) + '</div><div class="add">+</div></button>';
          }).join('') +
          '<p class="notice">Allergens and nutrition are listed on each item. Tap "Something wrong?" after pickup if anything is off.</p>' +
        '</div>' + cartBar();
    },

    group: function () {
      if (!S.group) {
        return topbar('Group order') + '<div class="scroll scroll--cta">' +
          '<div class="card card--orange"><span style="font-size:2rem;">👥</span><h2 class="h-display" style="font-size:1.4rem;color:var(--ink);margin:6px 0;">One pickup, everyone\'s craving.</h2><p class="small" style="margin:0;color:var(--ink-soft);">Share a code. Each friend adds food from any bay and pays their own share. All the kitchens finish together and it lands at one counter.</p></div>' +
          '<span class="lbl">Pickup time for the group</span>' +
          '<div class="slots">' + SLOTS.map(slotBtn).join('') + '</div>' +
          '<div class="card card--soft" style="margin-top:14px;"><div class="small"><b>Why this matters:</b> different kitchens have different cook times. We tell Bay 3 to start the burgers 4 minutes after Bay 4 starts the tacos, so nothing waits under a lamp.</div></div>' +
        '</div><div class="cta-bar"><button class="btn" data-act="startgroup">Create group code</button></div>';
      }
      var g = S.group;
      return topbar('Group order', 'Pickup ' + slotLabel()) + '<div class="scroll scroll--cta">' +
        '<div class="code">' + g.code + '</div>' +
        '<div class="row" style="margin-top:10px;gap:8px;"><button class="btn btn--sm btn--cream grow" data-act="toast" data-title="Link copied" data-body="craveu.app/g/' + g.code + '">Copy link</button><button class="btn btn--sm btn--green grow" data-act="toast" data-title="Shared to iMessage" data-body="Sent to BTE 210 group chat">Share</button></div>' +
        '<div class="sect"><h3>Who\'s in</h3><span class="tiny muted">' + g.members.length + ' people</span></div>' +
        g.members.map(function (m) {
          return '<div class="member"><div class="avatar ' + (m.me ? 'o' : '') + '">' + m.initials + '</div><div><b>' + esc(m.name) + '</b><div class="tiny muted">' + (m.items.length ? m.items.map(function (l) { return 'Bay ' + l.bay.id + ' · ' + l.item.name; }).join(', ') : 'Nothing yet') + '</div></div><span class="st ' + (m.status === 'Paid' ? '' : 'wait') + '">' + m.status + '</span></div>';
        }).join('') +
        '<p class="notice">Everyone pays separately. Your friends\' Dining Dollars are theirs; yours are yours.</p>' +
      '</div><div class="cta-bar"><button class="btn btn--green" data-act="go" data-to="home">Add my food</button></div>';
    },

    cart: function () {
      var mine = myLines();
      if (!mine.length && !S.group) return topbar('Your order') + '<div class="scroll"><div class="empty"><span class="em">🛍️</span><b>Nothing here yet</b><p class="small">Pick a bay and add something.</p><button class="btn btn--green" data-act="go" data-to="home" style="margin-top:12px;">Browse bays</button></div></div>';
      var sub = subtotal(mine), tax = sub * TAX, total = sub + FEE + tax;
      var html = topbar(S.group ? 'Group order' : 'Your order', S.group ? 'Code ' + S.group.code : null) + '<div class="scroll scroll--cta">';
      // Pickup slot
      html += '<button class="card card--green" data-act="sheet" data-sheet="slot" style="width:100%;text-align:left;display:flex;align-items:center;gap:10px;"><div class="grow"><div class="tiny" style="opacity:0.75;">Pickup time</div><div style="font-family:var(--font-display);font-size:1.1rem;">' + slotLabel() + '</div></div><span class="pill pill--orange">Change</span></button>';
      // My lines
      html += '<div class="person"><div class="avatar o">AP</div><b class="small">You</b><span class="tiny muted">· pays with ' + PAYMENTS.filter(function (p) { return p.id === S.payment; })[0].name + '</span></div>';
      if (!mine.length) html += '<p class="small muted" style="margin:6px 0;">You haven\'t added anything yet.</p>';
      html += mine.map(function (l, idx) {
        return '<div class="cartline"><div class="art ' + l.bay.art + '" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;border:2px solid var(--ink);flex:0 0 40px;">' + l.bay.em + '</div><div class="grow"><div class="n">' + esc(l.item.name) + '</div><div class="s">Bay ' + l.bay.id + ' · ' + esc(l.bay.name) + (l.note ? ' · ' + esc(l.note) : '') + '</div></div><div class="qty" style="transform:scale(0.85);"><button data-act="qty" data-i="' + idx + '" data-d="-1">−</button><span>' + l.qty + '</span><button data-act="qty" data-i="' + idx + '" data-d="1">+</button></div><div class="p">' + money(l.item.price * l.qty) + '</div></div>';
      }).join('');
      // Group members' lines (read-only)
      if (S.group) {
        S.group.members.filter(function (m) { return !m.me; }).forEach(function (m) {
          html += '<div class="person"><div class="avatar">' + m.initials + '</div><b class="small">' + esc(m.name) + '</b><span class="tiny muted">· ' + m.status.toLowerCase() + '</span></div>';
          html += m.items.length ? m.items.map(function (l) { return '<div class="cartline" style="opacity:0.75;"><div class="art ' + l.bay.art + '" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;border:2px solid var(--ink);flex:0 0 40px;">' + l.bay.em + '</div><div class="grow"><div class="n">' + esc(l.item.name) + '</div><div class="s">Bay ' + l.bay.id + ' · ' + esc(l.bay.name) + '</div></div><div class="p">' + money(l.item.price) + '</div></div>'; }).join('') : '<p class="small muted" style="margin:4px 0;">Still choosing…</p>';
        });
      }
      // Totals
      html += '<div class="hr"></div><div class="totals"><div class="t"><span>Your subtotal</span><span>' + money(sub) + '</span></div><div class="t fee"><span>CraveU service fee</span><span>' + money(mine.length ? FEE : 0) + '</span></div><div class="t"><span>Tax</span><span>' + money(tax) + '</span></div><div class="t grand"><span>You pay</span><span class="v">' + money(mine.length ? total : 0) + '</span></div></div>';
      html += '<p class="notice">Menu prices match the restaurant\'s own shop. The $0.99 fee runs the platform and the pickup counter. No delivery markups.</p>';
      html += '</div><div class="cta-bar"><button class="btn" data-act="go" data-to="checkout"' + (mine.length ? '' : ' disabled') + '>Check out<span class="price">' + money(mine.length ? total : 0) + '</span></button></div>';
      return html;
    },

    checkout: function () {
      var mine = myLines(), sub = subtotal(mine), total = sub + FEE + sub * TAX;
      return topbar('Checkout', 'Pickup ' + slotLabel()) + '<div class="scroll scroll--cta">' +
        '<div class="sect" style="margin-top:4px;"><h3>Pay with</h3><span class="tiny muted">Signed in with CaneID</span></div>' +
        '<div class="stack">' + PAYMENTS.map(function (p) {
          return '<button class="opt' + (S.payment === p.id ? ' is-active' : '') + '" data-act="pay" data-p="' + p.id + '"><span class="radio"></span><span class="avatar ' + (p.id === 'dd' || p.id === 'ce' ? '' : 'o') + '" style="border-radius:8px;">' + p.ic + '</span><div><b>' + p.name + '</b><div class="tiny muted">' + p.sub + '</div></div>' + (p.id === 'dd' ? '<span class="r pill pill--orange" style="font-size:0.62rem;">Meal plan</span>' : '') + '</button>';
        }).join('') + '</div>' +
        '<div class="sect"><h3>Order summary</h3></div>' +
        mine.map(function (l) { return '<div class="cartline"><div class="grow"><div class="n">' + l.qty + '× ' + esc(l.item.name) + '</div><div class="s">Bay ' + l.bay.id + ' · ' + esc(l.bay.name) + '</div></div><div class="p">' + money(l.item.price * l.qty) + '</div></div>'; }).join('') +
        '<div class="totals" style="margin-top:8px;"><div class="t"><span>Subtotal</span><span>' + money(sub) + '</span></div><div class="t fee"><span>Service fee</span><span>' + money(FEE) + '</span></div><div class="t"><span>Tax</span><span>' + money(sub * TAX) + '</span></div><div class="t grand"><span>Total</span><span class="v">' + money(total) + '</span></div></div>' +
        '<div class="card card--soft" style="margin-top:12px;"><div class="small">🏅 You\'ll earn <b>+' + Math.round(sub) + ' Crave Points</b> on this order' + (S.triedBays.indexOf(mine[0].bay.id) < 0 ? ' and unlock a new bay toward the Full Tour badge.' : '.') + '</div></div>' +
      '</div><div class="cta-bar"><button class="btn btn--green" data-act="place">Place order<span class="price">' + money(total) + '</span></button></div>';
    },

    tracking: function () {
      var o = S.active; if (!o) return SCREENS.orders();
      var steps = ['Received', 'Cooking', 'Ready'];
      return topbar('Order ' + o.num, 'Pickup ' + o.slot) + '<div class="scroll scroll--cta">' +
        '<div style="text-align:center;margin-top:6px;"><span class="eyebrow">' + (o.step === 2 ? 'Ready at the counter' : o.step === 1 ? 'Cooking now' : 'Sent to the kitchen') + '</span><div class="ordernum">' + o.num + '</div><div class="small muted">' + o.bays.map(function (b) { return 'Bay ' + b; }).join(' + ') + ' · ' + o.count + ' item' + (o.count === 1 ? '' : 's') + '</div></div>' +
        '<div class="timeline">' + steps.map(function (s, i) { return '<div class="tl ' + (i < o.step ? 'done' : i === o.step ? 'now' : '') + '"><div class="dot"></div>' + s + '</div>'; }).join('') + '</div>' +
        '<div class="counter-art"><span>' + (o.step === 2 ? '🔔 Show this number<br>at the orange counter' : o.step === 1 ? '👨‍🍳 ' + o.bays.map(function (b) { return bay(b).name; }).join(' & ') + '<br>on it' : '🧾 Printed at Bay ' + o.bays.join(' & Bay ')) + '</span></div>' +
        (o.step === 2 ? '<button class="btn btn--green" data-act="go" data-to="pickup" style="margin-top:14px;">Show pickup code</button>' : '<div class="card card--soft" style="margin-top:14px;"><div class="small">We\'ll buzz your phone the second it\'s ready. ' + (o.group ? 'Everyone in the group gets the same alert.' : 'No need to wait by the counter.') + '</div></div>') +
        '<div class="sect"><h3>Details</h3></div>' +
        '<div class="totals"><div class="t"><span>Paid with</span><span>' + o.pay + '</span></div><div class="t"><span>Total</span><span>' + money(o.total) + '</span></div><div class="t"><span>Crave Points</span><span style="color:var(--green);font-weight:600;">+' + o.pts + '</span></div></div>' +
        '<button class="textbtn" data-act="toast" data-title="Counter team pinged" data-body="Someone will meet you at the counter." style="display:block;margin:14px auto 0;">Something wrong?</button>' +
      '</div><div class="cta-bar"><button class="btn btn--cream" data-act="tab" data-to="home">Back to home</button></div>';
    },

    pickup: function () {
      var o = S.active || { num: 'C-214', bays: [3] };
      return topbar('Pickup') + '<div class="scroll scroll--cta" style="text-align:center;">' +
        '<span class="eyebrow">Orange counter · Ponce de Leon</span><div class="ordernum" style="margin:4px 0 0;">' + o.num + '</div>' +
        '<div class="qr">' + qr(o.num) + '</div>' +
        '<p class="small muted" style="margin:0 20px;">Show this screen or say your number. ' + (o.group ? 'Your whole group\'s bags are together.' : 'Your bag is on the shelf under your number.') + '</p>' +
        '<div class="card card--orange" style="margin-top:16px;text-align:left;"><b>Skip the pickup pile-up</b><div class="small" style="color:var(--ink-soft);">Orders are shelved by number, not by restaurant, so a group from four bays is one grab.</div></div>' +
      '</div><div class="cta-bar"><button class="btn btn--green" data-act="pickedup">I\'ve got it ✓</button></div>';
    },

    orders: function () {
      var act = S.active;
      return '<div class="topbar"><h2 style="font-size:1.5rem;">Orders</h2></div><div class="scroll scroll--tabs">' +
        (act ? '<button class="card card--green" data-act="go" data-to="tracking" style="width:100%;text-align:left;"><div class="row row--between"><span class="pill pill--orange">' + ['Received', 'Cooking', 'Ready'][act.step] + '</span><span class="tiny" style="opacity:0.8;">Pickup ' + act.slot + '</span></div><div style="font-family:var(--font-display);font-size:1.6rem;margin-top:6px;">' + act.num + '</div><div class="small">' + act.items + '</div></button>' : '<div class="card card--soft"><div class="small">No active orders. Your next one shows up here with live status.</div></div>') +
        '<div class="sect"><h3>Past orders</h3><button class="textbtn" data-act="toast" data-title="Reorder" data-body="Tap any order to add it to your cart again.">Reorder ↻</button></div>' +
        S.orders.map(function (o) { var b = bay(o.bay); return '<button class="bayrow" data-act="reorder" data-bay="' + o.bay + '" style="box-shadow:none;margin-bottom:10px;"><div class="art ' + b.art + '">' + b.em + '</div><div class="grow"><div class="name">' + o.num + ' · ' + esc(b.name) + '</div><div class="meta">' + esc(o.items) + '</div><div class="meta">' + o.when + ' · ' + o.status + '</div></div><div class="wait"><b>' + money(o.total).replace('$', '') + '</b><span>usd</span></div></button>'; }).join('') +
      '</div>' + tabbar('orders');
    },

    rewards: function () {
      var next = 500, pct = Math.min(100, Math.round(S.points / next * 100));
      var tried = S.triedBays.length;
      var badges = [
        { em: '🗺️', n: 'Full Tour', sub: tried + '/7 bays', done: tried >= 7, pct: Math.round(tried / 7 * 100) },
        { em: '🦉', n: 'Night Owl', sub: '3 orders after 11 PM', done: true },
        { em: '👥', n: 'Squad Leader', sub: '5 group orders', done: false, pct: 40 },
        { em: '☕', n: 'Early Bird', sub: '5 breakfast orders', done: false, pct: 20 },
        { em: '🔥', n: '3-week streak', sub: 'Order every week', done: true },
        { em: '🎓', n: 'Finals Fuel', sub: 'Coming December', done: false, pct: 0 }
      ];
      return '<div class="topbar"><h2 style="font-size:1.5rem;">Crave Points</h2><span class="pill pill--orange">Lvl 3 · Regular</span></div><div class="scroll scroll--tabs">' +
        '<div class="ring" style="--pct:' + pct + '%;"><div><b>' + S.points + '</b><small>points</small></div></div>' +
        '<p class="small" style="text-align:center;margin:0 10px 14px;"><b>' + (next - S.points) + ' points</b> to a free item at any bay. 1 point per dollar, every order.</p>' +
        '<div class="sect"><h3>Badges</h3><span class="tiny muted">' + badges.filter(function (b) { return b.done; }).length + ' of ' + badges.length + '</span></div>' +
        '<div class="badges">' + badges.map(function (b) { return '<div class="badge-card' + (b.done ? '' : ' locked') + '"><span class="em">' + b.em + '</span>' + b.n + '<span class="tiny muted" style="display:block;font-weight:500;">' + b.sub + '</span>' + (!b.done && b.pct ? '<span class="pct">' + b.pct + '%</span>' : '') + '</div>'; }).join('') + '</div>' +
        '<div class="sect"><h3>Vote: next bay</h3><span class="tiny muted">Closes Dec 5</span></div>' +
        '<div class="stack">' + [['🍗', 'Pollo a la brasa', '41%'], ['🥙', 'Mediterranean wraps', '33%'], ['🧇', 'Chicken & waffles', '26%']].map(function (v) { return '<button class="opt" data-act="toast" data-title="Vote counted" data-body="' + v[1] + ' · +10 Crave Points"><span style="font-size:1.3rem;">' + v[0] + '</span><b>' + v[1] + '</b><span class="r">' + v[2] + '</span></button>'; }).join('') + '</div>' +
        '<div class="sect"><h3>Org leaderboard</h3><span class="tiny muted">This week</span></div>' +
        [['1', 'Hurricane Productions', '2,140'], ['2', 'UM Club Soccer', '1,980'], ['3', 'BTE 210 Section C', '1,655', true], ['4', 'Frost Band', '1,420']].map(function (r) { return '<div class="lb' + (r[3] ? ' me' : '') + '"><span class="rank">' + r[0] + '</span><span>' + r[1] + '</span><span class="pts">' + r[2] + '</span></div>'; }).join('') +
        '<p class="notice">Top org each month gets a catered study session from the bay of their choice.</p>' +
      '</div>' + tabbar('rewards');
    },

    profile: function () {
      return '<div class="topbar"><h2 style="font-size:1.5rem;">Profile</h2></div><div class="scroll scroll--tabs">' +
        '<div class="card" style="display:flex;gap:12px;align-items:center;"><div class="avatar o" style="width:52px;height:52px;font-size:1.1rem;">AP</div><div><b>Avi Parmar</b><div class="tiny muted">avi.parmar@miami.edu · Undergrad</div><div style="margin-top:4px;"><span class="pill" style="font-size:0.62rem;">CaneID verified</span></div></div></div>' +
        '<div class="sect"><h3>Payment</h3></div><div class="list">' +
          '<div class="li"><span class="ic">$</span><div><b>Dining Dollars</b><div class="tiny muted">$412.50 · default</div></div><span class="pill pill--orange" style="margin-left:auto;font-size:0.62rem;">Default</span></div>' +
          '<div class="li"><span class="ic">U</span><div><b>Cane Express</b><div class="tiny muted">$86.20</div></div></div>' +
          '<button data-act="toast" data-title="Add a card" data-body="Apple Pay is already set up."><span class="ic" style="background:var(--orange-soft);">+</span><b>Add card</b><span class="chev">›</span></button></div>' +
        '<div class="sect"><h3>Class schedule</h3><span class="tiny muted">From CaneLink</span></div><div class="list">' +
          '<div class="li"><span class="ic">📚</span><div><b>BTE 210</b><div class="tiny muted">MWF 2:00–3:15 PM</div></div><span class="tiny muted" style="margin-left:auto;">Pickup 1:50</span></div>' +
          '<div class="li"><span class="ic">📚</span><div><b>MKT 301</b><div class="tiny muted">TTh 3:15–4:30 PM</div></div><span class="tiny muted" style="margin-left:auto;">Pickup 3:20</span></div></div>' +
        '<p class="notice" style="text-align:left;">Your schedule turns into one-tap pickup slots. We never share it.</p>' +
        '<div class="sect"><h3>Preferences</h3></div><div class="list">' +
          '<button data-act="pref" data-k="vegan"><span class="ic">🌱</span><b>Show vegan first</b><span class="switch' + (S.prefs.vegan ? ' on' : '') + '"></span></button>' +
          '<button data-act="pref" data-k="gf"><span class="ic">🌾</span><b>Gluten-free filter</b><span class="switch' + (S.prefs.gf ? ' on' : '') + '"></span></button>' +
          '<button data-act="pref" data-k="notif"><span class="ic">🔔</span><b>"Ready" notifications</b><span class="switch' + (S.prefs.notif ? ' on' : '') + '"></span></button></div>' +
        '<div class="sect"><h3>More</h3></div><div class="list">' +
          '<button data-act="toast" data-title="Invite sent" data-body="You both get 50 points on their first order."><span class="ic">🎁</span><b>Invite a friend · +50 pts</b><span class="chev">›</span></button>' +
          '<button data-act="toast" data-title="Help" data-body="Text (305) 555-0188 or ask at the counter."><span class="ic">💬</span><b>Help & feedback</b><span class="chev">›</span></button>' +
          '<button data-act="go" data-to="welcome"><span class="ic">↩</span><b>Sign out</b><span class="chev">›</span></button></div>' +
        '<p class="notice">CraveU v0.3 prototype · University of Miami</p>' +
      '</div>' + tabbar('profile');
    }
  };

  function bayRow(b) {
    var open = isOpen(b), isOpenBay = b.tag === 'open';
    return '<button class="bayrow' + (!open && !isOpenBay ? ' is-closed' : '') + '" data-act="go" data-to="bay" data-arg="' + b.id + '"' + (isOpenBay ? ' style="border-style:dashed;box-shadow:none;background:var(--cream);"' : '') + '>' +
      '<div class="art ' + b.art + '">' + b.em + '</div>' +
      '<div class="grow"><div class="name">' + esc(b.name) + '</div><div class="meta">Bay ' + b.id + ' · ' + esc(b.cuisine) + '</div><div class="meta">' + (isOpenBay ? '<span style="color:var(--orange-deep);font-weight:600;">Vote on the next tenant →</span>' : (b.tag === 'local' ? '<span style="color:var(--orange-deep);font-weight:600;">Local favorite</span>' : 'National brand') + ' · ' + (open ? '<span style="color:var(--green);font-weight:600;">Open</span>' : 'Closed')) + '</div></div>' +
      (isOpenBay ? '' : '<div class="wait"><b>' + b.wait + '</b><span>min</span></div>') + '</button>';
  }

  function slotBtn(s) {
    return '<button class="slot' + (S.slot === s.id ? ' is-active' : '') + '" data-act="slot" data-s="' + s.id + '"><b>' + s.label + '</b>' + (s.cls ? '<span class="class">' + s.sub + '</span>' : '<span class="tiny muted">' + s.sub + '</span>') + '</button>';
  }

  // Deterministic pseudo-QR pattern from the order number (decorative)
  function qr(seed) {
    var h = 0; for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    var out = '';
    for (var y = 0; y < 21; y++) for (var x = 0; x < 21; x++) {
      var finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      var on;
      if (finder) { var fx = x % 14 > 6 ? x - 14 : x, fy = y > 13 ? y - 14 : y; if (x > 13) fx = x - 14; on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4); }
      else { h = (h * 1103515245 + 12345) >>> 0; on = ((h >> 16) & 1) === 1; }
      out += '<i class="' + (on ? 'on' : '') + '"></i>';
    }
    return out;
  }

  // ---------- Sheets ----------
  function openSheet(kind, id) {
    var wrap = $('.screen'); if (!wrap) return;
    var html = '';
    if (kind === 'item') {
      var it, b; BAYS.forEach(function (bb) { bb.items.forEach(function (ii) { if (ii.id === +id) { it = ii; b = bb; } }); });
      S.sheetQty = 1; S.sheetNote = '';
      html = '<div class="row" style="gap:12px;"><div class="art ' + b.art + '" style="width:56px;height:56px;border-radius:12px;display:grid;place-items:center;font-size:1.8rem;border:2px solid var(--ink);">' + b.em + '</div><div class="grow"><b style="font-size:1.05rem;">' + esc(it.name) + '</b><div class="small muted">' + esc(it.desc) + '</div></div><div style="font-family:var(--font-display);color:var(--green);font-size:1.1rem;">' + money(it.price) + '</div></div>' +
        (it.tags.length ? '<div style="margin-top:8px;">' + it.tags.map(tagPill).join(' ') + '</div>' : '') +
        '<span class="lbl">Special requests</span><div class="field"><input placeholder="No onion, extra sauce…" data-act="note"></div>' +
        '<div class="row row--between" style="margin-top:16px;"><div class="qty"><button data-act="sq" data-d="-1">−</button><span id="sq">1</span><button data-act="sq" data-d="1">+</button></div><button class="btn" style="width:auto;flex:1;margin-left:12px;" data-act="add" data-id="' + it.id + '" data-bay="' + b.id + '">Add to order<span class="price" id="sp">' + money(it.price) + '</span></button></div>';
    } else if (kind === 'slot') {
      html = '<b style="font-size:1.05rem;">When do you want it?</b><p class="small muted" style="margin:4px 0 12px;">Slots come from your class schedule. Kitchens start cooking so it\'s hot when you walk up.</p><div class="slots">' + SLOTS.map(slotBtn).join('') + '</div><button class="btn btn--green" data-act="closesheet" style="margin-top:16px;">Done</button>';
    }
    var bd = document.createElement('div'); bd.className = 'sheet-backdrop'; bd.setAttribute('data-act', 'closesheet');
    var sh = document.createElement('div'); sh.className = 'sheet'; sh.innerHTML = html;
    wrap.appendChild(bd); wrap.appendChild(sh);
    bind();
  }
  function closeSheet() { ['.sheet-backdrop', '.sheet'].forEach(function (s) { var e = $(s); if (e) e.remove(); }); }

  // ---------- Actions ----------
  function startGroup() {
    S.group = { code: 'CANES-' + (200 + Math.floor(Math.random() * 90)), members: [{ name: 'You', initials: 'AP', me: true, status: 'Choosing', items: [] }] };
    render('fade');
    // Simulate friends joining and ordering from different bays
    setTimeout(function () { S.group.members.push({ name: 'Lucas S.', initials: 'LS', status: 'Choosing', items: [] }); if (S.screen === 'group') render('fade'); toast('Lucas S. joined', 'via your group link', '👥'); }, 1400);
    setTimeout(function () { S.group.members.push({ name: 'Aryan G.', initials: 'AG', status: 'Choosing', items: [] }); if (S.screen === 'group') render('fade'); }, 2600);
    setTimeout(function () { var m = S.group.members[1]; if (m) { m.items.push({ item: bay(4).items[0], bay: bay(4), qty: 1 }); m.status = 'Paid'; S.cart.push({ item: bay(4).items[0], bay: bay(4), qty: 1, who: 'ls' }); } if (S.screen === 'group' || S.screen === 'cart') render('fade'); toast('Lucas S. paid', 'Al pastor tacos · Bay 4 · Dining Dollars', '✓'); }, 4200);
    setTimeout(function () { var m = S.group.members[2]; if (m) { m.items.push({ item: bay(5).items[0], bay: bay(5), qty: 1 }); m.status = 'Paid'; S.cart.push({ item: bay(5).items[0], bay: bay(5), qty: 1, who: 'ag' }); } if (S.screen === 'group' || S.screen === 'cart') render('fade'); toast('Aryan G. paid', 'Harvest bowl · Bay 5 · Cane Express', '✓'); }, 6200);
  }

  function placeOrder() {
    var mine = myLines(), sub = subtotal(mine), total = sub + FEE + sub * TAX;
    var bays = []; S.cart.forEach(function (l) { if (bays.indexOf(l.bay.id) < 0) bays.push(l.bay.id); });
    var slot = SLOTS.filter(function (s) { return s.id === S.slot; })[0];
    var num = 'C-' + (200 + Math.floor(Math.random() * 99));
    S.active = { num: num, step: 0, bays: bays.sort(), count: cartCount(), items: mine.map(function (l) { return l.qty + '× ' + l.item.name; }).join(', '), total: total, pay: PAYMENTS.filter(function (p) { return p.id === S.payment; })[0].name, pts: Math.round(sub), slot: slot.id === 'asap' ? '~12 min' : slot.label, group: !!S.group };
    S.points += Math.round(sub);
    mine.forEach(function (l) { if (S.triedBays.indexOf(l.bay.id) < 0) S.triedBays.push(l.bay.id); });
    S.cart = []; S.group = null; S.history = [];
    go('tracking', { replace: true });
    toast('Order placed', num + ' · sent to ' + bays.map(function (b) { return 'Bay ' + b; }).join(' & '), '🧾');
    setTimeout(function () { if (S.active && S.active.num === num) { S.active.step = 1; if (S.screen === 'tracking') render('fade'); toast('Cooking', bay(bays[0]).name + ' started your order', '👨‍🍳'); } }, 3500);
    setTimeout(function () { if (S.active && S.active.num === num) { S.active.step = 2; if (S.screen === 'tracking' || S.screen === 'orders') render('fade'); toast('Ready for pickup!', num + ' is at the orange counter', '🔔'); } }, 8000);
  }

  function bind() {
    app.querySelectorAll('[data-act]').forEach(function (el) {
      if (el._bound) return; el._bound = true;
      var act = el.getAttribute('data-act');
      if (act === 'search') { el.addEventListener('input', function () { S.q = el.value; var list = $('.stack'); if (list) { var tmp = document.createElement('div'); tmp.innerHTML = SCREENS.home(); list.innerHTML = tmp.querySelector('.stack').innerHTML; bind(); } }); return; }
      if (act === 'note') { el.addEventListener('input', function () { S.sheetNote = el.value; }); return; }
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        switch (act) {
          case 'go': go(el.getAttribute('data-to'), { arg: el.getAttribute('data-arg') }); break;
          case 'back': back(); break;
          case 'tab': tab(el.getAttribute('data-to')); break;
          case 'signin': S.history = []; go('home', { replace: true, anim: 'fade' }); toast('Welcome back, Avi', 'Dining Dollars balance: $412.50', '🎓'); break;
          case 'filter': S.filter = el.getAttribute('data-f'); render('fade'); break;
          case 'sheet': openSheet(el.getAttribute('data-sheet'), el.getAttribute('data-id')); break;
          case 'closesheet': closeSheet(); if (S.screen === 'home' || S.screen === 'cart') render('fade'); break;
          case 'sq': S.sheetQty = Math.max(1, S.sheetQty + +el.getAttribute('data-d')); $('#sq').textContent = S.sheetQty; var pid = +$('[data-act="add"]').getAttribute('data-id'); var price = 0; BAYS.forEach(function (b) { b.items.forEach(function (i) { if (i.id === pid) price = i.price; }); }); $('#sp').textContent = money(price * S.sheetQty); break;
          case 'add': {
            var b = bay(el.getAttribute('data-bay')), it = b.items.filter(function (i) { return i.id === +el.getAttribute('data-id'); })[0];
            var existing = S.cart.filter(function (l) { return l.who === 'me' && l.item.id === it.id && l.note === S.sheetNote; })[0];
            if (existing) existing.qty += S.sheetQty; else S.cart.push({ item: it, bay: b, qty: S.sheetQty, note: S.sheetNote, who: 'me' });
            if (S.group) { var me = S.group.members[0]; me.items.push({ item: it, bay: b, qty: S.sheetQty }); }
            closeSheet(); render('fade'); toast('Added', S.sheetQty + '× ' + it.name + ' · Bay ' + b.id, '✓'); break;
          }
          case 'qty': { var mine = myLines(), l = mine[+el.getAttribute('data-i')]; l.qty += +el.getAttribute('data-d'); if (l.qty <= 0) S.cart.splice(S.cart.indexOf(l), 1); render('fade'); break; }
          case 'slot': S.slot = el.getAttribute('data-s'); app.querySelectorAll('.slot').forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-s') === S.slot); }); break;
          case 'pay': S.payment = el.getAttribute('data-p'); render('fade'); break;
          case 'startgroup': startGroup(); break;
          case 'place': placeOrder(); break;
          case 'pickedup': S.active = null; S.orders.unshift({ num: 'C-' + (200 + Math.floor(Math.random() * 99)), bay: 3, items: 'Picked up just now', total: 0, when: 'Today', status: 'Picked up' }); S.orders.pop(); tab('rewards'); toast('Enjoy! +points added', 'Rate your order in Orders when you\'re done', '🏅'); break;
          case 'reorder': go('bay', { arg: el.getAttribute('data-bay') }); break;
          case 'pref': var k = el.getAttribute('data-k'); S.prefs[k] = !S.prefs[k]; render('fade'); break;
          case 'toast': toast(el.getAttribute('data-title') || 'Done', el.getAttribute('data-body') || '', '✓'); break;
        }
      });
    });
  }

  // ---------- Boot ----------
  function clock() { var d = new Date(), h = d.getHours() % 12 || 12, m = d.getMinutes(); document.getElementById('clock').textContent = h + ':' + (m < 10 ? '0' : '') + m; }
  clock(); setInterval(clock, 15000);

  var deepBay = params.get('bay');
  if (deepBay && bay(deepBay)) { S.screen = 'home'; S.history = []; go('bay', { arg: deepBay, anim: 'fade' }); }
  else if (document.body.classList.contains('embed')) { S.screen = 'home'; render('fade'); }
  else render('fade');
})();
