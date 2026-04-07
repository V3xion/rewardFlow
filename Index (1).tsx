import { useEffect, useRef } from "react";
import "./RewardFlow.css";

const REWARD_FLOW_HTML = `
<!-- LOGIN -->
<div id="loginScreen" class="screen active">
  <div class="logo">Reward<span>Flow</span></div>
  <div class="login-sub">Complete quests · Earn coins · Spend in the store 🛍️</div>
  <div class="role-cards">
    <div class="role-card p-card" data-action="goToPassword-parent">
      <span class="role-emoji">👨‍👩‍👧</span>
      <div class="role-name">Parent</div>
      <div class="role-desc">Assign quests, manage store &amp; approve</div>
    </div>
    <div class="role-card c-card" data-action="goToPassword-child">
      <span class="role-emoji">🧒</span>
      <div class="role-name">Child</div>
      <div class="role-desc">Complete quests &amp; shop rewards</div>
    </div>
  </div>
</div>

<!-- PASSWORD -->
<div id="pwScreen" class="screen">
  <div class="pw-box" id="pwBox"></div>
</div>

<!-- PARENT -->
<div id="parentScreen" class="screen">
  <div class="topbar tb-p">
    <div class="tb-title">RewardFlow</div>
    <div class="tb-right">
      <span style="font-size:13px;opacity:.85">👨‍👩‍👧 Parent</span>
      <button class="btn-lo" id="parentLogout">Logout</button>
    </div>
  </div>
  <div class="tabs" id="parentTabs">
    <div class="tab active" data-tab="parent-assign">📋 Quests</div>
    <div class="tab" data-tab="parent-review">🔍 Review <span id="pendingBadge"></span></div>
    <div class="tab" data-tab="parent-store">🛍️ Store</div>
    <div class="tab" data-tab="parent-orders">📦 Orders <span id="ordersBadge"></span></div>
    <div class="tab" data-tab="parent-dashboard">📊 Stats</div>
    <div class="tab" data-tab="parent-family">👨‍👩‍👧 Family</div>
  </div>

  <div id="parent-assign" class="tc active">
    <div class="card">
      <div class="sec-title">Create a New Quest</div>
      <div class="fg"><label>Quest Title</label><input type="text" id="qTitle" placeholder="e.g. Clean your bedroom" /></div>
      <div class="fg"><label>Description</label><textarea id="qDesc" placeholder="Describe what needs to be done..."></textarea></div>
      <div class="two-col">
        <div class="fg"><label>Coins 🪙</label><input type="number" id="qPts" value="20" min="5" max="500" step="5" /></div>
        <div class="fg"><label>Type</label>
          <select id="qType"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="special">Special</option></select>
        </div>
      </div>
      <div class="fg"><label>Assign To</label><select id="qChild"></select></div>
      <button class="btn btn-p btn-full" id="createQuestBtn">🚀 Assign Quest</button>
    </div>
    <div class="sec-title">All Quests</div>
    <div id="allQuestsList"></div>
  </div>

  <div id="parent-review" class="tc">
    <div class="sec-title">Pending Approvals 🔍</div>
    <div id="reviewList"></div>
  </div>

  <div id="parent-store" class="tc">
    <div class="card">
      <div class="sec-title">Add a Store Item</div>
      <div class="two-col">
        <div class="fg"><label>Item Name</label><input type="text" id="siName" placeholder="e.g. Extra Screen Time" /></div>
        <div class="fg"><label>Emoji</label><input type="text" id="siEmoji" placeholder="📱" maxlength="4" style="text-align:center;font-size:22px" /></div>
      </div>
      <div class="fg"><label>Description</label><input type="text" id="siDesc" placeholder="e.g. 30 extra minutes on any device" /></div>
      <div class="two-col">
        <div class="fg"><label>Cost (coins 🪙)</label><input type="number" id="siCost" value="50" min="5" max="9999" step="5" /></div>
        <div class="fg"><label>Stock (0 = unlimited)</label><input type="number" id="siStock" value="0" min="0" max="99" /></div>
      </div>
      <button class="btn btn-t btn-full" id="addStoreItemBtn">➕ Add to Store</button>
    </div>
    <div class="sec-title">Store Items</div>
    <div id="storeManageList"></div>
  </div>

  <div id="parent-orders" class="tc">
    <div class="sec-title">Purchase Requests 📦</div>
    <div id="ordersList"></div>
  </div>

  <div id="parent-dashboard" class="tc">
    <div class="sec-title">Family Dashboard 📊</div>
    <div class="sgrid" id="parentStats"></div>
    <div class="sec-title">Leaderboard 🏆</div>
    <div id="leaderboard"></div>
    <div class="sec-title" style="margin-top:20px">Quest Summary</div>
    <div id="questSummary"></div>
  </div>

  <div id="parent-family" class="tc">
    <div class="card">
      <div class="sec-title">Add a Child</div>
      <div class="fg"><label>Name</label><input type="text" id="newName" placeholder="e.g. Ahmed" /></div>
      <div class="two-col">
        <div class="fg"><label>Avatar</label>
          <select id="newAvatar">
            <option value="🧒">🧒 Kid</option><option value="👦">👦 Boy</option><option value="👧">👧 Girl</option>
            <option value="🧑">🧑 Teen</option><option value="⭐">⭐ Star</option><option value="🦁">🦁 Lion</option>
            <option value="🐯">🐯 Tiger</option><option value="🐻">🐻 Bear</option>
          </select>
        </div>
        <div class="fg"><label>Password</label><input type="text" id="newPass" placeholder="e.g. 1234" /></div>
      </div>
      <button class="btn btn-b btn-full" id="addChildBtn">➕ Add Child</button>
    </div>
    <div class="sec-title">Family Members</div>
    <div id="familyList"></div>
    <div class="card" style="border:2px dashed #F0E8DC;margin-top:8px">
      <div class="sec-title" style="font-size:16px">🔑 Change Parent Password</div>
      <div class="fg"><label>New Password</label><input type="text" id="newParentPass" placeholder="Enter new parent password" /></div>
      <button class="btn btn-b btn-full" id="changeParentPassBtn">Save Password</button>
    </div>
  </div>
</div>

<!-- CHILD -->
<div id="childScreen" class="screen">
  <div class="topbar tb-c">
    <div class="tb-title">RewardFlow</div>
    <div class="tb-right">
      <div class="pts-badge">🪙 <span id="childPts">0</span></div>
      <button class="btn-lo" id="childLogout">Logout</button>
    </div>
  </div>
  <div class="tabs" id="childTabs">
    <div class="tab active" data-tab="child-home">🏠 Home</div>
    <div class="tab" data-tab="child-quests">⚔️ Quests</div>
    <div class="tab" data-tab="child-shop">🛍️ Shop</div>
    <div class="tab" data-tab="child-rewards">🏆 Rewards</div>
  </div>
  <div id="child-home" class="tc active">
    <div class="hero" id="childHero"></div>
    <div class="sec-title">Active Quests</div>
    <div id="childActiveQ"></div>
  </div>
  <div id="child-quests" class="tc">
    <div class="sec-title">All My Quests</div>
    <div id="childAllQ"></div>
  </div>
  <div id="child-shop" class="tc"><div id="childShopContent"></div></div>
  <div id="child-rewards" class="tc"><div id="childRewardsContent"></div></div>
</div>

<!-- MODALS -->
<div class="overlay" id="submitModal">
  <div class="modal">
    <div class="modal-title">📸 Submit Quest Proof</div>
    <div id="submitInfo" class="card" style="margin-bottom:14px;padding:12px 14px;"></div>
    <div class="upload-area" id="uploadArea">
      <input type="file" id="photoInput" accept="image/*" />
      <div id="photoPlaceholder">
        <div style="font-size:36px;margin-bottom:8px">📷</div>
        <div style="font-weight:700;color:var(--muted)">Tap to take / upload a photo</div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">Show proof the quest is done!</div>
      </div>
      <img id="photoImg" class="photo-preview" style="display:none" alt="proof" />
    </div>
    <div id="aiResult" style="display:none"></div>
    <div class="modal-actions">
      <button class="btn btn-d" id="cancelSubmitBtn">Cancel</button>
      <button class="btn btn-s" id="submitBtn" disabled>✅ Submit for Approval</button>
    </div>
  </div>
</div>

<div class="overlay" id="reviewModal">
  <div class="modal">
    <div class="modal-title">🔍 Review Submission</div>
    <div id="reviewContent"></div>
    <div class="modal-actions">
      <button class="btn btn-d" id="rejectBtn">❌ Reject</button>
      <button class="btn btn-s" id="approveBtn">✅ Approve &amp; Award Coins</button>
    </div>
  </div>
</div>

<div class="overlay" id="buyModal">
  <div class="modal">
    <div class="modal-title">🛍️ Confirm Purchase</div>
    <div id="buyContent"></div>
    <div class="modal-actions">
      <button class="btn btn-d" id="cancelBuyBtn">Cancel</button>
      <button class="btn btn-gold" id="buyConfirmBtn">🪙 Spend Coins &amp; Buy!</button>
    </div>
  </div>
</div>

<div class="overlay" id="fulfillModal">
  <div class="modal">
    <div class="modal-title">📦 Fulfill Order</div>
    <div id="fulfillContent"></div>
    <div class="modal-actions">
      <button class="btn btn-d" id="cancelFulfillBtn">Cancel</button>
      <button class="btn btn-s" id="confirmFulfillBtn">✅ Mark as Given</button>
    </div>
  </div>
</div>

<div class="notif" id="notif"></div>
`;

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ══ LEVELS ══
    const LEVELS = [
      { name: 'Rookie', min: 0 }, { name: 'Explorer', min: 100 }, { name: 'Champion', min: 250 },
      { name: 'Hero', min: 500 }, { name: 'Legend', min: 900 }, { name: 'Grand Master', min: 1500 }
    ];
    function getLv(pts: number) {
      let l = LEVELS[0];
      for (const x of LEVELS) { if (pts >= x.min) l = x; }
      return l;
    }
    function nextLv(pts: number) {
      for (let i = 0; i < LEVELS.length - 1; i++) { if (LEVELS[i + 1].min > pts) return LEVELS[i + 1]; }
      return null;
    }

    // ══ STATE ══
    let S: any = {
      parentPass: 'parent123',
      children: [
        { id: 'c1', name: 'Ahmed', avatar: '👦', pass: 'ahmed123', points: 120, earned: 200, level: 3 },
        { id: 'c2', name: 'Fatima', avatar: '👧', pass: 'fatima123', points: 85, earned: 150, level: 2 },
      ],
      quests: [
        { id: 'q1', title: 'Clean Bedroom', desc: 'Tidy up and make the bed.', pts: 20, type: 'daily', cid: 'c1', status: 'approved', photo: null, air: 4, aic: 'Room looks neat!' },
        { id: 'q2', title: 'Wash the Dishes', desc: 'Wash all dishes and dry them.', pts: 15, type: 'daily', cid: 'c2', status: 'assigned', photo: null, air: null, aic: null },
        { id: 'q3', title: 'Water the Plants', desc: 'Water all plants in the garden.', pts: 10, type: 'weekly', cid: 'c1', status: 'pending', photo: 'demo', air: 3, aic: 'Plants look watered!' },
        { id: 'q4', title: 'Read 30 Mins', desc: 'Read a book for at least 30 minutes.', pts: 25, type: 'daily', cid: 'c2', status: 'completed', photo: 'demo', air: 5, aic: 'Excellent effort!' },
      ],
      store: [
        { id: 's1', name: 'Extra Screen Time', emoji: '📱', desc: '30 extra minutes on any device', cost: 80, stock: 0, active: true },
        { id: 's2', name: 'Choose Dinner', emoji: '🍕', desc: 'You pick what the family eats tonight', cost: 150, stock: 3, active: true },
        { id: 's3', name: 'Stay Up Late', emoji: '🌙', desc: '30 extra minutes before bedtime', cost: 100, stock: 0, active: true },
        { id: 's4', name: 'Skip One Chore', emoji: '🚫', desc: 'Skip any single assigned chore', cost: 60, stock: 5, active: true },
        { id: 's5', name: 'Toy / Gift', emoji: '🎁', desc: 'A small surprise gift from parents', cost: 300, stock: 2, active: true },
      ],
      orders: [
        { id: 'o1', childId: 'c2', storeId: 's1', name: 'Extra Screen Time', emoji: '📱', cost: 80, status: 'pending', date: '2026-03-25' },
      ],
      user: null as string | null,
      questId: null as string | null,
      storeId: null as string | null,
      orderId: null as string | null,
      pwMode: null as string | null,
    };

    let photoData: string | null = null;

    function save() {
      try {
        localStorage.setItem('rf2', JSON.stringify({
          parentPass: S.parentPass, children: S.children, quests: S.quests, store: S.store, orders: S.orders
        }));
      } catch (e) { /* ignore */ }
    }
    function load() {
      try {
        const d = JSON.parse(localStorage.getItem('rf2') || 'null');
        if (d) {
          if (d.parentPass) S.parentPass = d.parentPass;
          if (d.children) S.children = d.children;
          if (d.quests) S.quests = d.quests;
          if (d.store) S.store = d.store;
          if (d.orders) S.orders = d.orders;
        }
      } catch (e) { /* ignore */ }
    }

    const $ = (id: string) => document.getElementById(id);

    function showScreen(id: string) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      $(id)?.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    }
    function openM(id: string) { $(id)?.classList.add('open'); }
    function closeM(id: string) { $(id)?.classList.remove('open'); }

    const P_TABS = ['assign', 'review', 'store', 'orders', 'dashboard', 'family'];
    const C_TABS = ['home', 'quests', 'shop', 'rewards'];

    function showTab(role: string, tab: string) {
      const order = role === 'parent' ? P_TABS : C_TABS;
      const tabs = document.querySelectorAll(`#${role}Tabs .tab`);
      const tcs = document.querySelectorAll(`#${role}Screen .tc`);
      tabs.forEach(t => t.classList.remove('active'));
      tcs.forEach(t => t.classList.remove('active'));
      const i = order.indexOf(tab);
      if (tabs[i]) tabs[i].classList.add('active');
      $(`${role}-${tab}`)?.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const renders: any = {
        'parent-assign': renderAssign, 'parent-review': renderReview, 'parent-store': renderStoreManage,
        'parent-orders': renderOrders, 'parent-dashboard': renderDashboard, 'parent-family': renderFamily,
        'child-home': renderChild, 'child-quests': renderChildQ, 'child-shop': renderShop, 'child-rewards': renderRewards,
      };
      const fn = renders[`${role}-${tab}`];
      if (fn) fn();
    }

    function refreshBadges() {
      const pb = $('pendingBadge');
      const ob = $('ordersBadge');
      const pn = S.quests.filter((q: any) => q.status === 'pending').length;
      const on = S.orders.filter((o: any) => o.status === 'pending').length;
      if (pb) pb.textContent = pn ? `(${pn})` : '';
      if (ob) ob.textContent = on ? `(${on})` : '';
    }

    function goToPassword(mode: string) {
      S.pwMode = mode;
      const box = $('pwBox');
      if (!box) return;
      if (mode === 'parent') {
        box.innerHTML = `
          <div class="pw-avatar">👨‍👩‍👧</div>
          <div class="pw-title">Parent Login</div>
          <div class="pw-sub">Enter your parent password</div>
          <input class="pw-input" type="password" id="pwInput" placeholder="••••••">
          <div class="pw-error" id="pwError"></div>
          <button class="btn btn-b btn-full" id="checkPassBtn">🔓 Enter</button>
          <button class="pw-back" id="pwBack">← Back</button>`;
        showScreen('pwScreen');
        setTimeout(() => $('pwInput')?.focus(), 150);
        setTimeout(() => {
          $('checkPassBtn')?.addEventListener('click', checkPass);
          $('pwBack')?.addEventListener('click', () => showScreen('loginScreen'));
          $('pwInput')?.addEventListener('keydown', (e: any) => { if (e.key === 'Enter') checkPass(); });
        }, 0);
      } else {
        if (!S.children.length) {
          box.innerHTML = `
            <div class="pw-avatar">🧒</div>
            <div class="pw-title">No children yet</div>
            <div class="pw-sub" style="margin-bottom:20px">Ask a parent to add you first!</div>
            <button class="pw-back" id="pwBack">← Back</button>`;
          showScreen('pwScreen');
          setTimeout(() => $('pwBack')?.addEventListener('click', () => showScreen('loginScreen')), 0);
          return;
        }
        const items = S.children.map((c: any) => `
          <div class="child-pick-item" data-child-id="${c.id}">
            <div class="cp-av">${c.avatar}</div>
            <div class="cp-name">${c.name}</div>
            <div class="cp-pts">🪙${c.points}</div>
          </div>`).join('');
        box.innerHTML = `
          <div class="pw-avatar">🧒</div>
          <div class="pw-title">Who are you?</div>
          <div class="pw-sub" style="margin-bottom:16px">Pick your name</div>
          ${items}
          <button class="pw-back" id="pwBack">← Back</button>`;
        showScreen('pwScreen');
        setTimeout(() => {
          box.querySelectorAll('.child-pick-item').forEach((el: any) => {
            el.addEventListener('click', () => selectChildForPw(el.dataset.childId));
          });
          $('pwBack')?.addEventListener('click', () => showScreen('loginScreen'));
        }, 0);
      }
    }

    function selectChildForPw(id: string) {
      S.user = id;
      const c = S.children.find((x: any) => x.id === id);
      if (!c) return;
      const box = $('pwBox');
      if (!box) return;
      box.innerHTML = `
        <div class="pw-avatar">${c.avatar}</div>
        <div class="pw-title">Hi, ${c.name}!</div>
        <div class="pw-sub">Enter your password</div>
        <input class="pw-input" type="password" id="pwInput" placeholder="••••••">
        <div class="pw-error" id="pwError"></div>
        <button class="btn btn-p btn-full" id="checkPassBtn">🔓 Enter</button>
        <button class="pw-back" id="pwBack">← Back</button>`;
      setTimeout(() => {
        $('pwInput')?.focus();
        $('checkPassBtn')?.addEventListener('click', checkPass);
        $('pwBack')?.addEventListener('click', () => goToPassword('child'));
        $('pwInput')?.addEventListener('keydown', (e: any) => { if (e.key === 'Enter') checkPass(); });
      }, 0);
    }

    function checkPass() {
      const input = $('pwInput') as HTMLInputElement;
      const errEl = $('pwError');
      if (!input || !errEl) return;
      const val = input.value.trim();
      errEl.textContent = '';
      if (!val) { errEl.textContent = 'Please enter a password!'; return; }
      if (S.pwMode === 'parent') {
        if (val === S.parentPass) {
          S.user = 'parent';
          showScreen('parentScreen');
          showTab('parent', 'assign');
          refreshBadges();
        } else {
          errEl.textContent = '❌ Wrong password, try again!';
          input.value = ''; input.focus();
        }
      } else {
        const c = S.children.find((x: any) => x.id === S.user);
        if (!c) return;
        if (val === c.pass) {
          showScreen('childScreen');
          showTab('child', 'home');
        } else {
          errEl.textContent = '❌ Wrong password, try again!';
          input.value = ''; input.focus();
        }
      }
    }

    function logout() {
      S.user = null; S.pwMode = null;
      showScreen('loginScreen');
    }

    // ══ PARENT RENDERS ══
    function renderAssign() {
      const sel = $('qChild') as HTMLSelectElement;
      if (sel) sel.innerHTML = S.children.length
        ? S.children.map((c: any) => `<option value="${c.id}">${c.avatar} ${c.name}</option>`).join('')
        : '<option value="">— Add a child first —</option>';
      const el = $('allQuestsList');
      if (el) el.innerHTML = S.quests.length
        ? S.quests.map((q: any) => qCard(q, 'parent')).join('')
        : '<div class="empty"><div class="empty-icon">📋</div><p>No quests yet. Create one above!</p></div>';
      bindQuestActions();
    }

    function renderReview() {
      const pend = S.quests.filter((q: any) => q.status === 'pending');
      const el = $('reviewList'); if (!el) return;
      if (!pend.length) {
        el.innerHTML = '<div class="empty"><div class="empty-icon">✅</div><p>Nothing to review right now!</p></div>';
        return;
      }
      el.innerHTML = pend.map((q: any) => {
        const c = S.children.find((x: any) => x.id === q.cid);
        return `<div class="qc s-pending">
          <div class="qh">
            <div><div class="qt">${q.title}</div><div class="qm">${c?.avatar || ''} ${c?.name || '?'} • <span class="tag tag-${q.type}">${q.type}</span></div></div>
            <div class="qpts">🪙${q.pts}</div>
          </div>
          ${q.air ? `<div class="air"><div class="air-t">🤖 AI Rating</div><div class="stars">${'★'.repeat(q.air)}${'☆'.repeat(5 - q.air)}</div><div class="air-c">"${q.aic}"</div></div>` : ''}
          <div class="qa"><button class="btn btn-b btn-sm" data-review-id="${q.id}">🔍 Review Photo</button></div>
        </div>`;
      }).join('');
      el.querySelectorAll('[data-review-id]').forEach((btn: any) => {
        btn.addEventListener('click', () => openReview(btn.dataset.reviewId));
      });
      refreshBadges();
    }

    function renderStoreManage() {
      const el = $('storeManageList'); if (!el) return;
      if (!S.store.length) {
        el.innerHTML = '<div class="empty"><div class="empty-icon">🛍️</div><p>No store items yet. Add one above!</p></div>';
        return;
      }
      el.innerHTML = `<div class="store-grid">${S.store.map((item: any) => {
        const unlimited = item.stock === 0;
        const outOfStock = !unlimited && item.stock <= 0;
        const stockLabel = unlimited ? '∞ Unlimited' : `${item.stock} left`;
        const stockClass = outOfStock ? 'stock-out' : 'stock-ok';
        return `<div class="store-item${outOfStock ? ' oos' : ''}${!item.active ? ' oos' : ''}">
          <span class="si-emoji">${item.emoji}</span>
          <div class="si-name">${item.name}</div>
          <div class="si-desc">${item.desc}</div>
          <div class="si-price">🪙 ${item.cost}</div>
          <div class="si-stock ${stockClass}">${stockLabel}</div>
          <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:4px">
            <button class="btn btn-d btn-sm" data-remove-store="${item.id}">🗑</button>
            <button class="btn btn-b btn-sm" data-toggle-store="${item.id}">${item.active ? 'Hide' : 'Show'}</button>
          </div>
        </div>`;
      }).join('')}</div>`;
      el.querySelectorAll('[data-remove-store]').forEach((btn: any) => {
        btn.addEventListener('click', () => { S.store = S.store.filter((s: any) => s.id !== btn.dataset.removeStore); save(); renderStoreManage(); notify('Item removed 🗑'); });
      });
      el.querySelectorAll('[data-toggle-store]').forEach((btn: any) => {
        btn.addEventListener('click', () => {
          const item = S.store.find((s: any) => s.id === btn.dataset.toggleStore);
          if (item) { item.active = !item.active; save(); renderStoreManage(); notify(item.active ? 'Item is now visible in shop ✅' : 'Item hidden from shop 🙈'); }
        });
      });
    }

    function renderOrders() {
      const el = $('ordersList'); if (!el) return;
      if (!S.orders.length) {
        el.innerHTML = '<div class="empty"><div class="empty-icon">📦</div><p>No purchase requests yet!</p></div>';
        return;
      }
      const sorted = [...S.orders].sort((a: any, b: any) => (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1));
      el.innerHTML = sorted.map((o: any) => {
        const c = S.children.find((x: any) => x.id === o.childId);
        return `<div class="ph-row">
          <div class="ph-emoji">${o.emoji}</div>
          <div class="ph-info">
            <div class="ph-name">${o.name}</div>
            <div class="ph-meta">${c?.avatar || ''} ${c?.name || '?'} · ${o.date}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
            <div class="ph-pts">−🪙${o.cost}</div>
            <span class="${o.status === 'pending' ? 'ph-pend' : 'ph-done'}">${o.status === 'pending' ? '⏳ Pending' : '✅ Fulfilled'}</span>
            ${o.status === 'pending' ? `<button class="btn btn-s btn-sm" data-fulfill-id="${o.id}">✅ Fulfill</button>` : ''}
          </div>
        </div>`;
      }).join('');
      el.querySelectorAll('[data-fulfill-id]').forEach((btn: any) => {
        btn.addEventListener('click', () => openFulfill(btn.dataset.fulfillId));
      });
      refreshBadges();
    }

    function renderDashboard() {
      const tot = S.quests.length,
        app = S.quests.filter((q: any) => q.status === 'approved').length,
        pen = S.quests.filter((q: any) => q.status === 'pending').length,
        tpts = S.children.reduce((a: number, c: any) => a + c.earned, 0),
        pendOrders = S.orders.filter((o: any) => o.status === 'pending').length;
      const sEl = $('parentStats');
      if (sEl) sEl.innerHTML = `
        <div class="scard"><div class="sv" style="color:var(--blue)">${tot}</div><div class="sl">Total Quests</div></div>
        <div class="scard"><div class="sv" style="color:var(--green)">${app}</div><div class="sl">Approved</div></div>
        <div class="scard"><div class="sv" style="color:var(--gold)">${pen}</div><div class="sl">Pending</div></div>
        <div class="scard"><div class="sv" style="color:var(--orange)">${tpts}</div><div class="sl">Coins Awarded</div></div>
        <div class="scard"><div class="sv" style="color:var(--teal)">${S.store.length}</div><div class="sl">Store Items</div></div>
        <div class="scard"><div class="sv" style="color:var(--purple)">${pendOrders}</div><div class="sl">Open Orders</div></div>`;
      const sortedC = [...S.children].sort((a: any, b: any) => b.earned - a.earned);
      const med = ['🥇', '🥈', '🥉'];
      const lbEl = $('leaderboard');
      if (lbEl) lbEl.innerHTML = sortedC.length ? sortedC.map((c: any, i: number) => {
        const lv = getLv(c.earned);
        return `<div class="lb-row">
          <div class="lb-rank">${med[i] || `#${i + 1}`}</div>
          <div class="lb-av">${c.avatar}</div>
          <div style="flex:1;min-width:0"><div class="lb-name">${c.name}</div><span class="lv-badge">Lv.${c.level} ${lv.name}</span></div>
          <div class="lb-pts">🪙${c.earned}</div>
        </div>`;
      }).join('') : '<div class="empty"><p>No children yet</p></div>';
      const sc: any = {}; S.quests.forEach((q: any) => { sc[q.status] = (sc[q.status] || 0) + 1; });
      const qsEl = $('questSummary');
      if (qsEl) qsEl.innerHTML = Object.entries(sc).map(([s, n]: any) =>
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
          <span class="sp sp-${s}">${s}</span><strong>${n} quest${n > 1 ? 's' : ''}</strong>
        </div>`).join('');
    }

    function renderFamily() {
      const el = $('familyList'); if (!el) return;
      if (!S.children.length) { el.innerHTML = '<div class="empty"><div class="empty-icon">👨‍👩‍👧</div><p>No children yet.</p></div>'; return; }
      el.innerHTML = S.children.map((c: any) => {
        const lv = getLv(c.earned), nl = nextLv(c.earned);
        const pct = nl ? Math.round(((c.earned - lv.min) / (nl.min - lv.min)) * 100) : 100;
        const mq = S.quests.filter((q: any) => q.cid === c.id), done = mq.filter((q: any) => q.status === 'approved').length;
        const spent = S.orders.filter((o: any) => o.childId === c.id).reduce((a: number, o: any) => a + o.cost, 0);
        return `<div class="card">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
            <div style="font-size:44px">${c.avatar}</div>
            <div style="flex:1">
              <div style="font-weight:800;font-size:18px">${c.name}</div>
              <span class="lv-badge">Lv.${c.level} ${lv.name}</span>
            </div>
            <div style="text-align:right">
              <div style="font-family:'Fredoka One',cursive;font-size:22px;color:var(--gold)">🪙${c.points}</div>
              <div style="font-size:10px;color:var(--muted)">available</div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:4px">Level progress${nl ? ` → ${nl.name}` : ''}</div>
          <div class="pb-wrap"><div class="pb-fill" style="width:${pct}%"></div></div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">${pct}% · ${done}/${mq.length} quests done · 🪙${spent} spent</div>
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
            <button class="btn btn-d btn-sm" data-remove-child="${c.id}">🗑 Remove</button>
            <button class="btn btn-b btn-sm" data-change-child-pass="${c.id}">🔑 Change Password</button>
          </div>
        </div>`;
      }).join('');
      el.querySelectorAll('[data-remove-child]').forEach((btn: any) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.removeChild;
          S.children = S.children.filter((c: any) => c.id !== id);
          S.quests = S.quests.filter((q: any) => q.cid !== id);
          S.orders = S.orders.filter((o: any) => o.childId !== id);
          save(); renderFamily(); renderAssign(); notify('Child removed');
        });
      });
      el.querySelectorAll('[data-change-child-pass]').forEach((btn: any) => {
        btn.addEventListener('click', () => {
          const c = S.children.find((x: any) => x.id === btn.dataset.changeChildPass);
          if (!c) return;
          const np = prompt(`New password for ${c.name}:`);
          if (np === null) return;
          if (!np.trim()) { notify('Password cannot be empty!'); return; }
          c.pass = np.trim(); save(); notify(`🔑 Password updated for ${c.name}!`);
        });
      });
    }

    // ══ CHILD RENDERS ══
    function renderChild() {
      const c = S.children.find((x: any) => x.id === S.user); if (!c) return;
      const cpts = $('childPts'); if (cpts) cpts.textContent = c.points;
      const lv = getLv(c.earned), nl = nextLv(c.earned);
      const pct = nl ? Math.round(((c.earned - lv.min) / (nl.min - lv.min)) * 100) : 100;
      const hero = $('childHero');
      if (hero) hero.innerHTML = `
        <div class="h-greet">Welcome back,</div>
        <div class="h-name">${c.avatar} ${c.name}!</div>
        <div class="h-level">Level ${c.level} ${lv.name} · 🪙 ${c.points} coins to spend</div>
        <div style="margin-top:12px">
          <div style="font-size:11px;opacity:.8;margin-bottom:4px">${nl ? `Progress to ${nl.name} (${pct}%)` : 'Max level reached! 🎉'}</div>
          <div style="background:rgba(255,255,255,.25);border-radius:30px;height:8px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:white;border-radius:30px;transition:width .5s"></div>
          </div>
        </div>`;
      const active = S.quests.filter((q: any) => q.cid === c.id && ['assigned', 'pending'].includes(q.status));
      const aEl = $('childActiveQ');
      if (aEl) aEl.innerHTML = active.length
        ? active.map((q: any) => qCard(q, 'child')).join('')
        : '<div class="empty"><div class="empty-icon">🎉</div><p>All caught up! Check the Shop 🛍️</p></div>';
      bindQuestActions();
    }

    function renderChildQ() {
      const c = S.children.find((x: any) => x.id === S.user); if (!c) return;
      const el = $('childAllQ'); if (!el) return;
      const mq = S.quests.filter((q: any) => q.cid === c.id);
      el.innerHTML = mq.length
        ? mq.map((q: any) => qCard(q, 'child')).join('')
        : '<div class="empty"><div class="empty-icon">📋</div><p>No quests assigned yet!</p></div>';
      bindQuestActions();
    }

    function renderShop() {
      const c = S.children.find((x: any) => x.id === S.user); if (!c) return;
      const el = $('childShopContent'); if (!el) return;
      const activeItems = S.store.filter((i: any) => i.active);
      const myOrders = S.orders.filter((o: any) => o.childId === c.id);
      let html = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
          <div class="sec-title" style="margin:0">🛍️ Reward Shop</div>
          <div style="background:linear-gradient(135deg,var(--gold),var(--gold-light));color:#7A4E00;border-radius:20px;padding:6px 16px;font-weight:800;font-size:14px;">🪙 ${c.points} coins</div>
        </div>`;
      if (!activeItems.length) {
        html += '<div class="empty"><div class="empty-icon">🛍️</div><p>No items in the shop yet! Ask a parent to add some.</p></div>';
      } else {
        html += '<div class="store-grid">';
        activeItems.forEach((item: any) => {
          const unlimited = item.stock === 0;
          const hasStock = unlimited || item.stock > 0;
          const canAfford = c.points >= item.cost;
          const canBuy = canAfford && hasStock;
          const stockLabel = unlimited ? '∞ Unlimited' : `${item.stock} left`;
          const stockClass = hasStock ? 'stock-ok' : 'stock-out';
          html += `<div class="store-item${!hasStock ? ' oos' : ''}">
            <span class="si-emoji">${item.emoji}</span>
            <div class="si-name">${item.name}</div>
            <div class="si-desc">${item.desc}</div>
            <div class="si-price">🪙 ${item.cost}</div>
            <div class="si-stock ${stockClass}">${stockLabel}</div>
            <button class="btn btn-gold btn-sm btn-full" data-buy-id="${item.id}" ${!canBuy ? 'disabled' : ''}>
              ${!hasStock ? 'Out of stock 😔' : !canAfford ? `Need ${item.cost - c.points} more 🪙` : '🛒 Buy!'}
            </button>
          </div>`;
        });
        html += '</div>';
      }
      if (myOrders.length) {
        html += `<div class="sec-title" style="margin-top:8px">My Purchases</div>`;
        html += [...myOrders].reverse().map((o: any) => `
          <div class="ph-row">
            <div class="ph-emoji">${o.emoji}</div>
            <div class="ph-info"><div class="ph-name">${o.name}</div><div class="ph-meta">${o.date}</div></div>
            <div style="text-align:right">
              <div class="ph-pts">−🪙${o.cost}</div>
              <span class="${o.status === 'pending' ? 'ph-pend' : 'ph-done'}">${o.status === 'pending' ? '⏳ Waiting' : '✅ Received'}</span>
            </div>
          </div>`).join('');
      }
      el.innerHTML = html;
      el.querySelectorAll('[data-buy-id]').forEach((btn: any) => {
        btn.addEventListener('click', () => openBuy(btn.dataset.buyId));
      });
    }

    function renderRewards() {
      const c = S.children.find((x: any) => x.id === S.user); if (!c) return;
      const done = S.quests.filter((q: any) => q.cid === c.id && q.status === 'approved').length;
      const spent = S.orders.filter((o: any) => o.childId === c.id).reduce((a: number, o: any) => a + o.cost, 0);
      const lv = getLv(c.earned), nl = nextLv(c.earned);
      const pct = nl ? Math.round(((c.earned - lv.min) / (nl.min - lv.min)) * 100) : 100;
      const el = $('childRewardsContent'); if (!el) return;
      el.innerHTML = `
        <div class="card" style="text-align:center;padding:28px">
          <div style="font-size:60px;margin-bottom:12px">${c.avatar}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:26px">${c.name}</div>
          <span class="lv-badge" style="margin:8px 0;display:inline-block;font-size:13px;padding:5px 14px">Level ${c.level} — ${lv.name}</span>
          <div style="font-family:'Fredoka One',cursive;font-size:38px;color:var(--gold);margin:12px 0">🪙 ${c.earned}</div>
          <div style="font-size:13px;color:var(--muted);margin-bottom:16px">Total coins ever earned</div>
          ${nl
          ? `<div style="font-size:13px;font-weight:700;margin-bottom:6px">Progress to ${nl.name}</div>
              <div class="pb-wrap"><div class="pb-fill" style="width:${pct}%"></div></div>
              <div style="font-size:12px;color:var(--muted);margin-top:6px">${nl.min - c.earned} more coins needed</div>`
          : '<div style="color:var(--gold);font-weight:800;font-size:16px">🏆 Maximum level reached!</div>'}
        </div>
        <div class="sgrid">
          <div class="scard"><div class="sv" style="color:var(--green)">${done}</div><div class="sl">Quests Done</div></div>
          <div class="scard"><div class="sv" style="color:var(--orange)">${c.points}</div><div class="sl">Available 🪙</div></div>
          <div class="scard"><div class="sv" style="color:var(--purple)">${spent}</div><div class="sl">Coins Spent</div></div>
          <div class="scard"><div class="sv" style="color:var(--blue)">${c.level}</div><div class="sl">Level</div></div>
        </div>
        <div class="card">
          <div class="sec-title">🏅 Level Milestones</div>
          ${LEVELS.map(l => { const ok = c.earned >= l.min; return `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
              <span style="font-weight:700;color:${ok ? 'var(--green)' : 'var(--muted)'}">${ok ? '✅' : '🔒'} ${l.name}</span>
              <span style="font-size:12px;color:var(--muted)">🪙 ${l.min}</span>
            </div>`; }).join('')}
        </div>`;
    }

    // ══ QUEST CARD ══
    function qCard(q: any, role: string) {
      const c = S.children.find((x: any) => x.id === q.cid);
      let actions = '';
      if (role === 'parent') {
        if (q.status === 'pending')
          actions = `<button class="btn btn-b btn-sm" data-review-id="${q.id}">🔍 Review</button><button class="btn btn-d btn-sm" data-del-q="${q.id}">🗑</button>`;
        else
          actions = `<button class="btn btn-d btn-sm" data-del-q="${q.id}">🗑 Delete</button>`;
      } else {
        if (q.status === 'assigned') actions = `<button class="btn btn-p btn-sm" data-submit-id="${q.id}">📸 Submit Proof</button>`;
        if (q.status === 'rejected') actions = `<button class="btn btn-p btn-sm" data-submit-id="${q.id}">🔄 Resubmit</button>`;
      }
      return `<div class="qc s-${q.status}">
        <div class="qh">
          <div style="flex:1;min-width:0">
            <div class="qt">${q.title}</div>
            <div class="qm" style="margin:4px 0">${role === 'parent' ? `${c?.avatar || ''} ${c?.name || '?'} · ` : ''}<span class="tag tag-${q.type}">${q.type}</span></div>
            <div class="qm">${q.desc || ''}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div class="qpts">🪙${q.pts}</div>
            <div style="margin-top:6px"><span class="sp sp-${q.status}">${q.status}</span></div>
          </div>
        </div>
        ${q.air ? `<div class="air"><div class="air-t">🤖 AI: ${'★'.repeat(q.air)}${'☆'.repeat(5 - q.air)}</div><div class="air-c">"${q.aic}"</div></div>` : ''}
        ${actions ? `<div class="qa">${actions}</div>` : ''}
      </div>`;
    }

    function bindQuestActions() {
      document.querySelectorAll('[data-del-q]').forEach((btn: any) => {
        btn.addEventListener('click', () => {
          S.quests = S.quests.filter((q: any) => q.id !== btn.dataset.delQ);
          save(); renderAssign(); refreshBadges(); notify('Quest deleted 🗑');
        });
      });
      document.querySelectorAll('[data-review-id]').forEach((btn: any) => {
        btn.addEventListener('click', () => openReview(btn.dataset.reviewId));
      });
      document.querySelectorAll('[data-submit-id]').forEach((btn: any) => {
        btn.addEventListener('click', () => openSubmit(btn.dataset.submitId));
      });
    }

    function createQuest() {
      const title = ($('qTitle') as HTMLInputElement).value.trim();
      const desc = ($('qDesc') as HTMLTextAreaElement).value.trim();
      const pts = parseInt(($('qPts') as HTMLInputElement).value) || 20;
      const type = ($('qType') as HTMLSelectElement).value;
      const cid = ($('qChild') as HTMLSelectElement).value;
      if (!title) { notify('Please enter a quest title! 📝'); return; }
      if (!cid) { notify('Please add a child first! 👶'); return; }
      S.quests.unshift({ id: 'q' + Date.now(), title, desc, pts, type, cid, status: 'assigned', photo: null, air: null, aic: null });
      save();
      ($('qTitle') as HTMLInputElement).value = '';
      ($('qDesc') as HTMLTextAreaElement).value = '';
      notify(`Quest "${title}" assigned! 🚀`);
      renderAssign();
    }

    function addChild() {
      const name = ($('newName') as HTMLInputElement).value.trim();
      const avatar = ($('newAvatar') as HTMLSelectElement).value;
      const pass = ($('newPass') as HTMLInputElement).value.trim();
      if (!name) { notify('Enter a name! 👤'); return; }
      if (!pass) { notify('Enter a password for the child! 🔑'); return; }
      S.children.push({ id: 'c' + Date.now(), name, avatar, pass, points: 0, earned: 0, level: 1 });
      ($('newName') as HTMLInputElement).value = '';
      ($('newPass') as HTMLInputElement).value = '';
      save(); renderFamily(); renderAssign();
      notify(`${avatar} ${name} added to the family! 👨‍👩‍👧`);
    }

    function changeParentPass() {
      const np = ($('newParentPass') as HTMLInputElement).value.trim();
      if (!np) { notify('Enter a new password!'); return; }
      S.parentPass = np;
      ($('newParentPass') as HTMLInputElement).value = '';
      save(); notify('🔑 Parent password updated!');
    }

    function addStoreItem() {
      const name = ($('siName') as HTMLInputElement).value.trim();
      const emoji = ($('siEmoji') as HTMLInputElement).value.trim() || '🎁';
      const desc = ($('siDesc') as HTMLInputElement).value.trim();
      const cost = parseInt(($('siCost') as HTMLInputElement).value) || 50;
      const stock = parseInt(($('siStock') as HTMLInputElement).value) || 0;
      if (!name) { notify('Enter an item name! 🏷️'); return; }
      S.store.push({ id: 's' + Date.now(), name, emoji, desc, cost, stock, active: true });
      ($('siName') as HTMLInputElement).value = '';
      ($('siEmoji') as HTMLInputElement).value = '';
      ($('siDesc') as HTMLInputElement).value = '';
      save(); renderStoreManage();
      notify(`${emoji} "${name}" added to the store! 🛍️`);
    }

    function openBuy(sid: string) {
      const item = S.store.find((s: any) => s.id === sid);
      const c = S.children.find((x: any) => x.id === S.user);
      if (!item || !c) return;
      S.storeId = sid;
      const after = c.points - item.cost;
      const el = $('buyContent');
      if (el) el.innerHTML = `
        <div style="text-align:center;padding:16px 0">
          <div style="font-size:56px;margin-bottom:10px">${item.emoji}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:22px;margin-bottom:6px">${item.name}</div>
          <div style="font-size:13px;color:var(--muted);margin-bottom:16px">${item.desc}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:32px;color:var(--gold);margin-bottom:8px">🪙 ${item.cost}</div>
          <div style="font-size:13px;">Your balance: <strong>🪙${c.points}</strong> → After: <strong style="color:${after >= 0 ? 'var(--green)' : 'var(--red)'}">🪙${after}</strong></div>
        </div>
        <div style="background:#FFF9F0;border-radius:12px;padding:12px;font-size:13px;text-align:center;color:var(--muted);margin-top:8px">
          ⏳ Your parent will confirm and give you this reward!
        </div>`;
      openM('buyModal');
    }

    function confirmBuy() {
      const item = S.store.find((s: any) => s.id === S.storeId);
      const c = S.children.find((x: any) => x.id === S.user);
      if (!item || !c) return;
      if (c.points < item.cost) { notify('Not enough coins! 😔'); closeM('buyModal'); return; }
      c.points -= item.cost;
      if (item.stock > 0) item.stock--;
      const today = new Date().toISOString().split('T')[0];
      S.orders.push({ id: 'o' + Date.now(), childId: c.id, storeId: item.id, name: item.name, emoji: item.emoji, cost: item.cost, status: 'pending', date: today });
      save(); closeM('buyModal');
      const cpts = $('childPts'); if (cpts) cpts.textContent = c.points;
      notify(`🛒 Bought "${item.name}"! Your parent will give it to you soon ⏳`);
      renderShop();
    }

    function openFulfill(oid: string) {
      const o = S.orders.find((x: any) => x.id === oid); if (!o) return;
      S.orderId = oid;
      const c = S.children.find((x: any) => x.id === o.childId);
      const el = $('fulfillContent');
      if (el) el.innerHTML = `
        <div style="text-align:center;padding:16px 0">
          <div style="font-size:48px;margin-bottom:10px">${o.emoji}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:20px;margin-bottom:6px">${o.name}</div>
          <div style="font-size:14px;color:var(--muted);margin-bottom:12px">Requested by ${c?.avatar || ''} <strong>${c?.name || '?'}</strong></div>
          <div style="font-size:13px;font-weight:700;color:var(--orange)">🪙 ${o.cost} coins already deducted</div>
        </div>
        <div style="background:#E8F5E9;border-radius:12px;padding:12px;font-size:13px;text-align:center;color:#2E7D32;font-weight:700">
          Click "Mark as Given" once you've given this reward to ${c?.name || 'them'}!
        </div>`;
      openM('fulfillModal');
    }

    function confirmFulfill() {
      const o = S.orders.find((x: any) => x.id === S.orderId); if (!o) return;
      o.status = 'fulfilled';
      save(); closeM('fulfillModal'); renderOrders(); refreshBadges();
      notify('✅ Order marked as fulfilled!');
    }

    function openSubmit(qid: string) {
      const q = S.quests.find((x: any) => x.id === qid); if (!q) return;
      S.questId = qid; photoData = null;
      const si = $('submitInfo');
      if (si) si.innerHTML = `<strong>${q.title}</strong> · 🪙${q.pts}<br><span style="font-size:12px;color:var(--muted)">${q.desc || ''}</span>`;
      const pp = $('photoPlaceholder'); if (pp) pp.style.display = 'block';
      const pi = $('photoImg') as HTMLImageElement; if (pi) pi.style.display = 'none';
      const ar = $('aiResult'); if (ar) ar.style.display = 'none';
      const sb = $('submitBtn') as HTMLButtonElement; if (sb) sb.disabled = true;
      const inp = $('photoInput') as HTMLInputElement; if (inp) inp.value = '';
      openM('submitModal');
    }

    function previewPhoto(e: Event) {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        photoData = ev.target?.result as string;
        const pp = $('photoPlaceholder'); if (pp) pp.style.display = 'none';
        const img = $('photoImg') as HTMLImageElement;
        img.src = photoData; img.style.display = 'block';
        runAI();
      };
      reader.readAsDataURL(file);
    }

    function runAI() {
      const el = $('aiResult');
      if (!el) return;
      el.style.display = 'block';
      el.innerHTML = '<div class="air"><div class="air-t">🤖 AI is rating your submission...</div><div style="color:var(--muted);font-size:13px">⏳ Analysing photo...</div></div>';
      setTimeout(() => {
        const rating = Math.floor(Math.random() * 3) + 3;
        const comments = [
          'Great work! The task looks well completed.',
          'Excellent effort! Clear and convincing photo.',
          'Good job! The quest appears done properly.',
          'Well done! Nice clear photo of the completed task.',
          'Solid completion! Task has been carried out well.'
        ];
        const comment = comments[Math.floor(Math.random() * comments.length)];
        const q = S.quests.find((x: any) => x.id === S.questId);
        if (q) { q.air = rating; q.aic = comment; }
        el.innerHTML = `<div class="air">
          <div class="air-t">🤖 AI Rating Complete</div>
          <div class="stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
          <div class="air-c">"${comment}"</div>
        </div>`;
        const sb = $('submitBtn') as HTMLButtonElement; if (sb) sb.disabled = false;
      }, 1800);
    }

    function submitQuest() {
      const q = S.quests.find((x: any) => x.id === S.questId); if (!q) return;
      q.photo = photoData || 'demo'; q.status = 'pending';
      save(); closeM('submitModal');
      notify('Quest submitted! Waiting for parent approval ⏳');
      renderChild(); refreshBadges();
    }

    function openReview(qid: string) {
      const q = S.quests.find((x: any) => x.id === qid); if (!q) return;
      S.questId = qid;
      const c = S.children.find((x: any) => x.id === q.cid);
      const el = $('reviewContent'); if (!el) return;
      el.innerHTML = `
        <div class="card" style="margin-bottom:12px;padding:14px">
          <strong style="font-size:16px">${q.title}</strong><br>
          <span style="font-size:13px;color:var(--muted)">${c?.avatar || ''} ${c?.name || ''} · 🪙${q.pts}</span><br>
          <span style="font-size:12px;color:var(--muted)">${q.desc || ''}</span>
        </div>
        ${q.photo && q.photo !== 'demo'
          ? `<img src="${q.photo}" class="photo-preview" alt="proof">`
          : q.photo === 'demo'
            ? `<div style="background:#F0F4FF;border-radius:12px;padding:24px;text-align:center;margin:10px 0;font-size:36px">📷<br><span style="font-size:12px;color:var(--muted)">Submission photo</span></div>`
            : ''}
        ${q.air ? `<div class="air"><div class="air-t">🤖 AI Rating</div><div class="stars">${'★'.repeat(q.air)}${'☆'.repeat(5 - q.air)}</div><div class="air-c">"${q.aic}"</div></div>` : ''}`;
      openM('reviewModal');
    }

    function decideQuest(dec: string) {
      const q = S.quests.find((x: any) => x.id === S.questId); if (!q) return;
      q.status = dec;
      if (dec === 'approved') {
        const c = S.children.find((x: any) => x.id === q.cid);
        if (c) {
          c.points += q.pts; c.earned += q.pts;
          c.level = LEVELS.filter(l => c.earned >= l.min).length;
          notify(`✅ Approved! 🪙 +${q.pts} coins awarded to ${c.name}`);
        }
      } else {
        notify('❌ Quest rejected. Child can resubmit.');
      }
      save(); closeM('reviewModal'); renderReview(); refreshBadges();
    }

    function notify(msg: string) {
      const el = $('notif');
      if (!el) return;
      el.textContent = msg; el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 3200);
    }

    // ══ EVENT BINDINGS ══
    document.querySelectorAll('[data-action]').forEach((el: any) => {
      el.addEventListener('click', () => {
        const [action, param] = el.dataset.action.split('-');
        if (action === 'goToPassword') goToPassword(param);
      });
    });

    $('parentLogout')?.addEventListener('click', logout);
    $('childLogout')?.addEventListener('click', logout);
    $('createQuestBtn')?.addEventListener('click', createQuest);
    $('addChildBtn')?.addEventListener('click', addChild);
    $('addStoreItemBtn')?.addEventListener('click', addStoreItem);
    $('changeParentPassBtn')?.addEventListener('click', changeParentPass);
    $('cancelSubmitBtn')?.addEventListener('click', () => closeM('submitModal'));
    $('submitBtn')?.addEventListener('click', submitQuest);
    $('rejectBtn')?.addEventListener('click', () => decideQuest('rejected'));
    $('approveBtn')?.addEventListener('click', () => decideQuest('approved'));
    $('cancelBuyBtn')?.addEventListener('click', () => closeM('buyModal'));
    $('buyConfirmBtn')?.addEventListener('click', confirmBuy);
    $('cancelFulfillBtn')?.addEventListener('click', () => closeM('fulfillModal'));
    $('confirmFulfillBtn')?.addEventListener('click', confirmFulfill);
    $('photoInput')?.addEventListener('change', previewPhoto);
    $('uploadArea')?.addEventListener('click', () => ($('photoInput') as HTMLInputElement)?.click());

    // Tab bindings
    document.querySelectorAll('[data-tab]').forEach((el: any) => {
      el.addEventListener('click', () => {
        const tab = el.dataset.tab;
        const [role, name] = tab.split('-');
        showTab(role, name);
      });
    });

    // ══ INIT ══
    load();
  }, []);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: REWARD_FLOW_HTML }}
    />
  );
};

export default Index;
