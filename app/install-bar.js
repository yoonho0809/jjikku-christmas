// 웹판(아이폰·안드로이드 브라우저)에서만: 홈 화면 설치 안내 막대. 앱(APK)·로컬 개발에서는 아무것도 안 함.
(function () {
  var h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return;
  var ua = navigator.userAgent, android = /Android/i.test(ua), ios = /iPhone|iPad|iPod/i.test(ua);
  // 카카오톡 안 브라우저는 설치·카메라가 막힘 → 안드로이드는 바깥 크롬으로 바로 넘김
  if (/KAKAOTALK/i.test(ua) && android) { location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(location.href); return; }
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) return;
  try { if (localStorage.getItem('jk-install-off')) return; } catch (e) {}
  var prompt = null;
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); prompt = e; btn.style.display = ''; bar.querySelector('span').textContent = '찍꾸를 홈 화면에 앱으로 설치할 수 있어요'; });
  var bar = document.createElement('div');
  bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', '홈 화면에 설치');
  bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:99999;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:#1b3c35;color:#f6efe3;font:14px/1.45 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25)';
  var msg = /KAKAOTALK/i.test(ua) ? '카카오톡 안에서는 설치가 안 돼요. 오른쪽 아래 ⋯ → 「Safari로 열기」'
    : ios ? '앱처럼 쓰려면: 아래 공유 버튼 ⬆ → 「홈 화면에 추가」'
    : '앱처럼 쓰려면: 브라우저 메뉴 ⋮ → 「홈 화면에 추가」';
  bar.innerHTML = '<img src="./icons/icon-192.png" alt="" width="36" height="36" style="border-radius:8px;flex:none"><span style="flex:1">' + msg + '</span>';
  var btn = document.createElement('button');
  btn.textContent = '설치'; btn.style.cssText = 'display:none;flex:none;border:0;border-radius:10px;padding:8px 14px;background:#c9ae7a;color:#1b3c35;font-weight:700;font-size:14px';
  btn.onclick = function () { if (!prompt) return; prompt.prompt(); prompt.userChoice.then(function () { bar.remove(); }); };
  var x = document.createElement('button');
  x.textContent = '✕'; x.setAttribute('aria-label', '닫기'); x.style.cssText = 'flex:none;border:0;background:none;color:#f6efe3;font-size:18px;padding:4px 6px';
  x.onclick = function () { try { localStorage.setItem('jk-install-off', '1'); } catch (e) {} bar.remove(); };
  if (prompt) btn.style.display = '';
  bar.append(btn, x);
  // 다른 곳을 누르면(촬영 시작 등) 이번 방문에서는 치움 — 셔터 단추를 가리지 않게
  setTimeout(function () { document.addEventListener('click', function f(e) { if (!bar.contains(e.target)) { bar.remove(); document.removeEventListener('click', f, true); } }, true); }, 0);
  (document.body ? Promise.resolve() : new Promise(function (r) { addEventListener('DOMContentLoaded', r); })).then(function () { document.body.appendChild(bar); });
})();
