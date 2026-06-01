'use strict';
/* TDI Workspace — Journal article data layer.
   Shared between journal.html, journal-article.html and admin.html.
   Reads any admin-edited articles from localStorage (key tdi_admin_v2 → articles),
   falls back to SEED. */
(function(){

const ADMIN_KEY = 'tdi_admin_v3';

const SEED_ARTICLES = [
  // ----------------------------------------------------------------
  // 00 — Material Library (linked-out, lives at materials.html)
  // ----------------------------------------------------------------
  {
    id: 'a0',
    slug: 'material-library',
    title: 'The TDI <em class="italic">material library.</em>',
    plainTitle: 'The TDI material library',
    category: 'Materials',
    date: '2026-05-15',
    dateLabel: 'Living document',
    readTime: 'Browse · ~60 materials',
    author: 'TDI Workspace Studio',
    authorRole: 'Studio Library',
    cover: 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=1200&q=80',
    excerpt: "The studio's curated catalogue of timber, stone, metal, acoustic and soft finishes — every material we'll specify, with sample swatches, suppliers and notes from twenty years of using them.",
    lede: '',
    customUrl: 'materials.html',
    featured: false,
    status: 'published',
    body: ''
  },

  // ----------------------------------------------------------------
  // 01 — FEATURED · Workplace Strategy (existing hand-built page)
  // ----------------------------------------------------------------
  {
    id: 'a1',
    slug: 'hybrid-offices-fail',
    title: 'Why every hybrid office <em class="italic">eventually fails</em> — and the four moves that fix it.',
    plainTitle: 'Why every hybrid office eventually fails',
    category: 'Workplace Strategy',
    date: '2026-05-09',
    dateLabel: '9 May 2026',
    readTime: '14 min read',
    author: 'Lin Jiahao',
    authorRole: 'Design Director, TDI Workspace',
    coAuthor: 'Aiko Tanaka',
    coAuthorRole: 'Workplace Strategy',
    cover: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1200&q=80',
    excerpt: "Three years into the great hybrid experiment, most Singapore offices look the same as they did in 2019 — just less full. Here's the post‑occupancy data from twelve TDI hybrid fit‑outs, and why the firms that designed for ambiguity outperform the ones that designed for headcount.",
    lede: "Three years into the great hybrid experiment, most Singapore offices look the same as they did in 2019 — just less full. Post‑occupancy data from twelve TDI hybrid fit‑outs, and why the firms that designed for ambiguity outperform the ones that designed for headcount.",
    customUrl: 'journal-hybrid-fails.html',
    featured: true,
    status: 'published',
    body: ''
  },

  // ----------------------------------------------------------------
  // 02 — Workplace Strategy · DEEP (new)
  // ----------------------------------------------------------------
  {
    id: 'a2',
    slug: 'neighborhood-model-singapore',
    title: 'The neighborhood model: <em class="italic">why Singapore offices stopped having rows of desks.</em>',
    plainTitle: 'The neighborhood model',
    category: 'Workplace Strategy',
    date: '2026-05-02',
    dateLabel: '2 May 2026',
    readTime: '16 min read',
    author: 'Aiko Tanaka',
    authorRole: 'Workplace Strategy, TDI Workspace',
    coAuthor: 'Lin Jiahao',
    coAuthorRole: 'Design Director',
    cover: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Activity‑based working has been around for a decade. What changed in 2026 is the neighborhood — a smaller, more legible idea that finally works in dense CBD floor plates. Eighteen months of data from five Singapore fit‑outs.',
    lede: 'Activity‑based working has been around for a decade. What changed in 2026 is the neighborhood — a smaller, more legible idea that finally works in dense CBD floor plates. Here is eighteen months of data from five Singapore fit‑outs, and the patterns we have stopped designing around.',
    featured: false,
    status: 'published',
    body: `
<p>If you stand in the lift lobby of any Grade‑A tower in Raffles Place at 9:40am on a Tuesday and count the people walking past, then do the same thing on a Thursday, the difference will be larger than the difference between any two Mondays in 2018. Singapore's CBD is no longer one building. It is a graph of attendance patterns that vary by floor, by team, by week of the quarter. The desk count on the lease has decoupled from the human count on the floor.</p>

<p>Most of our clients felt this first as a confusing series of paradoxes. Their utilisation studies showed average daily occupancy in the 40–55% range — consistent with what space‑planning consultancies have been reporting across Singapore for two years now. Yet meeting rooms were booked solid, sometimes weeks in advance. Yet the canteen seated four people at lunch. Yet HR kept getting complaints that "the office is dead." The same office, on the same day, was simultaneously over‑booked and under‑populated. That paradox is what makes hybrid offices hard to plan.</p>

<p>The neighborhood model is one of the very few design responses that holds up under that paradox. It is also the design move our clients ask us about most often, and the one we get wrong most often when we move too quickly. This piece is an attempt to explain what we have learned about it across the last eighteen months and five Singapore fit‑outs — what works, what does not, and what we now refuse to do.</p>

<h3>What a neighborhood actually is</h3>

<p>A neighborhood, in workplace‑strategy terms, is a contiguous zone of the floor that belongs to a single team or community of practice — usually somewhere between 12 and 35 people — and contains, in microcosm, all the work settings that team needs in a day. A focus row. A pair of phone booths. A team table. A small meeting room. A soft seat or two. A planted threshold that says, quietly, <em>this part of the floor is ours.</em></p>

<p>The point of a neighborhood is not to assign desks. Most neighborhoods are still hot‑desked. The point is to <em>concentrate</em> the variety of settings a team needs, so that no one walks more than twenty‑five metres in the course of a normal working day. We came to this conclusion the boring way: by tagging the routes our clients' staff actually walked and asking why they kept giving up on certain zones.</p>

<div class="article-figure">
  <h5>Average daily occupancy by floor design model — 5 Singapore offices, 18-month sample</h5>
  <div class="data-chart">
    <div class="data-row"><div class="lbl">Open ABW, no neighborhoods</div><div class="bar"><span style="--w: 38%;"></span></div><div class="num">38%</div></div>
    <div class="data-row"><div class="lbl">ABW + zoned departments</div><div class="bar"><span style="--w: 46%;"></span></div><div class="num">46%</div></div>
    <div class="data-row"><div class="lbl">Fixed-desk hybrid (cut 25%)</div><div class="bar"><span style="--w: 49%;"></span></div><div class="num">49%</div></div>
    <div class="data-row"><div class="lbl">Neighborhoods, 18–24 seats</div><div class="bar"><span style="--w: 67%;"></span></div><div class="num">67%</div></div>
    <div class="data-row"><div class="lbl">Neighborhoods, 25–35 seats</div><div class="bar"><span style="--w: 72%;"></span></div><div class="num">72%</div></div>
  </div>
  <div class="data-axis"><span>0% occupancy</span><span>50%</span><span>100%</span></div>
  <p style="margin-top: 16px; color: var(--muted); font-size: 12.5px;">Daily occupancy = unique badge‑ins as % of seat count, averaged Tue–Thu. Sample: five TDI hybrid fit‑outs, 2024–25, all in the Singapore CBD.</p>
</div>

<p>Two things jump out of this chart. The first is that the open activity‑based floors — the ones the workplace consultancies were recommending in 2021 and 2022 — are the worst performers in our sample. They were designed for the maximum amount of freedom and they produced, instead, the most amount of avoidance. Staff arrive on a Tuesday morning, see no obvious place to be, and end up working from whatever desk happens to be near a colleague they recognise. By 11am the floor has the appearance of a public library: thinly inhabited, full of people quietly minding their own business.</p>

<p>The second thing is that the jump in performance between zoned departments (46%) and small neighborhoods (67%) is enormous — twenty‑one percentage points — and that jump is not explained by any change in headcount, lease size or food. The only thing that changed was that someone drew a soft boundary on the floorplate and the team treated the space inside that boundary as theirs.</p>

<div class="pullquote">
  Singapore offices do not need more freedom. They need <em>more legibility.</em>
</div>

<h3>Why this matters more in Singapore than elsewhere</h3>

<p>Premium Grade‑A office space in Raffles Place and Marina Bay is now in the SGD 11–16 per square foot per month range, and rising. A 12,000 sqft tenancy at the high end of that spread is roughly SGD 2.3m a year in rent alone. If average daily occupancy is 40%, the marginal cost per occupied seat is brutally high — you are paying for square footage that nobody is using, in a market where every square foot is expensive. Pushing daily occupancy from 40% to 65% does not reduce your rent, but it doubles the productive yield of every dollar you are already paying.</p>

<p>It also changes the calculus of whether to renew or downsize at the next lease event. Two of our clients in this sample renewed for the same floor size after restructuring around neighborhoods — they had been planning to cut floorplate by 30%. The neighborhood layout absorbed their forecast growth without needing additional space. Same lease, more humans, lower cost per FTE. That is the line that gets the CFO's attention.</p>

<h3>Three things the neighborhood model is not</h3>

<p><strong>It is not hot‑desking with extra steps.</strong> Hot‑desking concentrates the entire floor's anxiety on one decision (<em>where do I sit today?</em>) at one moment (9:15am). Neighborhoods narrow that decision by an order of magnitude. You sit somewhere in your zone, near your team, in whichever specific setting suits the day. You did not have to scan the whole floor; you scanned 20 metres.</p>

<p><strong>It is not departmental zoning rebranded.</strong> Departmental zoning fails the moment two departments need to merge for a project, or one team triples in size while another halves. Neighborhoods are deliberately under‑specified — they are sized for the team, not the org chart. We re‑draw them every quarter using occupancy data, not in response to reorgs.</p>

<p><strong>It is not free.</strong> The cost of going neighborhood‑first is the cost of designing more, smaller, varied settings instead of long uniform desk runs. A neighborhood of 24 typically needs one phone booth, one four‑seat huddle, a six‑seat team table, a soft pair, and 14–16 focus seats. That is roughly 35–45% more pieces of furniture than the equivalent desk count in a conventional layout. Most of the difference is absorbed by the reduction in seats overall — but only just.</p>

<h3>How to size a neighborhood</h3>

<p>The smallest workable neighborhood in our sample is 14 people. Below that, the variety of settings stops feeling worth the space; you might as well give the team five fixed desks and a meeting room. The largest one we tried — 38 people — fell apart inside six months. People started referring to "our end" and "their end" of the same neighborhood, and the social cohesion that made the model work evaporated.</p>

<p>The sweet spot, repeatedly, is 22–28 people. That is roughly Dunbar's number for a working community — the size at which everyone knows everyone else's name and approximate role without needing a sign on the wall. It is also the size at which a single team lead can keep an eye on the space without becoming a facilities manager.</p>

<div class="article-figure">
  <h5>Anatomy of a 24-person neighborhood — typical TDI floor in 2025</h5>
  <div class="data-chart">
    <div class="data-row"><div class="lbl">Focus desks (15 hot‑desks)</div><div class="bar"><span style="--w: 56%;"></span></div><div class="num">56%</div></div>
    <div class="data-row"><div class="lbl">Team table (6–8 seats)</div><div class="bar"><span style="--w: 18%;"></span></div><div class="num">18%</div></div>
    <div class="data-row"><div class="lbl">Soft seating (4 seats)</div><div class="bar"><span style="--w: 12%;"></span></div><div class="num">12%</div></div>
    <div class="data-row"><div class="lbl">Huddle room (4-seat)</div><div class="bar"><span style="--w: 8%;"></span></div><div class="num">8%</div></div>
    <div class="data-row"><div class="lbl">Phone booths (2 single)</div><div class="bar"><span style="--w: 6%;"></span></div><div class="num">6%</div></div>
  </div>
  <div class="data-axis"><span>0% of zone area</span><span>50%</span><span>100%</span></div>
  <p style="margin-top: 16px; color: var(--muted); font-size: 12.5px;">Net usable floor area within the neighborhood boundary. Circulation excluded. A neighborhood occupies roughly 1,300–1,600 sqft of NLA for a 24‑seat team.</p>
</div>

<h3>What kills a neighborhood</h3>

<p>The single biggest predictor of failure, across the sample, is what we have started calling <em>boundary leakage</em>. A neighborhood needs a legible edge. Without one — without a planter, a screen, a change of floor finish, a soffit, a colour shift — the team does not feel that it owns the space. People drift in from other zones. The hot‑desks fill up with strangers. The team stops booking the huddle room because it is full of someone else's stand‑up. Within two months the neighborhood has collapsed into the average open ABW pattern, and the data follows.</p>

<p>The fix is almost always physical, not procedural. Acoustic ceilings hung low above the team table. A line of planters at hip height defining the entry. A four‑metre run of low joinery that holds the team's printer and a coffee point. The boundary does not have to be tall. It has to be obvious.</p>

<p>The second predictor of failure is over‑specification of the meeting rooms. The temptation is to give each neighborhood three or four bookable rooms of various sizes. In practice, the team uses one of them constantly and the others sit empty. We now plan one bookable room per neighborhood, one shared "open" huddle, and a small surplus of bookable rooms in the centre of the floor that everyone competes for. The shared scarcity makes the bookable rooms more, not less, useful.</p>

<h3>The four design moves we keep recommending</h3>

<p><strong>1. Draw the neighborhoods before the desks.</strong> Get the team sizes and adjacencies right on a marker‑pen plan before you put a single workstation down. Most floors we now design are essentially five to seven small worlds connected by a shared spine.</p>

<p><strong>2. Put the shared amenity on the spine, not in the neighborhoods.</strong> The cafe, the library, the printer wall, the soft seating for cross‑team collisions — these belong in the connective tissue, not duplicated inside every team's zone. Neighborhoods host the work. The spine hosts the encounters.</p>

<p><strong>3. Build the boundary out of the building, not out of furniture.</strong> Soft boundaries get ignored. Acoustic baffles, planted thresholds, ceiling soffits and floor‑finish changes get respected. Spend the boundary budget on architecture, not signage.</p>

<p><strong>4. Re‑size every quarter.</strong> Neighborhoods are not permanent. Teams grow, projects move, headcount shifts. We now build in the literal ability to re‑draw a neighborhood in a weekend — using modular partitions and demountable joinery — because the alternative is that the layout decays inside a year.</p>

<h3>Coda</h3>

<p>The pre‑pandemic Singapore office was, on balance, a more legible building than the one we have now. You walked in, you saw your desk, you sat at it. The advantage was clarity; the cost was rigidity. Today's offices have inherited the rigidity in the form of long lease commitments, and lost the clarity in the rush to flexibility.</p>

<p>Neighborhoods are an attempt to put the clarity back without giving up the flex. They are not a complete answer. They will be replaced, in five or ten years, by something we cannot quite see yet. But for the next lease cycle, in a market this expensive, they are the design move with the best evidence behind them. Every floorplate we draw now starts with the neighborhoods.</p>

<p style="margin-top: 56px; font-size: 13px; color: var(--muted);">— Aiko Tanaka &amp; Lin Jiahao, May 2026. Singapore.</p>
`
  },

  // ----------------------------------------------------------------
  // 03 — Workplace Strategy · DEEP (new)
  // ----------------------------------------------------------------
  {
    id: 'a3',
    slug: 'designing-for-40-percent',
    title: 'Designing for 40% occupancy: <em class="italic">the Singapore CBD math.</em>',
    plainTitle: 'Designing for 40% occupancy',
    category: 'Workplace Strategy',
    date: '2026-04-11',
    dateLabel: '11 Apr 2026',
    readTime: '12 min read',
    author: 'James Koh',
    authorRole: 'Director of Delivery, TDI Workspace',
    cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Pack a Singapore tenancy beyond 60% workstation density and you start losing things that are very hard to design back in. Daylight, acoustics, dignity.',
    lede: 'Pack a Singapore tenancy beyond 60% workstation density and you start losing things that are very hard to design back in. Daylight, acoustics, dignity. Here is the rent math we walk every new client through, line by line.',
    featured: false,
    status: 'published',
    body: `
<p>The first question almost every commercial tenant asks us, on the first call, is some variant of <em>how many desks can we fit?</em> It is the wrong question. Or rather, it is the right question pointed at the wrong number. The number that actually matters is how many people can comfortably <em>use</em> the floor on any given day, including the days when more of them than expected show up.</p>

<p>If your team has 80 staff on a hybrid arrangement averaging 3 days a week, your peak headcount is rarely 80. It is somewhere between 50 and 65 — and the worst Tuesdays will graze 70. So the design problem is not <em>seat 80,</em> it is <em>seat 60 well, with grace for the 70‑person days.</em> If you instead try to seat 80, three things happen, and none of them are good.</p>

<h3>What you lose when you crowd the floor</h3>

<p><strong>You lose the daylight.</strong> Singapore's high‑rise office stock has narrow floor plates by global standards — typically 11–15 metres core‑to‑glass. Pack workstations to the glass on both sides and the centre of the floor becomes a dark spine. Pack one side with desks and put the soft amenity in the centre, and the daylight reaches further into the room. Most of our hybrid offices put nothing along the glass except a soft seat or a planter. The window is a public good. It belongs to the floor, not to whichever team got there first.</p>

<p><strong>You lose the acoustics.</strong> The acoustic comfort of an open office collapses non‑linearly above a density threshold. Below about 6 sqm per workstation (NLA), and our post‑occupancy surveys hold steady on noise complaints. Above it, complaint frequency roughly triples for every additional square metre of density. The number to design to, in Singapore, is 6.5–8 sqm NLA per workstation. Tighter than that and you are paying every month, in support tickets, for the seat you saved on day one.</p>

<p><strong>You lose the dignity.</strong> This is the one nobody puts in the brief. The thing that makes an office feel like an adult workplace, rather than a call centre, is the amount of slack in the layout. Slack is the unused chair, the unbooked huddle, the unloved corner that becomes — over six months — someone's quiet refuge. Slack is the part of the floor that is not productive in any measurable sense, and is therefore the first thing to be cut in a tight brief. We have learned to fight for it. You can always add desks back. You cannot retro‑fit slack.</p>

<div class="pullquote">
  Density looks free on the floorplate. It is paid for, every month, in <em>support tickets.</em>
</div>

<h3>The rent math, walked line by line</h3>

<p>Consider a typical APAC‑HQ scenario — a financial services firm taking 12,000 sqft of Grade A space in Raffles Place at SGD 13.50 psf/month. Annual rent: ~SGD 1,944,000. Fit‑out budget: SGD 1.5M, amortised across a 6‑year lease. Total occupancy cost: ~SGD 2.2M per annum, or SGD 183,000 per month.</p>

<div class="article-figure">
  <h5>Cost per occupied seat — three density scenarios, same 12,000 sqft tenancy</h5>
  <div class="data-chart">
    <div class="data-row"><div class="lbl">90 desks · ~38% avg. occ.</div><div class="bar"><span style="--w: 92%;"></span></div><div class="num">$65k</div></div>
    <div class="data-row"><div class="lbl">75 desks · ~52% avg. occ.</div><div class="bar"><span style="--w: 62%;"></span></div><div class="num">$45k</div></div>
    <div class="data-row"><div class="lbl">60 desks · ~68% avg. occ.</div><div class="bar"><span style="--w: 42%;"></span></div><div class="num">$31k</div></div>
    <div class="data-row"><div class="lbl">52 desks · ~74% avg. occ.</div><div class="bar"><span style="--w: 36%;"></span></div><div class="num">$26k</div></div>
  </div>
  <div class="data-axis"><span>$0 / occupied seat / yr</span><span></span><span>$70k</span></div>
  <p style="margin-top: 16px; color: var(--muted); font-size: 12.5px;">Cost per <em>occupied</em> seat per year = total occupancy cost ÷ (desks × average daily occupancy). Lower is better. The cheapest seats are the ones that get sat in.</p>
</div>

<p>This is the chart that gets the CFO's attention. The 90‑desk option looks superficially efficient — most desks per dollar of rent — but produces the most expensive <em>occupied</em> seat, because two‑thirds of the desks are empty on any given day. The 52‑desk option is what most of our hybrid clients land on after a workshop. Fewer desks, more amenity, higher utilisation, lower cost per productive seat.</p>

<p>The 52‑desk floor is also, not coincidentally, the version that fits a 30%+ third‑space share, sub‑6.5 sqm/workstation density and a daylight‑on‑amenity plan. The numbers do not just allow the design move. They demand it.</p>

<h3>The 60% rule, in one line</h3>

<p>Across the twenty‑plus Singapore hybrid offices we have measured, the relationship between workstation density and overall satisfaction has the same shape every time. It is a slow, broad ridge from 30% to 60% density (of pre‑pandemic equivalent), and then a cliff. Cross 60% and complaints accelerate, third‑space disappears, daylight contracts, occupancy falls. Stay under it, and the floor has room to breathe.</p>

<p>So our rule, for the last eighteen months, is simple: never specify a workstation density above 60% of what the floor could theoretically hold. Use the remaining 40% on soft amenity, focus rooms, daylight buffers, and slack. That sounds wasteful until you run the cost‑per‑occupied‑seat math. It is, in fact, the cheaper plan.</p>

<h3>Coda</h3>

<p>Singapore CBD rent is expensive enough that every design decision is, at some level, a financial one. What hybrid working has changed is the basis of comparison. The question is no longer <em>how many desks does your dollar buy?</em> The question is <em>how many productive seat‑hours does your dollar buy?</em> The two answers are very different. And once a client sees the difference, the design brief writes itself.</p>

<p style="margin-top: 56px; font-size: 13px; color: var(--muted);">— James Koh, April 2026. Singapore.</p>
`
  },

  // ----------------------------------------------------------------
  // 04 — Materials
  // ----------------------------------------------------------------
  {
    id: 'a4',
    slug: 'honest-acoustics',
    title: 'The case for honest acoustics: <em class="italic">why we stopped specifying ceiling tiles.</em>',
    plainTitle: 'The case for honest acoustics',
    category: 'Materials',
    date: '2026-05-02',
    dateLabel: '2 May 2026',
    readTime: '8 min read',
    author: 'Rachel Lim',
    authorRole: 'Senior Interior Designer, TDI Workspace',
    cover: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    excerpt: "Acoustic plaster costs 4× more per sqm. It's also the only fix that survives a renovation without being torn out. We did the math.",
    lede: "Acoustic plaster costs 4× more per sqm than a suspended ceiling tile system. It is also the only acoustic treatment in a Singapore commercial fit-out that survives the next renovation without being torn out. We did the math on three projects.",
    featured: false,
    status: 'published',
    body: `
<p>There is a reason almost every Singapore office above the 1990s has the same ceiling: a 600 × 600 mineral‑fibre tile dropped into a metal grid, with cut‑outs for downlights and sprinklers. It is cheap, it is easy, it has a known acoustic performance, and every M&amp;E contractor in the country can install it in their sleep. The trouble is that it is also one of the least durable acoustic treatments available to a commercial interior — not in the sense of falling apart, but in the sense of being ripped out and replaced every six to eight years.</p>

<p>If you measure acoustic treatment over the life of a building rather than the life of a tenancy, the numbers reverse. The cheapest material on day one becomes the most expensive material by year fifteen, because you have paid for it three times. The most expensive material on day one — acoustic plaster, applied directly to the soffit — gets reused by every subsequent tenant and pays back its premium roughly twice over.</p>

<h3>The numbers, three projects deep</h3>

<p>We took three of our completed projects from the last decade — a 9,200 sqft creative office, a 14,000 sqft consulting firm, and a 4,800 sqft showroom — and reconstructed what each of them spent on ceilings across the building's life, including the tenant before us, ourselves, and the tenant that came after.</p>

<div class="article-figure">
  <h5>Lifetime ceiling cost — three Singapore offices, ~20 years each</h5>
  <div class="data-chart">
    <div class="data-row"><div class="lbl">Mineral-fibre tile · grid</div><div class="bar"><span style="--w: 85%;"></span></div><div class="num">$340k</div></div>
    <div class="data-row"><div class="lbl">Acoustic baffles, hung</div><div class="bar"><span style="--w: 58%;"></span></div><div class="num">$232k</div></div>
    <div class="data-row"><div class="lbl">Acoustic plaster · direct</div><div class="bar"><span style="--w: 42%;"></span></div><div class="num">$168k</div></div>
  </div>
  <div class="data-axis"><span>$0 lifetime cost</span><span></span><span>$400k</span></div>
  <p style="margin-top: 16px; color: var(--muted); font-size: 12.5px;">Includes install, removal, M&amp;E re‑routing on tenancy turnover. Sample: 9,200 sqft office, 20-year window, three tenants. The plaster soffit was reused by all three.</p>
</div>

<h3>Why ceiling tiles fail the longevity test</h3>

<p>The mineral‑fibre tile is an honest material in only one direction. It absorbs sound. It does not, however, survive a tenant change. The next firm always wants different downlight positions, different sprinkler coverage, different supply‑air diffusers — and the tile/grid combination is the path of least resistance for that re‑work. So out it comes, and a new grid goes in. Every six to eight years. For seventy years.</p>

<p>An acoustic plaster ceiling — three coats of mineral‑based plaster applied directly to the structural soffit, with services exposed below — has the opposite property. The next tenant moves their lights and ducts around without touching the ceiling. The plaster stays. The performance is broadly equivalent (NRC 0.7–0.85 for both, in our measurements). The longevity is completely different.</p>

<div class="pullquote">
  The cheapest material on day one is rarely the cheapest material on <em>day three thousand.</em>
</div>

<h3>What stops people specifying it</h3>

<p>Three things, mostly. Plaster takes longer to install — typically 3–5 days more on the programme. It is harder to patch if a sprinkler head leaks. And on a fit‑out without a generous M&amp;E contingency, the apparent line‑item cost on the BQ looks too high to defend at handover. So the value‑engineering knife comes for the plaster first, and the tile and grid go back in.</p>

<p>Our argument to clients now is simple: if you are signing a lease longer than six years, you will renovate inside that lease term. The plaster pays for itself if it is still there when you do. If you are signing a shorter lease and intend to walk away, fine, take the tile. But name the trade‑off in writing.</p>

<h3>Coda</h3>

<p>The honest version of this argument is that acoustic plaster is a material with a long memory. It outlives the tenant that paid for it. It outlives the consultant that drew it. It almost certainly outlives the building's first three internet providers. In an industry that has built itself around the disposability of the fit‑out, that is not the easiest sell. But it is the better building. And the better building is, in our experience, the cheaper one.</p>

<p style="margin-top: 56px; font-size: 13px; color: var(--muted);">— Rachel Lim, May 2026. Singapore.</p>
`
  },

  // ----------------------------------------------------------------
  // 05 — Materials
  // ----------------------------------------------------------------
  {
    id: 'a5',
    slug: 'repair-not-replacement',
    title: 'Specifying for repair, <em class="italic">not replacement.</em>',
    plainTitle: 'Specifying for repair, not replacement',
    category: 'Materials',
    date: '2026-03-22',
    dateLabel: '22 Mar 2026',
    readTime: '7 min read',
    author: 'Daniel Ong',
    authorRole: 'Workshop Lead, TDI Workspace',
    cover: 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=1200&q=80',
    excerpt: "If a chair can't be reupholstered, we won't put it in a TDI project. Here's our five‑year repairability test, and the suppliers who pass it.",
    lede: "If a chair cannot be reupholstered, we will not put it in a TDI project. Our five-year repairability test, and the dozen Singapore suppliers who have passed it.",
    featured: false,
    status: 'published',
    body: `
<p>Every commercial chair we have ever specified breaks. Not the chair itself, usually — the fabric. A swivel seat in a meeting room takes about 18 months to show wear on the front edge, and about three years to look genuinely worn out. At that point you have two options. Either replace the chair, which costs roughly what the chair cost new and produces a piece of landfill, or reupholster it, which costs about a fifth of replacement and looks better than new.</p>

<p>For about a decade now we have refused to specify any seating that cannot be reupholstered in Singapore by a tradesperson the client can phone directly. It is a small rule that has cascading consequences. It excludes about 80% of the soft-seating market by volume. The remaining 20% — almost all from European or Japanese makers, plus a handful of Singapore workshops — produces furniture that lasts a generation.</p>

<h3>The five-year test</h3>

<p>When a supplier sends us a chair for evaluation, we put it through five questions, in this order:</p>

<p><strong>1. Can the seat fabric be removed without cutting?</strong> Most modern office chairs glue the upholstery to a moulded foam shell. Replacing the fabric means replacing the entire seat. If the chair has a removable cover or screw-fixed seat pan, it passes.</p>

<p><strong>2. Is the foam a known density specification?</strong> Foam degrades. We need to know what to replace it with in five years. "Custom proprietary foam" almost always means "unavailable in five years."</p>

<p><strong>3. Are the gas struts and mechanisms commodity parts?</strong> Office chair mechanisms outlast their upholstery by a factor of three or four. But only if the parts are standard sizes that any local supplier can swap.</p>

<p><strong>4. Will the manufacturer sell spare parts to a third party?</strong> Many will not. The ones who will are the ones we work with.</p>

<p><strong>5. What does the chair look like at year seven?</strong> If they cannot show us one, we are sceptical.</p>

<div class="pullquote">
  Furniture is not a product. It is a <em>twenty-year relationship.</em>
</div>

<h3>What this rules out</h3>

<p>Most fast-fashion office furniture from large online retailers. Most of the imported budget seating that turns up in serviced offices. A surprising number of "designer" pieces from continental Europe whose service network does not extend to Singapore. Almost every executive chair in the SGD 400–800 retail bracket.</p>

<h3>What it rules in</h3>

<p>A handful of European task chair makers (Vitra, Wilkhahn, HÅG), a few Japanese houses (Okamura, Itoki), and four Singapore workshops we have built long-term relationships with — including our own. The Singapore workshops are particularly useful for bespoke loose furniture: banquette seating, custom benches, joinery-integrated upholstery. We design these with removable cushion blocks and a labelled spec sheet stuck inside the carcass, so the next person to repair the piece — who may not be us — knows exactly what to order.</p>

<h3>Coda</h3>

<p>The carbon impact of a piece of office furniture is, by a long way, dominated by its manufacture, not its use. A chair you keep for fifteen years instead of five is, environmentally, the equivalent of three chairs you did not buy. That is a far larger lever than choosing a slightly more sustainable fabric. The most sustainable specification is the one you do not have to repeat.</p>

<p style="margin-top: 56px; font-size: 13px; color: var(--muted);">— Daniel Ong, March 2026. Singapore.</p>
`
  },

  // ----------------------------------------------------------------
  // 06 — Post-Occupancy
  // ----------------------------------------------------------------
  {
    id: 'a6',
    slug: '90-days-in-a-new-office',
    title: 'What 90 days in a new office <em class="italic">actually changes.</em>',
    plainTitle: 'What 90 days in a new office actually changes',
    category: 'Post-Occupancy',
    date: '2026-04-24',
    dateLabel: '24 Apr 2026',
    readTime: '10 min read',
    author: 'Aiko Tanaka',
    authorRole: 'Workplace Strategy, TDI Workspace',
    cover: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=80',
    excerpt: "We tracked four 2025 TDI offices at the 30, 60 and 90‑day marks. The shifts in how people use the space are not what you'd expect.",
    lede: "We tracked four 2025 TDI offices at the 30, 60 and 90-day marks. The shifts in how people use the space are not what you would expect, and the things that need to change rarely look like the things people complain about.",
    featured: false,
    status: 'published',
    body: `
<p>Every office we hand over looks finished on the day of handover. Within ninety days, almost every office we hand over looks slightly different. The boardroom that was supposed to be the boardroom turns out to be where people eat lunch. The "library" never quite becomes a library. Someone moves a planter, and the planter stays where they put it. The space starts to settle.</p>

<p>We have been documenting this drift since 2023. Four projects in 2025, surveyed and walked at 30, 60 and 90 days. The patterns are remarkably consistent — and the things that need to change rarely look like the things people complain about.</p>

<h3>Day 30: the honeymoon</h3>

<p>The first month is uniformly positive. Everything is new. People take pictures. The reception desk gets posted to LinkedIn. The internal NPS score is at its highest, by a wide margin, in the entire life of the fit‑out. This is meaningless data. We have learned to ignore it.</p>

<p>What is useful at day 30 is the very first round of <em>furniture migration</em>. Someone always moves a chair. Someone always plugs a monitor in somewhere we did not put one. Tracking those small moves tells us where the floor's actual gravity is, versus where we predicted it would be. We come back with the badge data at day 60 to confirm.</p>

<h3>Day 60: the reality</h3>

<p>By two months in, the NPS has dropped — typically by 15 to 25 points — and the complaints start. They are almost always the same complaints, across every project. They are also almost always the wrong complaints.</p>

<div class="article-figure">
  <h5>Top complaints at day 60 vs. actual problems at day 90 — 4 offices, n=412 surveys</h5>
  <div class="data-chart">
    <div class="data-row"><div class="lbl">"Not enough meeting rooms"</div><div class="bar"><span style="--w: 78%;"></span></div><div class="num">78%</div></div>
    <div class="data-row"><div class="lbl">"Too cold"</div><div class="bar"><span style="--w: 64%;"></span></div><div class="num">64%</div></div>
    <div class="data-row"><div class="lbl">"Too noisy"</div><div class="bar"><span style="--w: 52%;"></span></div><div class="num">52%</div></div>
    <div class="data-row"><div class="lbl">"Wi-Fi unreliable"</div><div class="bar"><span style="--w: 38%;"></span></div><div class="num">38%</div></div>
  </div>
  <div class="data-axis"><span>0% of staff surveyed</span><span></span><span>100%</span></div>
  <p style="margin-top: 16px; color: var(--muted); font-size: 12.5px;">Top reported issues at day 60 across four 2025 TDI offices.</p>
</div>

<p>The meeting room complaint is almost always actually a <em>booking culture</em> complaint. Rooms get blocked by default invites, recurring meetings that no longer happen, and people who book a 6‑seat room for a 2‑person call. We have stopped responding to "not enough meeting rooms" with more meeting rooms. We respond to it by audit‑ing the booking system. The complaint usually disappears.</p>

<p>The "too cold" is almost always a thermal gradient — the people near the perimeter are five degrees warmer than the people near the AHU, and only the cold ones are filling in the form. A blanket and a small fan, distributed personally, fixes 80% of cases in our sample. The remaining 20% needs the M&amp;E contractor back on site.</p>

<p>The noise complaints are real and persistent and we take them seriously. They are also concentrated in specific zones — usually the focus seats nearest the cafe — and almost never as floor‑wide as the survey makes them sound.</p>

<h3>Day 90: the floor decides what it is</h3>

<p>The interesting moment is day 90. By this point the office has decided what it is, regardless of what the floorplan said. The "library" is either a library, or it has become an overflow meeting room, or it has become the place people eat their bento. The phone booths are either constantly occupied, or constantly empty.</p>

<p>The single most consistent finding, across all four projects, is that <em>at day 90 about 12% of the floor is being used for a purpose we did not design it for.</em> Always 12%, give or take a point. Some of those re‑purposings are improvements — the library becoming an unbookable third meeting space when there are not enough bookable ones. Some are regressions — the soft seat near the window becoming a permanent dumping ground for someone's monitor.</p>

<div class="pullquote">
  By day 90, about 12% of the floor is doing something <em>we did not design it to do.</em>
</div>

<p>Our job at day 90 is to walk the floor with the client, identify the re‑purposings, and decide which ones to formalise. The dumping ground becomes a storage unit. The accidental third meeting space gets a screen and a power point. The unused library quietly becomes the new lunch room. The floor is fine. The plan just needed an edit.</p>

<h3>What we have changed in our practice</h3>

<p>We now write the day‑90 walk into every contract, at no extra cost. It is the most informative ninety minutes of the project, by a long way, and the small adjustments made then have a wildly disproportionate effect on the floor's performance over the next five years. The cost to us is a half‑day of a senior designer's time. The value to the client is six years of a building that fits.</p>

<p>The bigger change is that we now design for re‑purposing. Floor boxes go everywhere, not just under desks. Soft furniture is on castors. The "library" is a library only because there are some books on the shelf — the shelf could just as easily become anything else. We have stopped trying to predict what the office will become. We have started trying to make it easy for the office to become whatever it becomes.</p>

<h3>Coda</h3>

<p>A finished office is a misleading object. It looks like a complete answer to a brief, but it is really a question to a culture: <em>what will you do with this?</em> The culture answers in slow motion, over a quarter, and the answer is usually different from the brief. The job of the designer is not to predict the answer. It is to leave enough room in the design for the answer to fit.</p>

<p style="margin-top: 56px; font-size: 13px; color: var(--muted);">— Aiko Tanaka, April 2026. Singapore.</p>
`
  },

  // ----------------------------------------------------------------
  // 07 — Practice
  // ----------------------------------------------------------------
  {
    id: 'a7',
    slug: 'live-renovations',
    title: 'Live renovations: <em class="italic">the only way it works.</em>',
    plainTitle: 'Live renovations: the only way it works',
    category: 'Practice',
    date: '2026-04-03',
    dateLabel: '3 Apr 2026',
    readTime: '9 min read',
    author: 'Marcus Yeo',
    authorRole: 'Senior Project Manager, TDI Workspace',
    cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    excerpt: "Six phases, six weekends, 220 staff who never lost a day. The choreography behind a fully‑occupied office refresh.",
    lede: "Six phases. Six weekends. Two hundred and twenty staff who never lost a working day. The choreography behind a fully occupied office refresh — and why we now plan every renovation this way.",
    featured: false,
    status: 'published',
    body: `
<p>Most commercial renovations move people out, change the space, and move them back in. It is the safe way to do it, and for some projects — anything involving wet trades, raised access floors, or major M&amp;E re‑routing — it is the only way to do it. For most of the renovations we do, though, it is the wrong way. Moving 220 people out of a working office costs more in lost productivity and morale than the renovation itself.</p>

<p>So we have spent the last seven years getting good at the opposite. Live renovations — where the office stays in use, and the work happens around the staff in six phases across six weekends. It is harder. It is more expensive on a per‑square‑foot basis. And it is, almost always, the cheaper option once you count what the alternative would have cost the client's actual business.</p>

<h3>The basic choreography</h3>

<p>We divide the floor into six zones — usually one zone per neighborhood, plus the central spine — and run each zone through a Friday‑night‑to‑Monday‑morning sprint. By 6pm Friday the zone is empty of staff and furniture. By midnight the demolition is done. By Saturday lunch the new joinery is in. By Sunday evening the M&amp;E and IT is commissioned. By 6am Monday the zone is back, fully furnished, with new finishes, ready to receive staff.</p>

<p>The staff in that zone work from the still‑complete part of the floor for the week. The following Friday, the next zone goes. Six weekends. No work day lost. Total programme: ten to twelve weeks, half of which is preparation and the other half is the six sprints.</p>

<h3>What has to be true for this to work</h3>

<p><strong>Demountable joinery.</strong> Everything we install during a live renovation is designed in our workshop and shipped to site pre‑assembled. We do not bench‑make on site during a live job. The longest individual joinery install is around four hours, with three people on it. That budget excludes nothing.</p>

<p><strong>One trade at a time.</strong> Our biggest mistake on early live jobs was overlapping trades. Carpenters and electricians cannot work in the same eight square metres at the same time. So we phase even within the weekend: demo Friday night, dry trades Saturday, wet/electrical Saturday evening, finishes Sunday, IT Sunday evening, furniture and FF&amp;E early Monday. It looks linear because it is.</p>

<p><strong>A change‑order budget the client agrees to in advance.</strong> Something always changes inside a live sprint. A sprinkler is in the wrong place. A floor box is dead. The client decides at 8pm Saturday that the colour is wrong. We hold a 7% change-order budget in escrow and the client signs off the trigger conditions before the first sprint. Without that, the weekend becomes a phone call.</p>

<p><strong>Two complete project teams.</strong> One on site, one resting. We rotate them weekend on, weekend off, for the duration. The site manager who runs sprint 1 reviews sprint 2 from a coffee shop. The site manager who runs sprint 2 reviewed sprint 1. Continuity, without burnout.</p>

<div class="pullquote">
  Live renovation is not a faster job. It is the <em>same job, paid for differently.</em>
</div>

<h3>What it costs</h3>

<p>A live renovation typically costs 15–25% more per square foot than the same job done with the floor empty. The premium is in the overtime, the off‑hours services bookings, the doubled project management, and the workshop pre‑fab. The premium is also entirely visible to the client on day one. They sign it knowingly or they choose the other plan.</p>

<p>The premium is recovered, several times over, by not moving 220 people into a temporary space — temporary leases, IT re‑provisioning, two months of half‑productivity, the morale cost of being homeless inside your own company. For most of our clients, the live option is the financially conservative one. It just looks more aggressive on the construction line.</p>

<h3>What we have stopped doing</h3>

<p>We used to try to do live renovations on weeknights. Twelve‑hour overnight slots, three or four per week. It never worked. Staff would arrive in the morning to find tools missing, paint half‑dry, a corridor blocked. The overnight model produces fragility. The Friday‑to‑Monday model produces a clean handover, weekly, with a full day of buffer before staff return. We do not run weeknights anymore.</p>

<h3>Coda</h3>

<p>The thing about a live renovation is that it forces the practice into being good at handover. Every weekend ends with a handover. Every weekend, the client walks the zone before staff return. There is no opportunity to defer a finish, defer a snag, defer anything. Whatever is wrong on Sunday at 10pm is the client's problem on Monday at 8am unless you fix it that night. It is a discipline you do not get from a single end‑of‑project handover, and we have come to prefer it.</p>

<p style="margin-top: 56px; font-size: 13px; color: var(--muted);">— Marcus Yeo, April 2026. Singapore.</p>
`
  },

  // ----------------------------------------------------------------
  // 08 — Practice
  // ----------------------------------------------------------------
  {
    id: 'a8',
    slug: 'conservation-shophouse-studio',
    title: 'The case for a <em class="italic">conservation shophouse studio.</em>',
    plainTitle: 'The case for a conservation shophouse studio',
    category: 'Practice',
    date: '2026-03-14',
    dateLabel: '14 Mar 2026',
    readTime: '11 min read',
    author: 'Lin Jiahao',
    authorRole: 'Design Director, TDI Workspace',
    cover: 'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?auto=format&fit=crop&w=2400&q=85',
    coverThumb: 'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?auto=format&fit=crop&w=1200&q=80',
    excerpt: "Inserting a modern workspace into a gazetted shophouse, without touching the heritage fabric. A self‑supporting steel mezzanine on four contact points.",
    lede: "Inserting a modern workspace into a gazetted shophouse, without touching the heritage fabric. The self-supporting steel mezzanine on four contact points, the joinery that does not touch the wall, and the URA conversation that goes with it.",
    featured: false,
    status: 'published',
    body: `
<p>Singapore has roughly 6,500 gazetted conservation shophouses, and a small but growing share of them now house design studios, small consultancies, and creative agencies. They are beautiful buildings. They are also profoundly inflexible, in the legal and physical sense — you cannot remove the timber floor, you cannot drill the party wall, you cannot move the staircase, and you cannot, in most cases, even change the colour of the front door without URA's permission.</p>

<p>Which is why most shophouse fit‑outs end up either too cautious (a couple of free‑standing desks on the existing floor, nothing else) or too aggressive (a renovation that quietly damages the timber upstairs joists and triggers a heritage complaint two years later). Neither approach is necessary. The middle path is a fit‑out that is structurally self‑sufficient — touching the building at as few points as possible, and removable in a weekend without leaving a mark.</p>

<h3>The four-contact-point mezzanine</h3>

<p>Our most successful shophouse insert so far is a 70 sqm mezzanine for a creative agency, sitting roughly two metres above the existing timber floor on the first storey. It is supported by four steel columns, each landing on a 600 × 600 spreader plate on top of the existing concrete subfloor. The original timber is left untouched. The mezzanine carries its own services. The whole assembly can be unbolted in two days.</p>

<p>The structural problem was not the load. Even a generous office load — 5 kPa, well above the 3 kPa office norm — is well within what the existing slab can take. The problem was that we could not transfer that load through the heritage timber floor above the ground storey. So everything had to bypass the timber. Four columns, four point loads, all landing on the original concrete. The timber floor is now jewellery, not structure.</p>

<div class="pullquote">
  In a conservation shophouse, the building is not the canvas. <em>It is the client.</em>
</div>

<h3>The joinery that does not touch the wall</h3>

<p>The other rule we follow in shophouse work is that the joinery — bookshelves, counters, kitchenette, storage — never bears on the original wall. We design every piece to be free‑standing or supported only off the new mezzanine structure. The walls of a conservation shophouse are lime‑plastered on brick, and they have specific opinions about being drilled. Most of those opinions involve large patches of plaster falling off six months later. We avoid the conversation entirely.</p>

<p>The cost premium of free‑standing joinery is modest — perhaps 10–15% more on the joinery package — and the upside is significant: the client can move out at the end of the lease, take the joinery with them, and leave the shophouse in exactly the condition they found it. URA likes this. Landlords like this. The next tenant likes this.</p>

<h3>The URA conversation</h3>

<p>Every conservation shophouse fit‑out triggers a URA submission, and the conversation is more interesting than most people expect. URA is not, in our experience, hostile to modern interventions inside heritage buildings. They are hostile to interventions that <em>look like</em> they are damaging the heritage fabric. The difference matters.</p>

<p>What gets approved quickly: clearly modern, clearly reversible, structurally separate inserts that read as furniture rather than architecture. What gets pushback: alterations that touch the timber, the party wall, the ceiling rosettes, the external five‑foot way, or the front shopfront fenestration. We now structure our drawings to make the reversibility legible — coloured plans showing what is original (untouched), what is new (the insert), and what is the interface (always demountable). The approvals come back faster.</p>

<h3>What this costs</h3>

<p>A shophouse fit‑out, done this way, lands at SGD 350–500 per sqft, which is roughly 30–50% above an equivalent Grade‑A office fit‑out. The premium is in the structure, the bespoke joinery, the slower programme, and the heritage consultancy fees. It is also, almost always, the only way to make the building work as a contemporary office without compromising the conservation status — and that conservation status is, in turn, the reason the building is worth occupying in the first place.</p>

<h3>Coda</h3>

<p>The reason to take a conservation shophouse studio is not nostalgia. It is the timber floor. The light from the airwell. The five‑foot way. The proportions of a 1930s ceiling. None of these things are available in a new build, and none of them will be made again. Designing into a shophouse is an exercise in restraint — you do less, and the building does more. The result is almost always better than the result of doing more in a building that has less to give.</p>

<p style="margin-top: 56px; font-size: 13px; color: var(--muted);">— Lin Jiahao, March 2026. Singapore.</p>
`
  }
];

// =============================================================
//   PUBLIC API
// =============================================================
function loadArticles() {
  // Prefer the Firestore-backed shared store (populated by tdi-store.js) so
  // the public journal reflects what the admin publishes from any device.
  try {
    if (window.TDIStore && window.TDIStore.isLoaded && window.TDIStore.isLoaded()) {
      const j = window.TDIStore.get('journal');
      if (j && Array.isArray(j.items) && j.items.length) return j.items;
    }
  } catch (e) {}
  // Fallback: same-browser admin localStorage, then the built-in seed.
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.articles) && data.articles.length) {
        return data.articles;
      }
    }
  } catch (e) {}
  return SEED_ARTICLES.slice();
}

function getBySlug(slug) {
  return loadArticles().find(a => a.slug === slug);
}

function getFeatured() {
  const all = loadArticles().filter(a => a.status !== 'draft');
  return all.find(a => a.featured) || all[0];
}

function getPublished() {
  return loadArticles().filter(a => a.status !== 'draft');
}

function articleHref(a) {
  if (!a) return '#';
  if (a.customUrl) return a.customUrl;
  return 'journal-article.html?slug=' + encodeURIComponent(a.slug);
}

window.TDIJournal = {
  SEED_ARTICLES,
  loadArticles,
  getBySlug,
  getFeatured,
  getPublished,
  articleHref,
  STORAGE_KEY: ADMIN_KEY
};

})();
