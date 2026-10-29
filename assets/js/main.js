(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- Language ---------- */
  var lang = ((navigator.language || '').slice(0, 2) === 'pt') ? 'pt' : 'en';
  try { lang = localStorage.getItem('lang') || lang; } catch (e) {}
  var T = function (en, pt) { return root.dataset.lang === 'pt' ? pt : en; };
  function setLang(l) {
    root.dataset.lang = l; root.lang = l;
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.set === l));
    });
    try { localStorage.setItem('lang', l); } catch (e) {}
    if (typeof score === 'function') score();
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.set); });
  });

  /* ---------- Hero: simulated transaction stream ---------- */
  var rowsEl = document.getElementById('rows');
  var assets = ['BTC', 'ETH', 'USDT', 'SOL', 'XRP', 'LTC'];
  var hex = '0123456789abcdef';
  function rnd(n) { return Math.floor(Math.random() * n); }
  function hash() { var s = '0x'; for (var i = 0; i < 4; i++) s += hex[rnd(16)]; return s + '…' + hex[rnd(16)] + hex[rnd(16)] + hex[rnd(16)] + hex[rnd(16)]; }
  function makeTx() {
    var risky = Math.random() < 0.22;
    var s = risky ? 70 + rnd(30) : (Math.random() < 0.25 ? 35 + rnd(30) : 2 + rnd(30));
    var reasons = [['Volume spike', 'Pico de volume'], ['New address', 'Endereço novo'], ['Rapid hops', 'Saltos rápidos'], ['Burst of transfers', 'Rajada de transferências']];
    return { h: hash(), a: assets[rnd(assets.length)], amt: (Math.random() * (risky ? 90 : 9) + 0.05).toFixed(2), s: s, r: reasons[rnd(reasons.length)] };
  }
  function addRow(tx) {
    var li = document.createElement('li');
    var cls = tx.s >= 70 ? 'high' : tx.s >= 35 ? 'mid' : '';
    li.className = 'row' + (tx.s >= 70 ? ' flag' : '');
    li.innerHTML = '<span class="h">' + tx.h + '<small>' + (tx.s >= 70 ? T(tx.r[0], tx.r[1]) : (tx.s >= 35 ? T('extra verification', 'verificação extra') : T('cleared', 'liberada'))) + '</small></span>' +
      '<span class="amt">' + tx.amt + ' ' + tx.a + '</span>' +
      '<span class="score ' + cls + '"><i style="--s:' + tx.s + '%"></i><em>' + tx.s + '</em></span>';
    rowsEl.insertBefore(li, rowsEl.firstChild);
    while (rowsEl.children.length > 7) rowsEl.removeChild(rowsEl.lastChild);
  }
  if (rowsEl) {
    for (var k = 0; k < 7; k++) addRow(makeTx());
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) setInterval(function () { if (!document.hidden) addRow(makeTx()); }, 1700);
  }

  /* ---------- Risk scorer demo ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var ids = ['amount', 'freq', 'age', 'hops'];
  function score() {
    if (!$('i-amount')) return;
    var mult = +$('i-amount').value, freq = +$('i-freq').value, age = +$('i-age').value, hops = +$('i-hops').value, flagged = $('i-flag').checked;
    $('o-amount').textContent = mult + '×';
    $('o-freq').textContent = freq;
    $('o-age').textContent = age + T(' days', ' dias');
    $('o-hops').textContent = hops;

    var pts = [], why = [];
    var pa = Math.log(mult) / Math.log(50) * 28;
    var pf = Math.pow(Math.min(freq / 60, 1), 0.8) * 22;
    var pg = (1 - Math.min(age / 365, 1)) * 18;
    var ph = Math.min(hops / 8, 1) * 20;
    var pc = flagged ? 40 : 0;
    var total = Math.round(Math.min(100, pa + pf + pg + ph + pc));

    if (pa >= 14) why.push(T('Amount is ' + mult + '× the wallet\'s usual size.', 'O valor é ' + mult + '× o tamanho usual da carteira.'));
    if (pf >= 11) why.push(T(freq + ' transfers in one hour is a sudden burst of activity.', freq + ' transferências em uma hora é uma rajada repentina de atividade.'));
    if (pg >= 9) why.push(T('Recipient address is only ' + age + ' days old.', 'O endereço de destino tem apenas ' + age + ' dias.'));
    if (ph >= 10) why.push(T(hops + ' intermediary hops can hide the origin of funds.', hops + ' saltos intermediários podem esconder a origem dos fundos.'));
    if (flagged) why.push(T('Recipient is linked to a past fraud case.', 'O destinatário está ligado a um caso de fraude anterior.'));
    if (!why.length) why.push(T('No strong fraud signals found.', 'Nenhum sinal forte de fraude encontrado.'));

    $('score').textContent = total;
    var arc = $('arc');
    arc.setAttribute('stroke-dasharray', total + ' 100');
    var level = total >= 70 ? 'bad' : total >= 35 ? 'warn' : 'ok';
    arc.setAttribute('stroke', level === 'bad' ? '#FF5C6C' : level === 'warn' ? '#FFB547' : '#4ADE9B');
    var a = $('action');
    a.className = 'action ' + level;
    a.innerHTML = {
      ok: '<b>' + T('Allow', 'Liberar') + '</b><span>' + T('Low risk. No action needed.', 'Risco baixo. Nenhuma ação necessária.') + '</span>',
      warn: '<b>' + T('Verify first', 'Verificar antes') + '</b><span>' + T('Ask for further verification before it settles.', 'Pedir verificação adicional antes de concluir.') + '</span>',
      bad: '<b>' + T('Suspend and alert', 'Suspender e alertar') + '</b><span>' + T('Hold the transaction and notify the exchange and parties involved.', 'Reter a transação e avisar a exchange e as partes envolvidas.') + '</span>'
    }[level];
    $('reasons').innerHTML = why.map(function (w) { return '<li>' + w + '</li>'; }).join('');
  }
  ['i-amount', 'i-freq', 'i-age', 'i-hops', 'i-flag'].forEach(function (id) {
    var el = $(id); if (el) el.addEventListener('input', score);
  });

  /* ---------- Financial chart ---------- */
  var chart = $('chart');
  if (chart) {
    var years = ['1', '2', '3', '4', '5'];
    var sales = [550000, 1265000, 2403500, 3845600, 5768400];
    var net = [29058, 130409, 566565, 1168212, 2140071];
    var W = 720, H = 330, pl = 56, pb = 34, pt = 16, max = 6000000;
    var bw = 46, gap = (W - pl - 10) / 5;
    var svg = '';
    [0, 2, 4, 6].forEach(function (m) {
      var y = H - pb - (m * 1e6 / max) * (H - pb - pt);
      svg += '<line x1="' + pl + '" x2="' + (W - 6) + '" y1="' + y + '" y2="' + y + '" stroke="#CBD2E6"/>' +
        '<text x="' + (pl - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="12" fill="#56607F">$' + m + 'M</text>';
    });
    years.forEach(function (yr, i) {
      var x = pl + i * gap + (gap - bw * 2 - 6) / 2;
      var hs = sales[i] / max * (H - pb - pt), hn = net[i] / max * (H - pb - pt);
      svg += '<rect x="' + x + '" y="' + (H - pb - hs) + '" width="' + bw + '" height="' + hs + '" rx="4" fill="#DDE3FF" stroke="#3446E0"/>' +
        '<rect x="' + (x + bw + 6) + '" y="' + (H - pb - hn) + '" width="' + bw + '" height="' + Math.max(hn, 2) + '" rx="4" fill="#3446E0"/>' +
        '<text class="yl" x="' + (x + bw + 3) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="13" fill="#141B34" data-y="' + yr + '"></text>';
    });
    chart.innerHTML = svg;
    var labelYears = function () {
      chart.querySelectorAll('.yl').forEach(function (t) { t.textContent = T('Year ', 'Ano ') + t.dataset.y; });
    };
    labelYears();
    document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', labelYears); });
  }

  setLang(lang);
})();
